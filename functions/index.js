const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const admin = require('firebase-admin');

// 初始化Firebase Admin SDK
admin.initializeApp();

const app = express();
app.use(cors());

// MQTT配置
const mqttConfig = {
  broker: 'z6fc98e1.ala.cn-hangzhou.emqxsl.cn',
  port: 8883,
  username: 'Johnney',
  password: 'Zq??900725',
  clientId: 'MYSELFWEB_BACKEND',
  topic: 'esp32/topic'
};

// MQTT连接
let mqttClient;
let sensorData = {
  temperature: null,
  humidity: null,
  datetime: null
};

function connectMQTT() {
  const url = `mqtts://${mqttConfig.broker}:${mqttConfig.port}`;
  
  mqttClient = mqtt.connect(url, {
    clientId: mqttConfig.clientId + '_' + Date.now(),
    username: mqttConfig.username,
    password: mqttConfig.password,
    clean: true,
    keepalive: 60
  });
  
  mqttClient.on('connect', () => {
    console.log('MQTT连接成功');
    mqttClient.subscribe(mqttConfig.topic, (err) => {
      if (err) {
        console.error('订阅失败:', err);
      } else {
        console.log('订阅成功');
      }
    });
  });
  
  mqttClient.on('message', (topic, message) => {
    console.log('收到消息:', topic, message.toString());
    handleSensorData(message.toString());
  });
  
  mqttClient.on('error', (error) => {
    console.error('MQTT错误:', error);
  });
  
  mqttClient.on('reconnect', () => {
    console.log('MQTT重连中...');
  });
  
  mqttClient.on('close', () => {
    console.log('MQTT连接关闭');
  });
}

function handleSensorData(data) {
  if (data === '获取温湿度') {
    return;
  }
  
  try {
    const sensorDataObj = JSON.parse(data);
    if (sensorDataObj.temperature !== undefined && sensorDataObj.humidity !== undefined) {
      sensorData = {
        temperature: sensorDataObj.temperature,
        humidity: sensorDataObj.humidity,
        datetime: sensorDataObj.datetime || new Date().toLocaleString()
      };
      
      // 存储数据到Firebase
      const timestamp = Date.now();
      const sensorDataWithTimestamp = {
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        datetime: sensorData.datetime,
        timestamp: timestamp
      };
      
      admin.database().ref('sensor-data/' + timestamp).set(sensorDataWithTimestamp)
        .then(() => {
          console.log('数据存储到Firebase成功');
        })
        .catch((error) => {
          console.error('数据存储到Firebase失败:', error);
        });
    }
  } catch (error) {
    console.error('解析传感器数据失败:', error);
  }
}

function sendGetSensorData() {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(mqttConfig.topic, '获取温湿度', (err) => {
      if (err) {
        console.error('发送获取温湿度命令失败:', err);
      } else {
        console.log('发送获取温湿度命令成功');
      }
    });
  } else {
    console.error('MQTT未连接');
  }
}

// 连接MQTT
connectMQTT();

// 每5分钟发送一次获取温湿度命令
setInterval(sendGetSensorData, 5 * 60 * 1000);

// API路由
app.get('/sensor-data', (req, res) => {
  res.json(sensorData);
});

app.post('/get-sensor-data', (req, res) => {
  sendGetSensorData();
  res.json({ message: '获取温湿度命令已发送' });
});

// 导出API
exports.api = functions.https.onRequest(app);