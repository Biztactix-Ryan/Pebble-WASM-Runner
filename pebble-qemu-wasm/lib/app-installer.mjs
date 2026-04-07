/**
 * App install orchestrator — ties together BlobDB, AppRunState, AppFetch,
 * and PutBytes to install a parsed PBW into the emulator.
 *
 * Implements the modern v3+ install flow:
 *   1. BlobDB INSERT (app metadata)
 *   2. AppRunState Start (trigger install)
 *   3. Wait for AppFetchRequest from firmware
 *   4. AppFetchResponse (status=Start)
 *   5. PutBytes: app binary
 *   6. PutBytes: resources (if present)
 *   7. PutBytes: worker (if present)
 *
 * Requires a "bridge" that can send/receive on specific Pebble Protocol endpoints.
 */

import {
  Endpoint,
  framePebblePacket,
  BlobDatabaseID,
  BlobStatus,
  buildBlobDBInsert,
  parseBlobDBResponse,
  buildAppRunStateStart,
  AppFetchStatus,
  parseAppFetchRequest,
  buildAppFetchResponse,
  serialiseAppMetadata,
  uuidEqual,
} from './pebble-protocol.mjs';

import { ObjectType } from './putbytes.mjs';
import { putBytesTransfer } from './putbytes-transfer.mjs';

/**
 * @typedef {Object} InstallBridge
 * @property {(endpoint: number, payload: Uint8Array, timeout?: number) => Promise<Uint8Array>} sendAndReceive
 *   Send a Pebble Protocol message and wait for a response on the same endpoint.
 * @property {(endpoint: number, timeout?: number) => Promise<Uint8Array>} waitForMessage
 *   Wait for an unsolicited message on a specific endpoint (e.g. AppFetchRequest).
 */

/**
 * @typedef {Object} InstallOptions
 * @property {number} [timeout=15000] - Timeout per command in ms
 * @property {(phase: string, sent: number, total: number) => void} [onProgress] - Progress callback
 */

class InstallError extends Error {
  constructor(message, phase) {
    super(message);
    this.name = 'InstallError';
    this.phase = phase;
  }
}

/**
 * Install a parsed PBW into the emulator.
 *
 * @param {InstallBridge} bridge - Communication bridge to the emulator
 * @param {import('./pbw-parser.mjs').ParsedPBW} pbw - Parsed PBW object
 * @param {InstallOptions} [options={}]
 * @returns {Promise<void>}
 * @throws {InstallError}
 */
export async function installApp(bridge, pbw, options = {}) {
  const { timeout = 15000, onProgress } = options;

  const { header, uuid, appBinary, resourcesBinary, workerBinary } = pbw;

  // Calculate total bytes for progress reporting
  let totalBytes = appBinary.length;
  if (resourcesBinary) totalBytes += resourcesBinary.length;
  if (workerBinary) totalBytes += workerBinary.length;
  let sentBytes = 0;

  function reportProgress(phase, phaseSent, phaseTotal) {
    if (onProgress) {
      onProgress(phase, sentBytes + phaseSent, totalBytes);
    }
  }

  // -- Step 1: BlobDB Insert (app metadata) --
  if (onProgress) onProgress('blobdb', 0, totalBytes);

  const metadata = serialiseAppMetadata({
    uuid,
    flags: header.flags,
    icon: header.iconResourceId,
    appVersionMajor: header.appVersionMajor,
    appVersionMinor: header.appVersionMinor,
    sdkVersionMajor: header.sdkVersionMajor,
    sdkVersionMinor: header.sdkVersionMinor,
    appName: header.appName,
  });

  const blobToken = Math.floor(Math.random() * 0xFFFE) + 1;
  const blobPayload = buildBlobDBInsert(blobToken, BlobDatabaseID.App, uuid, metadata);
  const blobResponse = await bridge.sendAndReceive(Endpoint.BlobDB, blobPayload, timeout);
  const blobResult = parseBlobDBResponse(blobResponse);

  if (blobResult.status !== BlobStatus.Success) {
    throw new InstallError(
      `BlobDB insert failed: status=0x${blobResult.status.toString(16)}`,
      'blobdb'
    );
  }

  // -- Step 2: AppRunState Start --
  const runStatePayload = buildAppRunStateStart(uuid);
  // We send AppRunState but the response comes on AppFetch endpoint (different endpoint)
  // So we send without waiting for a same-endpoint response, then wait for AppFetch.
  await bridge.sendAndReceive(Endpoint.AppRunState, runStatePayload, timeout);

  // -- Step 3: Wait for AppFetchRequest from firmware --
  const fetchRequestData = await bridge.waitForMessage(Endpoint.AppFetch, timeout);
  const fetchRequest = parseAppFetchRequest(fetchRequestData);

  if (!uuidEqual(fetchRequest.uuid, uuid)) {
    // Wrong UUID — respond with InvalidUUID and abort
    const errorResp = buildAppFetchResponse(AppFetchStatus.InvalidUUID);
    await bridge.sendAndReceive(Endpoint.AppFetch, errorResp, timeout).catch(() => {});
    throw new InstallError(
      'Firmware requested wrong UUID in AppFetch',
      'appfetch'
    );
  }

  const appId = fetchRequest.appId;

  // -- Step 4: AppFetchResponse (Start) --
  const fetchResponse = buildAppFetchResponse(AppFetchStatus.Start);
  // Send response (firmware doesn't reply to this)
  await bridge.sendAndReceive(Endpoint.AppFetch, fetchResponse, timeout);

  // -- Step 5: PutBytes app binary --
  await putBytesTransfer(bridge, {
    objectType: ObjectType.AppExecutable,
    data: appBinary,
    appId,
    timeout,
    onProgress: (phaseSent, phaseTotal) => reportProgress('binary', phaseSent, phaseTotal),
  });
  sentBytes += appBinary.length;

  // -- Step 6: PutBytes resources (if present) --
  if (resourcesBinary) {
    await putBytesTransfer(bridge, {
      objectType: ObjectType.AppResource,
      data: resourcesBinary,
      appId,
      timeout,
      onProgress: (phaseSent, phaseTotal) => reportProgress('resources', phaseSent, phaseTotal),
    });
    sentBytes += resourcesBinary.length;
  }

  // -- Step 7: PutBytes worker (if present) --
  if (workerBinary) {
    await putBytesTransfer(bridge, {
      objectType: ObjectType.Worker,
      data: workerBinary,
      appId,
      timeout,
      onProgress: (phaseSent, phaseTotal) => reportProgress('worker', phaseSent, phaseTotal),
    });
    sentBytes += workerBinary.length;
  }

  if (onProgress) onProgress('complete', totalBytes, totalBytes);
}

export { InstallError };
