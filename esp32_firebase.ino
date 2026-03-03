#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>

// WiFi配置
#define WIFI_SSID "你的WiFi名称"
#define WIFI_PASSWORD "你的WiFi密码"

// Firebase配置
#define FIREBASE_HOST "esp32-sensor-data-ed101-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "你的Firebase数据库密钥"

// DHT传感器配置
#define DHTPIN 4      // DHT传感器连接的引脚
#define DHTTYPE DHT22  // DHT传感器类型

// 初始化DHT传感器
DHT dht(DHTPIN, DHTTYPE);

// 初始化Firebase对象
FirebaseData firebaseData;

// 传感器数据结构
typedef struct {
  float temperature;
  float humidity;
  String datetime;
  unsigned long timestamp;
} SensorData;

void setup() {
  // 初始化串口
  Serial.begin(115200);
  Serial.println("ESP32 Firebase 传感器数据上传");
  
  // 初始化DHT传感器
  dht.begin();
  Serial.println("DHT传感器初始化完成");
  
  // 连接WiFi
  Serial.print("连接WiFi中...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi连接成功！");
  Serial.print("IP地址: ");
  Serial.println(WiFi.localIP());
  
  // 初始化Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
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
  
  // 等待5秒
  delay(5000);
}

// 读取传感器数据
SensorData readSensorData() {
  SensorData data;
  
  // 读取温湿度
  data.humidity = dht.readHumidity();
  data.temperature = dht.readTemperature();
  
  // 检查读取是否成功
  if (isnan(data.humidity) || isnan(data.temperature)) {
    Serial.println("读取DHT传感器失败！");
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
  String path = "sensor-data/" + String(millis());
  
  // 上传数据
  Serial.print("上传数据到Firebase...");
  if (Firebase.setJSON(firebaseData, path, json)) {
    Serial.println("成功！");
  } else {
    Serial.print("失败: ");
    Serial.println(firebaseData.errorReason());
  }
}

// 上传数据到Firebase（备用方法）
void uploadToFirebaseAlternative(SensorData data) {
  // 直接设置各个字段
  String basePath = "sensor-data/" + String(millis());
  
  bool success1 = Firebase.setFloat(firebaseData, basePath + "/temperature", data.temperature);
  bool success2 = Firebase.setFloat(firebaseData, basePath + "/humidity", data.humidity);
  bool success3 = Firebase.setString(firebaseData, basePath + "/datetime", data.datetime);
  bool success4 = Firebase.setInt(firebaseData, basePath + "/timestamp", data.timestamp);
  
  if (success1 && success2 && success3 && success4) {
    Serial.println("数据上传成功！");
  } else {
    Serial.println("数据上传失败！");
  }
}