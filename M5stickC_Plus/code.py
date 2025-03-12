import os, sys, io
import M5
from M5 import *
from hardware import I2C
from hardware import Pin
from hat import ENVHat
import time
import requests


label2, label3, label4, label5, XD, i2c0, hat_env3_0, text, posta, teplota, vlhkost, tlak = [None] * 12
rtc = RTC()
reset = 1

#####################################   Nastavení displaye   #######################################
M5.begin()
label2 = Widgets.Label("Posledni data:", 0, 0, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu18)
label3 = Widgets.Label("Teplota: None", 0, 29, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)
label4 = Widgets.Label("Vlhkost: None", 0, 45, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)
label5 = Widgets.Label("Tlak: None", 1, 61, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu9)
i2c0 = I2C(0, scl=Pin(26), sda=Pin(0), freq=100000)
hat_env3_0 = ENVHat(i2c0, type=3)

#####################################   HTTP REQUEST   #######################################
def http_request(server_address, teplota, tlak, vlhkost):
    try:
        response = requests.get(f"{server_address}field1={teplota}&field2={tlak}&field3={vlhkost}")
        if response.status_code == 200:
            print(response.status_code)
            gc.collect()
            response.close()
        else:
            print(f"Chyba při odesílání teploty: {response.status_code}")
     
    except Exception as e:
        print(f"Chyba spojení: {e}")
        return None 

server_address = "https://api.thingspeak.com/update?api_key=QO0UL8JAOH98O7P9&"

#####################################   Loop   #######################################


while True:
  teplota = hat_env3_0.read_temperature()
  vlhkost = hat_env3_0.read_humidity()
  tlak = hat_env3_0.read_pressure()
  label3.setText(str(teplota))
  label4.setText(str(vlhkost))
  label5.setText(str(tlak))
  http_request(server_address, teplota, tlak, vlhkost)

  time.sleep(900)


if __name__ == '__main__':
  try:
    setup()
    while True:
      loop()
  except (Exception, KeyboardInterrupt) as e:
    try:
      from utility import print_error_msg
      print_error_msg(e)
    except ImportError:
      print("please update to latest firmware")
