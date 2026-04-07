# Project Directory Structure

```
Pebble-WASM-Runner/
├── .claude/              # Claude Code configuration
├── .project/             # Projectman epics, stories, tasks
├── .gitignore            # Excludes cloned repos from parent git
├── BUILD_PREREQUISITES.md
├── PROJECT_STRUCTURE.md
│
├── pebble-qemu-wasm/     # WORKING SOURCE — ericmigi/pebble-qemu-wasm (main branch)
│   ├── hw/               # QEMU device model source (Pebble overlay on QEMU 10.1)
│   │   ├── arm/          # Pebble board models, control protocol, SoC
│   │   │   ├── pebble.c              # Board init, UART creation, button input
│   │   │   ├── pebble_control.c      # FEED/BEEF protocol handler (host↔emu)
│   │   │   ├── pebble_control.h      # Control API
│   │   │   ├── pebble_robert.c       # Robert (Pebble 2) board
│   │   │   ├── pebble_silk.c         # Silk (diorite) board
│   │   │   └── pebble_stm32f4xx_soc.c  # STM32F4 SoC model
│   │   ├── char/         # UART (stm32_pebble_uart.c)
│   │   ├── display/      # Display driver (pebble_snowy_display.c)
│   │   ├── misc/         # RCC, clock tree, EXTI, I2C, flash, etc.
│   │   ├── timer/        # Timer and RTC
│   │   ├── ssi/          # SPI
│   │   ├── dma/          # DMA
│   │   └── gpio/         # GPIO
│   ├── include/hw/arm/   # Pebble header files
│   ├── firmware/         # PebbleOS firmware images (emery)
│   │   ├── qemu_micro_flash.bin   # Bootloader + firmware (827K)
│   │   └── qemu_spi_flash.bin    # SPI flash / filesystem (16M)
│   ├── web/              # Pre-built WASM artifacts + test page
│   │   ├── qemu-system-arm.wasm  # Compiled QEMU WASM binary
│   │   ├── qemu-system-arm.js    # Emscripten JS glue
│   │   └── qemu-system-arm.worker.js  # Web Worker
│   ├── scripts/
│   │   └── patch_wasm.py         # Emscripten build patches
│   ├── patches/          # Source patches for QEMU 10.1
│   ├── build_wasm.sh     # Docker-based WASM build script
│   ├── build.sh          # Native build script
│   ├── index.html        # Main web UI (display, buttons, firmware loading)
│   ├── server.py         # Local dev server with COOP/COEP headers
│   └── CLAUDE.md         # Upstream project notes
│
└── references/           # READ-ONLY reference repositories
    ├── README.md
    ├── libpebble2/       # pebble/libpebble2 — Python Pebble protocol library
    │   └── libpebble2/services/putbytes.py  # PutBytes protocol (app install)
    └── pebble-tool/      # pebble/pebble-tool — Official Pebble CLI
```

## Key Files for Protocol Work

| File | Purpose |
|------|---------|
| `pebble-qemu-wasm/hw/arm/pebble_control.c` | FEED/BEEF framing, 8 protocol types, packet forwarding |
| `pebble-qemu-wasm/hw/arm/pebble.c` | UART creation, board configs, button input |
| `pebble-qemu-wasm/index.html` | JS API: display framebuffer, buttons via Atomics, FS |
| `references/libpebble2/libpebble2/services/putbytes.py` | PutBytes protocol (app install over serial) |
