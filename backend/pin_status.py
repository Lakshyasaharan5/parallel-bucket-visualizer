import RPi.GPIO as GPIO

PINS = [27, 5, 13, 21]
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

for pin in PINS:
    GPIO.setup(pin, GPIO.OUT)
    state = GPIO.input(pin)
    print(f"GPIO {pin} is {'HIGH (on)' if state else 'LOW (off)'}")

GPIO.cleanup()

