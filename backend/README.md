# ESP32传感器数据后端服务

这是一个用于接收和存储ESP32传感器数据的Node.js后端服务。

## 功能特性

- MQTT连接和订阅
- 传感器数据接收和存储
- RESTful API接口
- 自动数据获取（每5分钟）

## 环境变量

在Replit的Secrets中配置以下环境变量：

```
MQTT_BROKER=z6fc98e1.ala.cn-hangzhou.emqxsl.cn
MQTT_PORT=8883
MQTT_USERNAME=Johnney
MQTT_PASSWORD=Zq??900725
MQTT_CLIENT_ID=MYSELFWEB_BACKEND
MQTT_TOPIC=esp32/topic
PORT=3000
NODE_ENV=production
```

## API接口

### 获取最新传感器数据
```
GET /api/sensor-data
```

### 手动触发获取温湿度命令
```
POST /api/get-sensor-data
```

## 运行

在Replit中，点击顶部的"Run"按钮即可启动服务。
