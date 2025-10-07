#!/usr/bin/env python3
import argparse
import RPi.GPIO as GPIO
import sys

# ---------- CONFIGURATION ----------
PINS = [27, 5, 13, 21]  # GPIO numbers for LEDs
# ----------------------------------

# Parse CLI arguments
parser = argparse.ArgumentParser(description="Control LED lights on Raspberry Pi")
parser.add_argument('--lights', type=int, default=4, help="Number of LEDs to control (max 4)")
parser.add_argument('--switch', choices=['on', 'off'], default='off', help="Turn LEDs on or off")
args = parser.parse_args()

# Setup GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

# Validate number of lights
if args.lights > len(PINS):
    args.lights = len(PINS)

try:
    # Set up pins
    for pin in PINS[:args.lights]:
        GPIO.setup(pin, GPIO.OUT)

    if args.switch == 'on':
        # Turn ON LEDs
        for pin in PINS[:args.lights]:
            GPIO.output(pin, GPIO.HIGH)

    else:  # args.switch == 'off'
        # Turn OFF LEDs
        for pin in PINS:
            GPIO.setup(pin, GPIO.OUT)
            GPIO.output(pin, GPIO.LOW)

        # Clean up safely — resets all used GPIOs
        GPIO.cleanup()

except Exception as e:
    print(f"Error: {e}")


