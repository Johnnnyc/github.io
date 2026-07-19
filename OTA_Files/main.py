# ============================================================
# ESP32 Firebase 数据采集主程序
# 功能：连接WiFi、采集传感器数据、上传到Firebase
# ============================================================

from machine import Pin
import network
from umqtt.simple import MQTTClient
import json
from dht import DHT11
import random
import time
import ssl
import ntptime
import machine
import urequests
from config import *
from firebase_config import *

# 配置参数
COLLECTION_INTERVAL = 5  # 采集间隔（秒）
UPLOAD_INTERVAL = 180    # 上传间隔（秒）

# 初始化硬件
fan_pin = Pin(5, Pin.OUT)
led = Pin(2, Pin.OUT)
dht = DHT11(Pin(4))

# MQTT配置
MQTT_SERVER = "z6fc98e1.ala.cn-hangzhou.emqxsl.cn"
MQTT_PORT = 8883
MQTT_CLIENT_ID = 'micropython-client-{id}'.format(id=random.getrandbits(8))
MQTT_USERNAME = 'Johnney'
MQTT_PASSWORD = 'Zq??900725'
MQTT_TOPIC = "esp32/topic"
CA_CERTS_PATH = "./ca.crt"

# 全局变量
client = None
last_collection_time = 0
last_upload_time = 0


def connect_wifi():
    """连接WiFi网络"""
    print("\n=== 连接WiFi ===")
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    if wlan.isconnected():
        print("WiFi已连接")
        print("IP地址:", wlan.ifconfig()[0])
        return True
    
    for config in WIFI_CONFIGS:
        if not config['ssid']:
            continue
        
        print("正在连接:", config['ssid'])
        wlan.connect(config['ssid'], config['password'])
        
        for _ in range(15):
            if wlan.isconnected():
                print("WiFi连接成功")
                print("IP地址:", wlan.ifconfig()[0])
                return True
            time.sleep(1)
        
        wlan.disconnect()
        time.sleep(1)
    
    print("WiFi连接失败")
    return False


def sync_ntp():
    """同步NTP时间"""
    print("\n=== 同步NTP时间 ===")
    try:
        ntptime.host = 'ntp.aliyun.com'
        ntptime.settime()
        print("NTP同步成功")
        return True
    except Exception as e:
        print("NTP同步失败:", e)
        return False


def connect_mqtt():
    """连接MQTT服务器"""
    global client
    print("\n=== 连接MQTT ===")
    
    while True:
        try:
            ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
            ssl_context.load_verify_locations(CA_CERTS_PATH)
            client = MQTTClient(MQTT_CLIENT_ID, MQTT_SERVER, MQTT_PORT, 
                               MQTT_USERNAME, MQTT_PASSWORD, ssl=ssl_context)
            client.connect()
            client.set_callback(on_message)
            client.subscribe(MQTT_TOPIC)
            print("MQTT连接成功")
            return True
        except Exception as e:
            print("MQTT连接失败:", e)
            print("5秒后重试...")
            time.sleep(5)


def on_message(topic, msg):
    """MQTT消息回调"""
    print("\n收到消息:", msg.decode())
    if msg.decode() == "获取温湿度":
        data = read_sensor()
        client.publish(MQTT_TOPIC, json.dumps(data))
    elif msg.decode() == "打开风扇":
        fan_pin.value(1)
        client.publish(MQTT_TOPIC, json.dumps({"status": "风扇已打开"}))
    elif msg.decode() == "关闭风扇":
        fan_pin.value(0)
        client.publish(MQTT_TOPIC, json.dumps({"status": "风扇已关闭"}))


def read_sensor():
    """读取传感器数据"""
    print("\n--- 读取传感器 ---")
    temperature = None
    humidity = None
    
    for _ in range(3):
        try:
            dht.measure()
            temperature = dht.temperature()
            humidity = dht.humidity()
            if temperature is not None and humidity is not None:
                break
        except:
            time.sleep(0.5)
    
    # 获取时间
    current_time = time.localtime()
    tz_hour = (current_time[3] + 8) % 24
    datetime_str = "{:04d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}".format(
        current_time[0], current_time[1], current_time[2],
        tz_hour, current_time[4], current_time[5]
    )
    
    data = {
        'datetime': datetime_str,
        'temperature': temperature,
        'humidity': humidity
    }
    print("传感器数据:", data)
    return data


