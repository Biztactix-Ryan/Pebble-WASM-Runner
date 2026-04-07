# Pebble WASM Runner

Browser-based Pebble smartwatch emulator with PBW app installation support. Runs the original PebbleOS firmware in QEMU compiled to WebAssembly, with a JavaScript protocol stack for installing apps directly from the browser.

## Architecture

```
PBW File (ZIP)
  -> pbw-parser.mjs (extract manifest, binary, resources)
  -> app-installer.mjs (orchestrate install protocol)
     -> pebble-protocol.mjs (BlobDB, AppRunState, AppFetch framing)
     -> putbytes-transfer.mjs (chunked binary transfer)
        -> putbytes.mjs (message builders)
        -> stm32-crc32.mjs (STM32-compatible CRC)
     -> emulator-bridge.mjs (FEED/BEEF serial bridge to QEMU WASM)
        -> QEMU WASM (ARM emulation + PebbleOS firmware)
```

## Status

- Emulator boots PebbleOS v4.9.77 in the browser
- PBW parsing, protocol stack, and install orchestration implemented (226 tests passing)
- WASM serial bridge C-side implemented, pending rebuild

## Quick Start

```sh
cd pebble-qemu-wasm
python3 server.py 8000
# Open http://localhost:8000
```

Requires firmware files in `pebble-qemu-wasm/firmware/` (not included, see Firmware section below).

## Building the WASM Binary

```sh
cd pebble-qemu-wasm
QEMU_SRC=/path/to/qemu-10.1.0 bash build_wasm.sh
```

Requires Docker and QEMU 10.1 source. See `pebble-qemu-wasm/README.md` for full build instructions.

## Running Tests

```sh
cd pebble-qemu-wasm
for f in lib/*.test.mjs; do node "$f"; done
```

## Firmware

PebbleOS firmware is proprietary and not included. Firmware files from the Pebble SDK 4.9.77 (emery platform) are required:

- `qemu_micro_flash.bin` — bootloader + firmware (~827KB)
- `qemu_spi_flash.bin` — SPI flash filesystem (~16MB, stored compressed as `.bz2` in the SDK)

Place these in `pebble-qemu-wasm/firmware/full/` and `pebble-qemu-wasm/firmware/sdk/`.

## Acknowledgments and Attribution

This project builds on the work of several open-source projects and contributors:

### pebble-qemu-wasm
**Author:** [Eric Migicovsky](https://github.com/ericmigi) and contributors
**Repository:** [ericmigi/pebble-qemu-wasm](https://github.com/ericmigi/pebble-qemu-wasm)
**License:** GPLv2 (QEMU)

The QEMU WASM emulator that boots PebbleOS in the browser. Ports ~8,500 lines of Pebble device model C code from QEMU 2.5 to QEMU 10.1 and compiles to WebAssembly via Emscripten. Our `pebble-qemu-wasm/` directory is a fork of this repository with modifications for the serial bridge and install UI.

### QEMU
**Authors:** Fabrice Bellard, the QEMU team, and contributors
**Website:** [qemu.org](https://www.qemu.org/)
**License:** GPLv2

The underlying machine emulator. Version 10.1 is used for the WASM build with TCI (Tiny Code Interpreter) backend.

### Pebble QEMU Fork (qemu-pebble)
**Authors:** Pebble Technology / [nicethings](https://github.com/nicethings)
**Repository:** [nicethings/qemu-pebble](https://github.com/nicethings/qemu-pebble)
**License:** GPLv2

Original QEMU 2.5 fork with STM32F4 peripheral emulation and Pebble board definitions. The device model source code (`hw/arm/pebble*.c`, `hw/misc/stm32_*.c`, etc.) originates from this repository.

### libpebble2
**Author:** [Katharine Berry](https://github.com/Katharine) (Pebble)
**Repository:** [pebble/libpebble2](https://github.com/pebble/libpebble2)
**License:** MIT

Python library implementing the Pebble Protocol. Our JavaScript protocol stack (PutBytes, BlobDB, AppRunState, AppFetch, STM32 CRC-32) was ported from this library's protocol definitions and service implementations.

### pebble-tool
**Author:** [Katharine Berry](https://github.com/Katharine) (Pebble) and contributors
**Repository:** [pebble/pebble-tool](https://github.com/pebble/pebble-tool)
**License:** MIT

The official Pebble CLI tool. Used as reference for the app install orchestration sequence (BlobDB metadata insertion, AppFetch handshake, PutBytes transfer ordering).

### fflate
**Author:** [Arjun Barrett](https://github.com/101arrowz)
**Repository:** [101arrowz/fflate](https://github.com/101arrowz/fflate)
**License:** MIT

High-performance JavaScript compression library used for PBW (ZIP) extraction in the browser.

### coi-serviceworker
**Author:** [Guido Zuidhof](https://github.com/nicethings) and contributors
**License:** MIT

Service worker that adds COOP/COEP headers for SharedArrayBuffer support, required by Emscripten's threading model.

## License

This project contains code under multiple licenses:

- **QEMU device models and modifications** (`pebble-qemu-wasm/hw/`, patches): **GPLv2** (inherited from QEMU and qemu-pebble)
- **JavaScript protocol libraries** (`pebble-qemu-wasm/lib/`): **MIT**
- **Documentation** (`docs/`): **MIT**

See individual files for specific license information.
