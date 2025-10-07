import RPi.GPIO as GPIO
import sys, socket

PIN = 14
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)  
GPIO.setup(PIN, GPIO.OUT)

if sys.argv[1] == "on":
    GPIO.output(PIN, GPIO.HIGH)    
elif sys.argv[1] == "off":
    GPIO.output(PIN, GPIO.LOW)

print(f"Light turned {sys.argv[1]} on {socket.gethostname()}")

