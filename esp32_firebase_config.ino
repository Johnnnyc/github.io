#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>

// 配置文件路径
#define CONFIG_FILE "/config.json"

// 初始化DHT传感器
DHT *dht = NULL;

// 初始化Firebase对象
FirebaseData firebaseData;

// 配置结构体
typedef struct {
  String wifiSSID;
  String wifiPassword;
  String firebaseHost;
  String firebaseAuth;
  int sensorPin;
  String sensorType;
  int uploadInterval;
  String uploadPath;
} Config;

// 传感器数据结构
typedef struct {
  float temperature;
  float humidity;
  String datetime;
  unsigned long timestamp;
} SensorData;

// 全局配置变量
Config config;

void setup() {
  // 初始化串口
  Serial.begin(115200);
  Serial.println("ESP32 Firebase 传感器数据上传");
  
  // 初始化SPIFFS
  if (!SPIFFS.begin(true)) {
    Serial.println("SPIFFS初始化失败！");
    return;
  }
  Serial.println("SPIFFS初始化成功");
  
  // 读取配置文件
  if (!loadConfig()) {
    Serial.println("加载配置文件失败！");
    return;
  }
  Serial.println("配置文件加载成功");
  
  // 初始化DHT传感器
  if (config.sensorType == "DHT22") {
    dht = new DHT(config.sensorPin, DHT22);
  } else if (config.sensorType == "DHT11") {
    dht = new DHT(config.sensorPin, DHT11);
  } else {
    Serial.println("不支持的传感器类型！");
    return;
  }
  dht->begin();
  Serial.println("DHT传感器初始化完成");
  
  // 连接WiFi
  Serial.print("连接WiFi中...");
  WiFi.begin(config.wifiSSID.c_str(), config.wifiPassword.c_str());
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi连接成功！");
  Serial.print("IP地址: ");
  Serial.println(WiFi.localIP());
  
  // 初始化Firebase
  Firebase.begin(config.firebaseHost.c_str(), config.firebaseAuth.c_str());
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase初始化完成");
  
  // 设置Firebase超时
  Firebase.setReadTimeout(1000 * 60);
  Firebase.setwriteSizeLimit(1024);
}

void loop() {
  // 读取传感器数据
  SensorData data = readSensorData();
  
  // 打印传感器数据
  Serial.println("\n传感器数据:");
  Serial.print("温度: ");
  Serial.print(data.temperature);
  Serial.println(" °C");
  Serial.print("湿度: ");
  Serial.print(data.humidity);
  Serial.println(" %");
  Serial.print("时间: ");
  Serial.println(data.datetime);
  
  // 上传数据到Firebase
  uploadToFirebase(data);
  
  // 等待指定时间
  delay(config.uploadInterval);
}

// 加载配置文件
bool loadConfig() {
  // 打开配置文件
  File file = SPIFFS.open(CONFIG_FILE, "r");
  if (!file) {
    Serial.println("无法打开配置文件！");
    return false;
  }
  
  // 读取文件内容
  size_t size = file.size();
  std::unique_ptr<char[]> buf(new char[size]);
  file.readBytes(buf.get(), size);
  file.close();
  
  // 解析JSON
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, buf.get());
  if (error) {
    Serial.print("解析配置文件失败: ");
    Serial.println(error.c_str());
    return false;
  }
  
  // 读取配置
  config.wifiSSID = doc["wifi"]["ssid"].as<String>();
  config.wifiPassword = doc["wifi"]["password"].as<String>();
  config.firebaseHost = doc["firebase"]["host"].as<String>();
  config.firebaseAuth = doc["firebase"]["auth"].as<String>();
  config.sensorPin = doc["sensor"]["pin"].as<int>();
  config.sensorType = doc["sensor"]["type"].as<String>();
  config.uploadInterval = doc["upload"]["interval"].as<int>();
  config.uploadPath = doc["upload"]["path"].as<String>();
  
  // 验证配置
  if (config.wifiSSID.isEmpty() || config.wifiPassword.isEmpty() ||
      config.firebaseHost.isEmpty() || config.firebaseAuth.isEmpty()) {
    Serial.println("配置文件不完整！");
    return false;
  }
  
  return true;
}

// 读取传感器数据
SensorData readSensorData() {
  SensorData data;
  
  // 读取温湿度
  if (dht) {
    data.humidity = dht->readHumidity();
    data.temperature = dht->readTemperature();
    
    // 检查读取是否成功
    if (isnan(data.humidity) || isnan(data.temperature)) {
      Serial.println("读取DHT传感器失败！");
      data.humidity = 0;
      data.temperature = 0;
    }
  } else {
    Serial.println("DHT传感器未初始化！");
    data.humidity = 0;
    data.temperature = 0;
  }
  
  // 获取当前时间
  data.timestamp = millis();
  data.datetime = getCurrentDateTime();
  
  return data;
}

// 获取当前日期时间
String getCurrentDateTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "获取时间失败";
  }
  
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buffer);
}

// 上传数据到Firebase
void uploadToFirebase(SensorData data) {
  // 创建数据对象
  FirebaseJson json;
  json.set("temperature", data.temperature);
  json.set("humidity", data.humidity);
  json.set("datetime", data.datetime);
  json.set("timestamp", data.timestamp);
  
  // 生成唯一键
  String path = config.uploadPath + "/" + String(millis());
  
  // 上传数据
  Serial.print("上传数据到Firebase...");
  if (Firebase.setJSON(firebaseData, path, json)) {
    Serial.println("成功！");
  } else {
    Serial.print("失败: ");
    Serial.println(firebaseData.errorReason());
  }
}