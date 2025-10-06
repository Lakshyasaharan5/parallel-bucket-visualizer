from gpiozero import LED
import signal
import sys
import time

led = LED(17)

def cleanup(sig, frame):
    led.off()
    sys.exit(0)

# Catch Ctrl+C and kill signals
signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

try:
    while True:
        led.on()
        time.sleep(1)
except KeyboardInterrupt:
    cleanup(None, None)



