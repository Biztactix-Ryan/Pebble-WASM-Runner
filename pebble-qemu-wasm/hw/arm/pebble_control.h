#ifndef PEBBLE_CONTROL_H
#define PEBBLE_CONTROL_H

#include "qemu/typedefs.h"
#include "hw/arm/stm32_common.h"

typedef struct PebbleControl PebbleControl;

/* Create pebble_control that sits between a Chardev and a Stm32Uart.
 * chr: the chardev connected to the host (e.g. serial_hd(1))
 * uart: the UART device in the emulated Pebble
 */
PebbleControl *pebble_control_create(Chardev *chr, Stm32Uart *uart);

void pebble_control_send_vibe_notification(PebbleControl *s, bool on);

/* Inject raw bytes into pebble_control as if they came from the host chardev.
 * Used by WASM bridge to send FEED/BEEF packets into the UART. */
void pebble_control_inject(PebbleControl *s, const uint8_t *buf, int size);

#ifdef __EMSCRIPTEN__
/* Read bytes from the WASM outbox (emulator → JS). Returns bytes read. */
int pebble_control_wasm_read(uint8_t *buf, int max_len);
/* Return number of bytes available in the WASM outbox. */
int pebble_control_wasm_readable(void);
#endif

#endif /* PEBBLE_CONTROL_H */
