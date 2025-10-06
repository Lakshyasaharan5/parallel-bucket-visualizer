import RPi.GPIO as GPIO

PIN = 14
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(PIN, GPIO.OUT)  # or GPIO.IN, both can read current logic level

state = GPIO.input(PIN)
print(f"GPIO {PIN} is {'HIGH (on)' if state else 'LOW (off)'}")

GPIO.cleanup()

