/*
 * Pebble Robert Board - STM32F7xx implementation for QEMU 10.x
 *
 * Robert is the F7xx-based Pebble board (Pebble Time 2 / Pebble 2).
 * Uses the same STM32F7 peripheral models as F4xx (UART, GPIO, etc.)
 * but with F7xx-specific memory addresses (SYSCLK=200MHz) and the
 * same board-level layout as Snowy/Emery.
 */

#include "qemu/osdep.h"
#include "hw/boards.h"
#if __has_include("hw/arm/machines-qom.h")
#include "hw/arm/machines-qom.h"
#endif
#ifndef DEFINE_MACHINE_ARM
#define DEFINE_MACHINE_ARM DEFINE_MACHINE
#endif
#include "hw/arm/pebble.h"
#include "hw/arm/stm32_common.h"
#include "target/arm/cpu-qom.h"
#include "qemu/error-report.h"
#include "system/block-backend.h"
#include "system/runstate.h"

const static PblBoardConfig s_board_config_robert_bb = {
    .dbgserial_uart_index = 2,       /* USART3 */
    .pebble_control_uart_index = 1,  /* USART2 */
    .button_map = {
        {STM32_GPIOG_INDEX, 6, false},  /* back */
        {STM32_GPIOG_INDEX, 3, false},  /* up */
        {STM32_GPIOG_INDEX, 5, false},  /* select */
        {STM32_GPIOG_INDEX, 4, false},  /* down */
    },
    .flash_size = 4096,   /* 4MB flash */
    .ram_size = 512,      /* 512KB SRAM */
    .num_rows = 228,
    .num_cols = 200,
    .num_border_rows = 0,
    .num_border_cols = 0,
    .row_major = true,
    .row_inverted = true,
    .col_inverted = true,
    .round_mask = false
};

