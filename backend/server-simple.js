const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

// 初始化Express服务器
const app = express();
const port = process.env.PORT || 3000;

// 配置CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 传感器数据
let sensorData = {
  temperature: '-',
  humidity: '-',
  datetime: '-' 
};

// MQTT配置
const mqttConfig = {
  broker: 'z6fc98e1.ala.cn-hangzhou.emqxsl.cn',
  port: 8883,
  username: 'Johnney',
  password: 'Zq??900725',
  clientId: 'MYSELFWEB_BACKEND',
  topic: 'esp32/topic'
};

// 连接MQTT
const mqttClient = mqtt.connect({
  host: mqttConfig.broker,
  port: mqttConfig.port,
  username: mqttConfig.username,
  password: mqttConfig.password,
  clientId: mqttConfig.clientId,
  protocol: 'mqtts'
});

mqttClient.on('connect', () => {
  console.log('MQTT连接成功');
  mqttClient.subscribe(mqttConfig.topic, (err) => {
    if (!err) {
      console.log('订阅成功');
      sendGetSensorData();
    }
  });
});

mqttClient.on('message', (topic, message) => {
  console.log('收到消息:', topic, message.toString());
  try {
    const data = JSON.parse(message.toString());
    if (data.temperature !== undefined && data.humidity !== undefined) {
      sensorData = data;
      console.log('数据存储到内存成功');
    }
  } catch (error) {
    console.error('解析消息失败:', error);
  }
});

// 发送获取温湿度命令
function sendGetSensorData() {
  console.log('发送获取温湿度命令成功');
  mqttClient.publish(mqttConfig.topic, '获取温湿度');
}

// 定时获取数据（1分钟一次）
setInterval(sendGetSensorData, 1 * 60 * 1000);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'ESP32传感器数据API' });
});

// 获取最新传感器数据
app.get('/api/sensor-data', (req, res) => {
  res.json(sensorData);
});

// 手动触发获取温湿度命令
app.post('/api/get-sensor-data', (req, res) => {
  sendGetSensorData();
  res.json({ message: '获取温湿度命令已发送' });
});

// 启动服务器
app.listen(port, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log(`API地址: http://localhost:${port}/api/sensor-data`);
});