def push_to_firebase(data):
    """推送数据到Firebase"""
    print("\n=== 推送数据到Firebase ===")
    
    if data['temperature'] is None or data['humidity'] is None:
        print("传感器数据无效，跳过推送")
        return False
    
    # 构建URL（写入 sensor-data/年份/时间戳，与现有数据结构一致）
    timestamp = str(int(time.time() * 1000))
    
    # 检查时间是否合理
    current_time = time.localtime()
    year = str(current_time[0])
    print("当前时间:", current_time)
    if int(year) < 2025:
        print("错误: 时间同步失败，年份=" + year)
        return False
    
    # 写入 sensor-data/年份/时间戳（与现有数据结构一致）
    url = FIREBASE_URL + "sensor-data/" + timestamp + ".json?auth=" + FIREBASE_API_KEY
    #print("完整URL:", url)
    
    # 发送数据
    simple_data = {
        'datetime': data['datetime'],
        'temperature': data['temperature'],
        'humidity': data['humidity'],
        'timestamp': timestamp
    }
    print("要发送的数据:", simple_data)
    
    try:
        print("开始发送请求...")
        response = urequests.put(url, json=simple_data, headers={"Content-Type": "application/json"}, timeout=15)
        #print("响应状态码:", response.status_code)
        
        try:
            response_text = response.text
            #print("响应内容:", response_text)
        except:
            print("无法读取响应内容")
        
        if response.status_code in [200, 201]:
            #print("HTTP状态码成功")
            response.close()
            
            # 验证数据
            print("开始验证数据...")
            try:
                verify_response = urequests.get(url, timeout=10)
                #print("验证状态码:", verify_response.status_code)
                try:
                    verify_text = verify_response.text
                    #print("验证响应:", verify_text)
                    if verify_response.status_code == 200:
                        #print("数据验证成功！")
                    else:
                        print("警告: 写入成功但读取失败，可能是权限问题")
                except:
                    print("无法读取验证响应")
                verify_response.close()
            except Exception as verify_e:
                print("验证异常:", verify_e)
            
            return True
        else:
            print("推送失败，状态码:", response.status_code)
            response.close()
            return False
    except Exception as e:
        print("推送异常:", type(e).__name__, "-", e)
        return False


def main():
    """主程序"""
    print("\n" + "=" * 50)
    print("ESP32 Firebase 数据采集系统")
    print("=" * 50)
    
    # 连接WiFi
    if not connect_wifi():
        print("无法连接网络")
        return
    
    # 同步时间
    sync_ntp()
    
    # 连接MQTT
    connect_mqtt()
    
    # LED闪烁表示启动成功
    led.value(1)
    time.sleep(1)
    led.value(0)
    
    print("\n=== 开始运行 ===")
    print("采集间隔:", COLLECTION_INTERVAL, "秒")
    print("上传间隔:", UPLOAD_INTERVAL, "秒")
    
    global last_collection_time, last_upload_time
    
    while True:
        try:
            current_time = time.time()
            
            # 检查MQTT连接
            try:
                client.ping()
            except:
                print("MQTT断开，重新连接...")
                connect_mqtt()
            
            # 采集数据
            if current_time - last_collection_time >= COLLECTION_INTERVAL:
                data = read_sensor()
                last_collection_time = current_time
                
            # 3分钟推送一次
            if current_time - last_upload_time >= UPLOAD_INTERVAL:
                push_to_firebase(data)
                last_upload_time = current_time
            
            # 检查MQTT消息
            client.check_msg()
            
            # LED指示
            led.value(1)
            time.sleep(0.5)
            led.value(0)
            time.sleep(0.5)
            
        except KeyboardInterrupt:
            print("\n系统停止")
            break
        except Exception as e:
            print("错误:", e)
            time.sleep(5)


if __name__ == "__main__":
    main()
