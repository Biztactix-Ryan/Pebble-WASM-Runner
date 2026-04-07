# Tasks

| ID | Title | Status | Points | Tags | Assignee | Depends On | Story |
| -- | ----- | ------ | ------ | ---- | -------- | ---------- | ----- |
| [US-PRJ-1-1](tasks/US-PRJ-1-1.md) | Test: FEED/BEEF packet format documented | ✅ done | — |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-1-2](tasks/US-PRJ-1-2.md) | Test: UART creation path in pebble.c understood | ✅ done | — |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-1-3](tasks/US-PRJ-1-3.md) | Test: Control protocol handler flow in pebble_control.c mapped | ✅ done | — |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-1-4](tasks/US-PRJ-1-4.md) | Test: Current Emscripten export surface identified | ✅ done | — |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-1-5](tasks/US-PRJ-1-5.md) | Read and annotate pebble_control.c FEED/BEEF packet handler | ✅ done | 1 |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-1-6](tasks/US-PRJ-1-6.md) | Read and annotate pebble.c UART creation path | ✅ done | 1 |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-1-7](tasks/US-PRJ-1-7.md) | Map current Emscripten export surface | ✅ done | 1 |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-1-8](tasks/US-PRJ-1-8.md) | Write FEED/BEEF protocol specification document | ✅ done | 1 |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-1-9](tasks/US-PRJ-1-9.md) | TEST: Verify spec against actual packet captures | ⚪ todo | 1 |  | — | — | [US-PRJ-1](stories/US-PRJ-1.md) |
| [US-PRJ-10-1](tasks/US-PRJ-10-1.md) | Test: PutBytes INIT message format documented (fields sizes byte order) | ⚪ todo | — |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-10](tasks/US-PRJ-10-10.md) | Document PutBytes COMMIT and ABORT message formats | ⚪ todo | 1 |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-11](tasks/US-PRJ-10-11.md) | Document PutBytes ACK response format and error codes | ⚪ todo | 1 |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-12](tasks/US-PRJ-10-12.md) | Create PutBytes test vectors from libpebble2 | ⚪ todo | 1 |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-2](tasks/US-PRJ-10-2.md) | Test: DATA message format and max chunk size documented | ⚪ todo | — |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-3](tasks/US-PRJ-10-3.md) | Test: COMMIT message format and CRC algorithm identified | ⚪ todo | — |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-4](tasks/US-PRJ-10-4.md) | Test: ACK response format and status codes documented | ⚪ todo | — |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-5](tasks/US-PRJ-10-5.md) | Test: Object type codes listed (app binary resources worker file) | ⚪ todo | — |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-6](tasks/US-PRJ-10-6.md) | Test: Cookie/token handling understood | ⚪ todo | — |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-7](tasks/US-PRJ-10-7.md) | Read and annotate libpebble2/services/putbytes.py | ⚪ todo | 1 |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-8](tasks/US-PRJ-10-8.md) | Document PutBytes INIT message format | ⚪ todo | 1 |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-10-9](tasks/US-PRJ-10-9.md) | Document PutBytes DATA message format | ⚪ todo | 1 |  | — | — | [US-PRJ-10](stories/US-PRJ-10.md) |
| [US-PRJ-11-1](tasks/US-PRJ-11-1.md) | Test: buildPutBytesInit() constructs correct INIT message with object type size and index | ⚪ todo | — |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-10](tasks/US-PRJ-11-10.md) | Implement buildPutBytesCommit(cookie, crc) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-11](tasks/US-PRJ-11-11.md) | Implement buildPutBytesAbort(cookie) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-12](tasks/US-PRJ-11-12.md) | Implement CRC32 calculation | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-13](tasks/US-PRJ-11-13.md) | Implement parsePutBytesAck(buffer) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-14](tasks/US-PRJ-11-14.md) | TEST: INIT message byte layout matches spec (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-15](tasks/US-PRJ-11-15.md) | TEST: DATA message construction with various chunk sizes (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-16](tasks/US-PRJ-11-16.md) | TEST: CRC32 against known test vectors (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-17](tasks/US-PRJ-11-17.md) | TEST: ACK parsing for all status codes (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-18](tasks/US-PRJ-11-18.md) | TEST: Byte-comparison of all message types against libpebble2 reference (Node.js) | ⚪ todo | 2 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-2](tasks/US-PRJ-11-2.md) | Test: buildPutBytesData() constructs correct DATA message with cookie and chunk payload | ⚪ todo | — |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-3](tasks/US-PRJ-11-3.md) | Test: buildPutBytesCommit() constructs correct COMMIT message with CRC | ⚪ todo | — |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-4](tasks/US-PRJ-11-4.md) | Test: buildPutBytesAbort() constructs ABORT message | ⚪ todo | — |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-5](tasks/US-PRJ-11-5.md) | Test: All messages use correct byte order and field sizes | ⚪ todo | — |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-6](tasks/US-PRJ-11-6.md) | Test: CRC32 calculation implemented correctly | ⚪ todo | — |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-7](tasks/US-PRJ-11-7.md) | Define PutBytes protocol constants | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-8](tasks/US-PRJ-11-8.md) | Implement buildPutBytesInit(objectType, objectSize, bankIndex) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-11-9](tasks/US-PRJ-11-9.md) | Implement buildPutBytesData(cookie, chunkData) | ⚪ todo | 1 |  | — | — | [US-PRJ-11](stories/US-PRJ-11.md) |
| [US-PRJ-12-1](tasks/US-PRJ-12-1.md) | Test: Accepts ArrayBuffer + object type + bank index as input | ⚪ todo | — |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-10](tasks/US-PRJ-12-10.md) | Implement chunking logic | ⚪ todo | 1 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-11](tasks/US-PRJ-12-11.md) | Implement ack waiting with timeout | ⚪ todo | 1 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-12](tasks/US-PRJ-12-12.md) | Implement error handling and abort flow | ⚪ todo | 1 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-13](tasks/US-PRJ-12-13.md) | Implement progress callback | ⚪ todo | 1 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-14](tasks/US-PRJ-12-14.md) | TEST: Chunking logic in isolation (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-15](tasks/US-PRJ-12-15.md) | TEST: Full transfer sequence with mock bridge (Node.js) | ⚪ todo | 2 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-16](tasks/US-PRJ-12-16.md) | TEST: Error ACK triggers abort (Node.js, mock bridge) | ⚪ todo | 1 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-17](tasks/US-PRJ-12-17.md) | TEST: Timeout triggers abort (Node.js, mock bridge) | ⚪ todo | 1 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-18](tasks/US-PRJ-12-18.md) | TEST: Progress callback fires correctly (Node.js, mock bridge) | ⚪ todo | 1 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-19](tasks/US-PRJ-12-19.md) | TEST: Integration — PutBytes transfer to WASM emulator (Linux headless) | ⚪ todo | 2 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-2](tasks/US-PRJ-12-2.md) | Test: Sends INIT and waits for ack with cookie | ⚪ todo | — |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-3](tasks/US-PRJ-12-3.md) | Test: Chunks data into appropriate size (2000 bytes default) | ⚪ todo | — |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-4](tasks/US-PRJ-12-4.md) | Test: Sends each DATA chunk and waits for ack | ⚪ todo | — |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-5](tasks/US-PRJ-12-5.md) | Test: Sends COMMIT with CRC after all data | ⚪ todo | — |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-6](tasks/US-PRJ-12-6.md) | Test: Handles error acks by aborting and reporting | ⚪ todo | — |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-7](tasks/US-PRJ-12-7.md) | Test: Reports progress (bytes sent / total) via callback | ⚪ todo | — |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-8](tasks/US-PRJ-12-8.md) | Test: Async/promise-based API for clean orchestration | ⚪ todo | — |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-12-9](tasks/US-PRJ-12-9.md) | Implement PutBytes transfer engine class | ⚪ todo | 2 |  | — | — | [US-PRJ-12](stories/US-PRJ-12.md) |
| [US-PRJ-13-1](tasks/US-PRJ-13-1.md) | Test: Full install message sequence documented step by step | ⚪ todo | — |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-10](tasks/US-PRJ-13-10.md) | Document AppRunState and completion signaling | ⚪ todo | 1 |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-11](tasks/US-PRJ-13-11.md) | Read pebble_tool/commands/install.py for command-level flow | ⚪ todo | 1 |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-12](tasks/US-PRJ-13-12.md) | Create install sequence diagram | ⚪ todo | 1 |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-2](tasks/US-PRJ-13-2.md) | Test: AppFetch request/response format documented | ⚪ todo | — |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-3](tasks/US-PRJ-13-3.md) | Test: Install slot assignment protocol understood | ⚪ todo | — |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-4](tasks/US-PRJ-13-4.md) | Test: Order of PutBytes transfers (binary then resources then worker) confirmed | ⚪ todo | — |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-5](tasks/US-PRJ-13-5.md) | Test: Completion and error signaling mechanisms documented | ⚪ todo | — |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-6](tasks/US-PRJ-13-6.md) | Test: AppRunState message format documented | ⚪ todo | — |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-7](tasks/US-PRJ-13-7.md) | Read and annotate libpebble2/services/install.py full install sequence | ⚪ todo | 1 |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-8](tasks/US-PRJ-13-8.md) | Document AppFetch request/response protocol | ⚪ todo | 1 |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-13-9](tasks/US-PRJ-13-9.md) | Document install slot assignment protocol | ⚪ todo | 1 |  | — | — | [US-PRJ-13](stories/US-PRJ-13.md) |
| [US-PRJ-14-1](tasks/US-PRJ-14-1.md) | Test: Parse AppFetch request from emulator | ⚪ todo | — |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-10](tasks/US-PRJ-14-10.md) | Implement AppFetch response builder | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-11](tasks/US-PRJ-14-11.md) | Implement install slot (PutBytes bank) assignment parser | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-12](tasks/US-PRJ-14-12.md) | Implement AppRunState message parser | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-13](tasks/US-PRJ-14-13.md) | TEST: Packet framing roundtrip (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-14](tasks/US-PRJ-14-14.md) | TEST: AppFetch request parsing from known bytes (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-15](tasks/US-PRJ-14-15.md) | TEST: AppFetch response byte layout matches reference (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-16](tasks/US-PRJ-14-16.md) | TEST: Unknown/malformed message handling (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-17](tasks/US-PRJ-14-17.md) | TEST: All protocol constants match libpebble2 values (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-2](tasks/US-PRJ-14-2.md) | Test: Build AppFetch response with app metadata | ⚪ todo | — |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-3](tasks/US-PRJ-14-3.md) | Test: Parse install slot assignment | ⚪ todo | — |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-4](tasks/US-PRJ-14-4.md) | Test: Build and parse AppRunState messages | ⚪ todo | — |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-5](tasks/US-PRJ-14-5.md) | Test: Protocol endpoint IDs defined as constants | ⚪ todo | — |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-6](tasks/US-PRJ-14-6.md) | Test: Message parsing handles unknown/unexpected messages gracefully | ⚪ todo | — |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-7](tasks/US-PRJ-14-7.md) | Define Pebble protocol endpoint ID constants | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-8](tasks/US-PRJ-14-8.md) | Implement generic Pebble protocol framing: buildPacket() and parsePacket() | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-14-9](tasks/US-PRJ-14-9.md) | Implement AppFetch request parser | ⚪ todo | 1 |  | — | — | [US-PRJ-14](stories/US-PRJ-14.md) |
| [US-PRJ-15-1](tasks/US-PRJ-15-1.md) | Test: Takes parsed PBW object as input | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-10](tasks/US-PRJ-15-10.md) | Test: Async API - returns promise that resolves on success or rejects on error | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-11](tasks/US-PRJ-15-11.md) | Create PebbleInstaller class skeleton | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-12](tasks/US-PRJ-15-12.md) | Implement metadata send phase | ⚪ todo | 2 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-13](tasks/US-PRJ-15-13.md) | Implement slot request handling | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-14](tasks/US-PRJ-15-14.md) | Wire PutBytes for app binary transfer | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-15](tasks/US-PRJ-15-15.md) | Wire PutBytes for resources transfer | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-16](tasks/US-PRJ-15-16.md) | Wire PutBytes for worker transfer | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-17](tasks/US-PRJ-15-17.md) | Implement completion detection | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-18](tasks/US-PRJ-15-18.md) | Implement error handling at each phase | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-19](tasks/US-PRJ-15-19.md) | Implement progress event emission | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-2](tasks/US-PRJ-15-2.md) | Test: Sends app metadata via AppFetch response | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-20](tasks/US-PRJ-15-20.md) | TEST: Full install with mock bridge — app only (Node.js) | ⚪ todo | 2 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-21](tasks/US-PRJ-15-21.md) | TEST: Full install with mock bridge — app + resources + worker (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-22](tasks/US-PRJ-15-22.md) | TEST: Error at metadata phase (Node.js, mock bridge) | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-23](tasks/US-PRJ-15-23.md) | TEST: Error during PutBytes binary transfer (Node.js, mock bridge) | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-24](tasks/US-PRJ-15-24.md) | TEST: Slot assignment timeout (Node.js, mock bridge) | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-25](tasks/US-PRJ-15-25.md) | TEST: Progress events fire in correct order (Node.js, mock bridge) | ⚪ todo | 1 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-26](tasks/US-PRJ-15-26.md) | TEST: Integration — install real PBW into WASM emulator (Linux headless) | ⚪ todo | 3 |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-3](tasks/US-PRJ-15-3.md) | Test: Handles slot request from PebbleOS | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-4](tasks/US-PRJ-15-4.md) | Test: Sends app binary via PutBytes engine | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-5](tasks/US-PRJ-15-5.md) | Test: Sends resources via PutBytes if present | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-6](tasks/US-PRJ-15-6.md) | Test: Sends worker via PutBytes if present | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-7](tasks/US-PRJ-15-7.md) | Test: Detects and reports completion | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-8](tasks/US-PRJ-15-8.md) | Test: Detects and reports errors at each phase | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-15-9](tasks/US-PRJ-15-9.md) | Test: Emits progress events for UI consumption | ⚪ todo | — |  | — | — | [US-PRJ-15](stories/US-PRJ-15.md) |
| [US-PRJ-16-1](tasks/US-PRJ-16-1.md) | Test: Upload a known-good .pbw file | ⚪ todo | — |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-10](tasks/US-PRJ-16-10.md) | TEST: E2E app install and verify running | ⚪ todo | 1 |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-11](tasks/US-PRJ-16-11.md) | TEST: E2E app with resources install | ⚪ todo | 1 |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-12](tasks/US-PRJ-16-12.md) | TEST: E2E error handling — corrupt PBW | ⚪ todo | 1 |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-13](tasks/US-PRJ-16-13.md) | Create CI-compatible test runner script | ⚪ todo | 1 |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-2](tasks/US-PRJ-16-2.md) | Test: Parser extracts all components correctly | ⚪ todo | — |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-3](tasks/US-PRJ-16-3.md) | Test: Metadata is accepted by emulated PebbleOS | ⚪ todo | — |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-4](tasks/US-PRJ-16-4.md) | Test: Binary transfer completes without errors | ⚪ todo | — |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-5](tasks/US-PRJ-16-5.md) | Test: App appears and runs in the emulator | ⚪ todo | — |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-6](tasks/US-PRJ-16-6.md) | Test: Test with at least one watchface and one app PBW | ⚪ todo | — |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-7](tasks/US-PRJ-16-7.md) | Gather test PBW fixtures | ⚪ todo | 1 |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-8](tasks/US-PRJ-16-8.md) | Create automated e2e test script | ⚪ todo | 2 |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-16-9](tasks/US-PRJ-16-9.md) | TEST: E2E watchface install and verify running | ⚪ todo | 1 |  | — | — | [US-PRJ-16](stories/US-PRJ-16.md) |
| [US-PRJ-17-1](tasks/US-PRJ-17-1.md) | Test: File upload button/dropzone in the UI | ⚪ todo | — |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-10](tasks/US-PRJ-17-10.md) | TEST: Playwright — upload valid PBW shows metadata | ⚪ todo | 1 |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-11](tasks/US-PRJ-17-11.md) | TEST: Playwright — upload invalid file shows error | ⚪ todo | 1 |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-12](tasks/US-PRJ-17-12.md) | TEST: Playwright — drag and drop upload works | ⚪ todo | 1 |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-2](tasks/US-PRJ-17-2.md) | Test: After upload parsed metadata is displayed (name version company) | ⚪ todo | — |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-3](tasks/US-PRJ-17-3.md) | Test: Watchface vs app type is indicated | ⚪ todo | — |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-4](tasks/US-PRJ-17-4.md) | Test: Invalid PBW shows a clear error message | ⚪ todo | — |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-5](tasks/US-PRJ-17-5.md) | Test: UI integrates with existing index.html emulator page | ⚪ todo | — |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-6](tasks/US-PRJ-17-6.md) | Add PBW upload panel to index.html | ⚪ todo | 1 |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-7](tasks/US-PRJ-17-7.md) | Wire file input to PBW parser | ⚪ todo | 1 |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-8](tasks/US-PRJ-17-8.md) | Display app type indicator | ⚪ todo | 1 |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-17-9](tasks/US-PRJ-17-9.md) | Implement error display for invalid PBW | ⚪ todo | 1 |  | — | — | [US-PRJ-17](stories/US-PRJ-17.md) |
| [US-PRJ-18-1](tasks/US-PRJ-18-1.md) | Test: Install button enabled after PBW is loaded | ⚪ todo | — |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-10](tasks/US-PRJ-18-10.md) | Add success/error result display | ⚪ todo | 1 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-11](tasks/US-PRJ-18-11.md) | TEST: Playwright — button state transitions | ⚪ todo | 1 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-12](tasks/US-PRJ-18-12.md) | TEST: Playwright — progress bar updates during install | ⚪ todo | 1 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-13](tasks/US-PRJ-18-13.md) | TEST: Playwright — success message after install | ⚪ todo | 1 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-14](tasks/US-PRJ-18-14.md) | TEST: Playwright — error message on failed install | ⚪ todo | 1 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-15](tasks/US-PRJ-18-15.md) | TEST: Playwright — full user flow end-to-end | ⚪ todo | 2 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-2](tasks/US-PRJ-18-2.md) | Test: Progress bar shows transfer progress (bytes/total) | ⚪ todo | — |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-3](tasks/US-PRJ-18-3.md) | Test: Phase indicator shows current step (metadata/binary/resources/worker) | ⚪ todo | — |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-4](tasks/US-PRJ-18-4.md) | Test: Success message displayed when install completes | ⚪ todo | — |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-5](tasks/US-PRJ-18-5.md) | Test: Error message with details displayed on failure | ⚪ todo | — |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-6](tasks/US-PRJ-18-6.md) | Test: Button disabled during install to prevent double-submit | ⚪ todo | — |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-7](tasks/US-PRJ-18-7.md) | Add Install button with disabled/enabled states | ⚪ todo | 1 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-8](tasks/US-PRJ-18-8.md) | Wire Install button to PebbleInstaller | ⚪ todo | 1 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-18-9](tasks/US-PRJ-18-9.md) | Add progress bar component | ⚪ todo | 1 |  | — | — | [US-PRJ-18](stories/US-PRJ-18.md) |
| [US-PRJ-19-1](tasks/US-PRJ-19-1.md) | Test: pebble-qemu-wasm source cloned from ericmigi/pebble-qemu-wasm | ✅ done | — |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-10](tasks/US-PRJ-19-10.md) | Clone libpebble2 as read-only reference | ✅ done | 1 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-11](tasks/US-PRJ-19-11.md) | Clone pebble-tool as read-only reference | ✅ done | 1 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-12](tasks/US-PRJ-19-12.md) | Install Emscripten SDK and document build prerequisites | ✅ done | 1 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-13](tasks/US-PRJ-19-13.md) | Run build_wasm.sh and verify WASM output | ✅ done | 2 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-14](tasks/US-PRJ-19-14.md) | Obtain PebbleOS firmware image | ✅ done | 1 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-15](tasks/US-PRJ-19-15.md) | Boot emulator and verify PebbleOS runs | ✅ done | 1 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-16](tasks/US-PRJ-19-16.md) | Document project directory structure | ✅ done | 1 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-17](tasks/US-PRJ-19-17.md) | TEST: WASM build produces valid output (Linux) | ✅ done | 1 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-18](tasks/US-PRJ-19-18.md) | TEST: Emulator boots to watch face (Linux headless) | ✅ done | 2 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-2](tasks/US-PRJ-19-2.md) | Test: libpebble2 cloned from pebble/libpebble2 as reference | ✅ done | — |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-3](tasks/US-PRJ-19-3.md) | Test: pebble-tool cloned from pebble/pebble-tool as reference | ✅ done | — |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-4](tasks/US-PRJ-19-4.md) | Test: build_wasm.sh runs successfully and produces WASM output | ✅ done | — |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-5](tasks/US-PRJ-19-5.md) | Test: Emulator boots PebbleOS in a browser and shows the watch face | ✅ done | — |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-6](tasks/US-PRJ-19-6.md) | Test: PebbleOS firmware image is available and loads correctly | ✅ done | — |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-7](tasks/US-PRJ-19-7.md) | Test: Build dependencies (Emscripten SDK) documented | ✅ done | — |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-8](tasks/US-PRJ-19-8.md) | Test: Reference repos clearly marked as read-only in project structure | ✅ done | — |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-19-9](tasks/US-PRJ-19-9.md) | Clone pebble-qemu-wasm from ericmigi/pebble-qemu-wasm | ✅ done | 1 |  | — | — | [US-PRJ-19](stories/US-PRJ-19.md) |
| [US-PRJ-2-1](tasks/US-PRJ-2-1.md) | Test: JS function accepts protocol ID and ArrayBuffer payload | ⚪ todo | — |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-10](tasks/US-PRJ-2-10.md) | TEST: Unit test edge cases — empty, max-size, boundary payloads (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-11](tasks/US-PRJ-2-11.md) | TEST: Integration — send packet into WASM QEMU and verify arrival | ⚪ todo | 2 |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-2](tasks/US-PRJ-2-2.md) | Test: Function wraps payload in correct FEED packet framing | ⚪ todo | — |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-3](tasks/US-PRJ-2-3.md) | Test: Packet is delivered to the emulated Pebble UART | ⚪ todo | — |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-4](tasks/US-PRJ-2-4.md) | Test: Function is exported via Emscripten EXPORTED_FUNCTIONS | ⚪ todo | — |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-5](tasks/US-PRJ-2-5.md) | Test: Works from browser console for manual testing | ⚪ todo | — |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-6](tasks/US-PRJ-2-6.md) | Add C function pebble_control_send_packet() for JS-initiated packet injection | ⚪ todo | 2 |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-7](tasks/US-PRJ-2-7.md) | Add Emscripten export for packet send function | ⚪ todo | 1 |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-8](tasks/US-PRJ-2-8.md) | Write JS bridge wrapper: sendPebblePacket() | ⚪ todo | 1 |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-2-9](tasks/US-PRJ-2-9.md) | TEST: Unit test FEED packet framing (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-2](stories/US-PRJ-2.md) |
| [US-PRJ-3-1](tasks/US-PRJ-3-1.md) | Test: JS can register a callback function for incoming packets | ⚪ todo | — |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-10](tasks/US-PRJ-3-10.md) | TEST: Unit test BEEF packet parsing (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-11](tasks/US-PRJ-3-11.md) | TEST: Integration — emulator sends packet, JS callback fires | ⚪ todo | 2 |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-2](tasks/US-PRJ-3-2.md) | Test: Callback receives parsed protocol ID and payload data | ⚪ todo | — |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-3](tasks/US-PRJ-3-3.md) | Test: BEEF packets from the emulator are routed to the callback | ⚪ todo | — |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-4](tasks/US-PRJ-3-4.md) | Test: Multiple callbacks or a dispatcher pattern is supported | ⚪ todo | — |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-5](tasks/US-PRJ-3-5.md) | Test: Works from browser console for manual testing | ⚪ todo | — |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-6](tasks/US-PRJ-3-6.md) | Add C-side callback hook for outgoing BEEF packets | ⚪ todo | 2 |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-7](tasks/US-PRJ-3-7.md) | Export callback registration function via Emscripten | ⚪ todo | 1 |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-8](tasks/US-PRJ-3-8.md) | Write JS packet dispatcher in pebble-bridge.js | ⚪ todo | 1 |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-3-9](tasks/US-PRJ-3-9.md) | TEST: Unit test dispatcher routing (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-3](stories/US-PRJ-3.md) |
| [US-PRJ-4-1](tasks/US-PRJ-4-1.md) | Test: Send a ping or version request and get a valid response | ⚪ todo | — |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-10](tasks/US-PRJ-4-10.md) | TEST: Boot-and-bridge CI smoke test | ⚪ todo | 2 |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-2](tasks/US-PRJ-4-2.md) | Test: Verify packet framing is correct in both directions | ⚪ todo | — |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-3](tasks/US-PRJ-4-3.md) | Test: Test with the WASM build (not just native QEMU) | ⚪ todo | — |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-4](tasks/US-PRJ-4-4.md) | Test: Document the bridge API for downstream consumers | ⚪ todo | — |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-5](tasks/US-PRJ-4-5.md) | Create bridge test harness script | ⚪ todo | 1 |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-6](tasks/US-PRJ-4-6.md) | Implement ping/version roundtrip test | ⚪ todo | 1 |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-7](tasks/US-PRJ-4-7.md) | Document bridge API for downstream consumers | ⚪ todo | 1 |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-8](tasks/US-PRJ-4-8.md) | TEST: Bidirectional packet integrity verification | ⚪ todo | 1 |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-4-9](tasks/US-PRJ-4-9.md) | TEST: Rapid packet stress test | ⚪ todo | 1 |  | — | — | [US-PRJ-4](stories/US-PRJ-4.md) |
| [US-PRJ-5-1](tasks/US-PRJ-5-1.md) | Test: File input accepts .pbw files | ⚪ todo | — |  | — | — | [US-PRJ-5](stories/US-PRJ-5.md) |
| [US-PRJ-5-2](tasks/US-PRJ-5-2.md) | Test: File is read as ArrayBuffer using FileReader API | ⚪ todo | — |  | — | — | [US-PRJ-5](stories/US-PRJ-5.md) |
| [US-PRJ-5-3](tasks/US-PRJ-5-3.md) | Test: Handles missing or invalid file gracefully | ⚪ todo | — |  | — | — | [US-PRJ-5](stories/US-PRJ-5.md) |
| [US-PRJ-5-4](tasks/US-PRJ-5-4.md) | Test: Works in all modern browsers | ⚪ todo | — |  | — | — | [US-PRJ-5](stories/US-PRJ-5.md) |
| [US-PRJ-5-5](tasks/US-PRJ-5-5.md) | Create pbw-loader.js module with File API reader | ⚪ todo | 1 |  | — | — | [US-PRJ-5](stories/US-PRJ-5.md) |
| [US-PRJ-5-6](tasks/US-PRJ-5-6.md) | Add file validation: zip magic byte check | ⚪ todo | 1 |  | — | — | [US-PRJ-5](stories/US-PRJ-5.md) |
| [US-PRJ-5-7](tasks/US-PRJ-5-7.md) | TEST: Unit test file reading with mock File objects (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-5](stories/US-PRJ-5.md) |
| [US-PRJ-5-8](tasks/US-PRJ-5-8.md) | TEST: Unit test rejection of non-PBW files (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-5](stories/US-PRJ-5.md) |
| [US-PRJ-6-1](tasks/US-PRJ-6-1.md) | Test: JSZip library integrated | ⚪ todo | — |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-10](tasks/US-PRJ-6-10.md) | Add error handling for malformed PBW bundles | ⚪ todo | 1 |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-11](tasks/US-PRJ-6-11.md) | TEST: Unit test extraction from known-good PBW fixtures (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-12](tasks/US-PRJ-6-12.md) | TEST: Unit test extraction of optional files (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-13](tasks/US-PRJ-6-13.md) | TEST: Unit test corrupt/invalid zip handling (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-2](tasks/US-PRJ-6-2.md) | Test: PBW zip contents are listed and accessible | ⚪ todo | — |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-3](tasks/US-PRJ-6-3.md) | Test: appinfo.json is extracted and parsed as JSON | ⚪ todo | — |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-4](tasks/US-PRJ-6-4.md) | Test: pebble-app.bin extracted as ArrayBuffer | ⚪ todo | — |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-5](tasks/US-PRJ-6-5.md) | Test: app_resources.pbpack extracted as ArrayBuffer if present | ⚪ todo | — |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-6](tasks/US-PRJ-6-6.md) | Test: worker.bin extracted as ArrayBuffer if present | ⚪ todo | — |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-7](tasks/US-PRJ-6-7.md) | Test: Handles malformed or incomplete PBW files with clear errors | ⚪ todo | — |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-8](tasks/US-PRJ-6-8.md) | Integrate JSZip library | ⚪ todo | 1 |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-6-9](tasks/US-PRJ-6-9.md) | Implement PBW zip extraction logic | ⚪ todo | 2 |  | — | — | [US-PRJ-6](stories/US-PRJ-6.md) |
| [US-PRJ-7-1](tasks/US-PRJ-7-1.md) | Test: Output object contains: uuid name version companyName appBinary resourcesBinary workerBinary sdkVersion appFlags | ⚪ todo | — |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-10](tasks/US-PRJ-7-10.md) | TEST: Integration test with real PBW files end-to-end (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-2](tasks/US-PRJ-7-2.md) | Test: Fields are null/undefined when not present in PBW | ⚪ todo | — |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-3](tasks/US-PRJ-7-3.md) | Test: UUID is validated as proper format | ⚪ todo | — |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-4](tasks/US-PRJ-7-4.md) | Test: Tested with multiple real PBW files | ⚪ todo | — |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-5](tasks/US-PRJ-7-5.md) | Define PBW output schema | ⚪ todo | 1 |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-6](tasks/US-PRJ-7-6.md) | Implement manifest parser and field mapper | ⚪ todo | 1 |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-7](tasks/US-PRJ-7-7.md) | Implement UUID validation | ⚪ todo | 1 |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-8](tasks/US-PRJ-7-8.md) | TEST: Unit test parser with known manifest fixtures (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-7-9](tasks/US-PRJ-7-9.md) | TEST: Unit test UUID validation (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-7](stories/US-PRJ-7.md) |
| [US-PRJ-8-1](tasks/US-PRJ-8-1.md) | Test: Document exact metadata binary layout (fields sizes offsets byte order) | ⚪ todo | — |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-8-2](tasks/US-PRJ-8-2.md) | Test: Identify all protocol message types involved (AppFetch etc.) | ⚪ todo | — |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-8-3](tasks/US-PRJ-8-3.md) | Test: Map manifest JSON fields to protocol metadata fields | ⚪ todo | — |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-8-4](tasks/US-PRJ-8-4.md) | Test: Document app flag values and their meanings | ⚪ todo | — |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-8-5](tasks/US-PRJ-8-5.md) | Read and annotate libpebble2/services/install.py metadata handling | ⚪ todo | 1 |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-8-6](tasks/US-PRJ-8-6.md) | Read protocol definitions for AppFetch and related messages | ⚪ todo | 1 |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-8-7](tasks/US-PRJ-8-7.md) | Create binary layout reference document | ⚪ todo | 1 |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-8-8](tasks/US-PRJ-8-8.md) | Create test vectors from libpebble2 | ⚪ todo | 1 |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-8-9](tasks/US-PRJ-8-9.md) | TEST: Validate test vectors against PebbleOS documentation | ⚪ todo | 1 |  | — | — | [US-PRJ-8](stories/US-PRJ-8.md) |
| [US-PRJ-9-1](tasks/US-PRJ-9-1.md) | Test: UUID encoded as 16-byte binary correctly | ⚪ todo | — |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-10](tasks/US-PRJ-9-10.md) | Implement fixed-length string encoder | ⚪ todo | 1 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-11](tasks/US-PRJ-9-11.md) | Implement version and SDK version encoder | ⚪ todo | 1 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-12](tasks/US-PRJ-9-12.md) | Implement app flags resolver | ⚪ todo | 1 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-13](tasks/US-PRJ-9-13.md) | Implement complete metadata buffer builder | ⚪ todo | 1 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-14](tasks/US-PRJ-9-14.md) | TEST: UUID encoding roundtrip (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-15](tasks/US-PRJ-9-15.md) | TEST: String encoding padding and truncation (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-16](tasks/US-PRJ-9-16.md) | TEST: Byte-comparison against libpebble2 reference output (Node.js) | ⚪ todo | 2 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-17](tasks/US-PRJ-9-17.md) | TEST: Metadata for watchface vs app produces different flags (Node.js) | ⚪ todo | 1 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-2](tasks/US-PRJ-9-2.md) | Test: App name and company name encoded as fixed-length strings | ⚪ todo | — |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-3](tasks/US-PRJ-9-3.md) | Test: Version major/minor encoded correctly | ⚪ todo | — |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-4](tasks/US-PRJ-9-4.md) | Test: App flags (watchface vs app) set from manifest | ⚪ todo | — |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-5](tasks/US-PRJ-9-5.md) | Test: SDK version included | ⚪ todo | — |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-6](tasks/US-PRJ-9-6.md) | Test: Icon resource ID included | ⚪ todo | — |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-7](tasks/US-PRJ-9-7.md) | Test: Output is an ArrayBuffer ready to send as protocol payload | ⚪ todo | — |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-8](tasks/US-PRJ-9-8.md) | Test: Matches format expected by PebbleOS (verified against libpebble2 reference) | ⚪ todo | — |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
| [US-PRJ-9-9](tasks/US-PRJ-9-9.md) | Implement UUID string-to-binary encoder | ⚪ todo | 1 |  | — | — | [US-PRJ-9](stories/US-PRJ-9.md) |