void pebble_32f7xx_init(MachineState *machine,
                        const PblBoardConfig *board_config)
{
    Stm32Gpio *gpio[STM32F7XX_GPIO_COUNT];
    Stm32Uart *uart[STM32F7XX_UART_COUNT];
    Stm32Timer *timer[STM32F7XX_TIM_COUNT];
    DeviceState *rtc_dev;
    SSIBus *spi;
    struct stm32f7xx stm;
    ARMCPU *cpu;

    stm32f7xx_init(board_config->flash_size,
                   board_config->ram_size,
                   machine->kernel_filename,
                   gpio,
                   board_config->gpio_idr_masks,
                   uart,
                   timer,
                   &rtc_dev,
                   8000000,  /* osc_freq */
                   32768,    /* osc32_freq */
                   &stm,
                   &cpu);

    pebble_set_qemu_settings(rtc_dev);

    /* Storage flash (NOR-flash) - 16MB at 0x60000000.
     * Use pflash_cfi02 (AMD/JEDEC compatible) to emulate Macronix MX29VS128FB.
     * Pass via: -drive if=none,id=spi-flash,file=firmware/qemu_spi_flash.bin,format=raw
     */
    {
        const uint32_t flash_size_bytes = 16 * 1024 * 1024;
        const uint32_t sector_size = 32 * 1024;
        BlockBackend *blk = blk_by_name("spi-flash");
        if (!blk) {
            fprintf(stderr, "WARNING: pflash drive 'spi-flash' not found, flash will be empty\n");
        } else {
            fprintf(stderr, "DEBUG: pflash drive 'spi-flash' found\n");
        }
        pflash_cfi02_register(0x60000000,
                              "pebble.spi_flash",
                              flash_size_bytes,
                              blk,
                              sector_size,
                              1,       /* nb_mappings */
                              2,       /* width (16-bit) */
                              0x00c2,  /* id0: Macronix */
                              0x007e,  /* id1 */
                              0x0065,  /* id2 */
                              0x0001,  /* id3 */
                              0x555,   /* unlock_addr0 */
                              0x2AA,   /* unlock_addr1 */
                              0);      /* big_endian = false */
    }

    /* === Display (SPI5, same as Snowy/Emery) === */
    spi = (SSIBus *)qdev_get_child_bus(stm.spi_dev[5], "ssi");
    DeviceState *display_dev = qdev_new("pebble-snowy-display");

    qemu_irq display_done_irq = qdev_get_gpio_in(
        (DeviceState *)gpio[STM32_GPIOG_INDEX], 9);
    qemu_irq display_intn_irq = qdev_get_gpio_in(
        (DeviceState *)gpio[STM32_GPIOG_INDEX], 10);

    qdev_prop_set_int32(display_dev, "num_rows", board_config->num_rows);
    qdev_prop_set_int32(display_dev, "num_cols", board_config->num_cols);
    qdev_prop_set_int32(display_dev, "num_border_rows",
                        board_config->num_border_rows);
    qdev_prop_set_int32(display_dev, "num_border_cols",
                        board_config->num_border_cols);
    qdev_prop_set_uint8(display_dev, "row_major", board_config->row_major);
    qdev_prop_set_uint8(display_dev, "row_inverted",
                        board_config->row_inverted);
    qdev_prop_set_uint8(display_dev, "col_inverted",
                        board_config->col_inverted);
    qdev_prop_set_uint8(display_dev, "round_mask", board_config->round_mask);

    if (!spi) {
        error_report("SPI5 bus not found - display cannot be attached");
    } else {
        ssi_realize_and_unref(display_dev, spi, &error_fatal);
    }

    /* Connect GPIO outputs to display inputs */
    qemu_irq display_cs = qdev_get_gpio_in_named(display_dev, SSI_GPIO_CS, 0);
    qdev_connect_gpio_out((DeviceState *)gpio[STM32_GPIOG_INDEX], 8,
                          display_cs);

    qemu_irq display_reset = qdev_get_gpio_in_named(display_dev, "reset", 0);
    qdev_connect_gpio_out((DeviceState *)gpio[STM32_GPIOG_INDEX], 15,
                          display_reset);

    qemu_irq display_sclk = qdev_get_gpio_in_named(display_dev, "sclk", 0);
    qdev_connect_gpio_out((DeviceState *)gpio[STM32_GPIOG_INDEX], 13,
                          display_sclk);

    /* Connect display outputs to GPIO inputs (DONE and INTN signals) */
    qdev_connect_gpio_out_named(display_dev, "done_output", 0,
                                display_done_irq);
    qdev_connect_gpio_out_named(display_dev, "intn_output", 0,
                                display_intn_irq);

    qemu_irq backlight_enable = qdev_get_gpio_in_named(display_dev,
                                                        "backlight_enable", 0);
    qdev_connect_gpio_out_named((DeviceState *)gpio[STM32_GPIOB_INDEX],
                                "af", 14, backlight_enable);

    qemu_irq backlight_level = qdev_get_gpio_in_named(display_dev,
                                                       "backlight_level", 0);
    qdev_connect_gpio_out_named((DeviceState *)timer[11],
                                "pwm_ratio_changed", 0, backlight_level);

    /* Connect UARTs */
    pebble_connect_uarts(uart, board_config);

    /* Init buttons */
    pebble_init_buttons(gpio, board_config->button_map);

    /* Board device (vibrate fan-out) */
    qemu_irq display_vibe = qdev_get_gpio_in_named(display_dev,
                                                     "vibe_ctl", 0);
    DeviceState *board = pebble_init_board(gpio, display_vibe);

    qemu_irq board_vibe_in = qdev_get_gpio_in_named(board,
                                                      "pebble_board_vibe_in",
                                                      0);
    qdev_connect_gpio_out((DeviceState *)gpio[STM32_GPIOF_INDEX], 4,
                          board_vibe_in);
}

static void pebble_robert_init(MachineState *machine)
{
    pebble_32f7xx_init(machine, &s_board_config_robert_bb);
}

static void pebble_robert_bb_machine_init(MachineClass *mc)
{
    static const char * const valid_cpu_types[] = {
        ARM_CPU_TYPE_NAME("cortex-m4"),
        NULL
    };
    mc->desc = "Pebble smartwatch (robert)";
    mc->init = pebble_robert_init;
    mc->valid_cpu_types = valid_cpu_types;
}

DEFINE_MACHINE_ARM("pebble-robert-bb", pebble_robert_bb_machine_init)
