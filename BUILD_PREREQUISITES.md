# Build Prerequisites

## WASM Build (build_wasm.sh)

The WASM build compiles QEMU with Pebble device model overlay to WebAssembly using Emscripten inside Docker.

### Requirements

1. **Docker** — Emscripten SDK runs inside a Docker container
2. **QEMU 10.1.0 source** — Downloaded separately, mounted into the container
3. **Disk space** — ~5GB for QEMU source + Docker image + build artifacts

### Setup

```bash
# 1. Download QEMU 10.1.0 source
cd /home/ryan/dev
wget https://download.qemu.org/qemu-10.1.0.tar.xz
tar xf qemu-10.1.0.tar.xz

# 2. Build the Docker image (uses QEMU's bundled Emscripten Dockerfile)
docker build --progress=plain -t qemu101-wasm-base - < /home/ryan/dev/qemu-10.1.0/tests/docker/dockerfiles/emsdk-wasm32-cross.docker

# 3. Run the WASM build
cd /home/ryan/repo/Internal/Pebble-WASM-Runner/pebble-qemu-wasm
QEMU_SRC=/home/ryan/dev/qemu-10.1.0 bash build_wasm.sh
```

### Build Output

The build produces three files in `pebble-qemu-wasm/web/`:
- `qemu-system-arm.js` — Emscripten JS glue
- `qemu-system-arm.wasm` — WASM binary
- `qemu-system-arm.worker.js` — Web Worker for threading

### Key Build Flags

- `--enable-tcg-interpreter` — TCI (portable code gen, required for WASM)
- `-DSTM32_UART_NO_BAUD_DELAY` — Skip UART timing for faster emulation
- `-DTCI_INSTRUMENT` — TCI performance instrumentation
- `-flto -msimd128` — LTO + WASM SIMD optimization

## Firmware

PebbleOS firmware images (`qemu_micro_flash.bin`, `qemu_spi_flash.bin`) are needed to boot the emulator. These come from the Pebble SDK 4.9.77. See the `firmware/` directory in pebble-qemu-wasm.

## Native Build (build.sh)

For local debugging without WASM, see `build.sh` and the CLAUDE.md in pebble-qemu-wasm for native build instructions.
