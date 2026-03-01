import express from 'express';
import cors from 'cors';
import mqtt from 'mqtt';
import http from 'http';

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyD_QorWShFv5BeS4j4VSJoh2mCxyvgJ68Y",
  authDomain: "esp32-sensor-data-ed101.firebaseapp.com",
  databaseURL: "https://esp32-sensor-data-ed101-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32-sensor-data-ed101",
  storageBucket: "esp32-sensor-data-ed101.appspot.com",
  messagingSenderId: "704351048238",
  appId: "1:704351048238:web:f5b5c2728b7af9ea9145bf",
  measurementId: "G-GRG73670NC"
};

// 初始化Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// 初始化Express服务器
const app = express();
// Replit使用环境变量PORT，如果没有则使用3000
const port = process.env.PORT || 3000;

// 记录服务器启动信息
console.log('服务器启动中...');
console.log('使用端口:', port);

// 配置CORS - 允许GitHub Pages和其他域名访问
const allowedOrigins = [
  'https://johnnnyc.github.io',
  'http://localhost:3000',
  'http://localhost:8080',
  '*'  // 允许所有来源（开发环境）
];

app.use(cors({
  origin: function(origin, callback) {
    // 允许没有origin的请求（如Postman）
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('CORS拒绝访问:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// MQTT配置（使用环境变量）
const mqttConfig = {
  broker: process.env.MQTT_BROKER || 'z6fc98e1.ala.cn-hangzhou.emqxsl.cn',
  port: parseInt(process.env.MQTT_PORT) || 8883,
  username: process.env.MQTT_USERNAME || 'Johnney',
  password: process.env.MQTT_PASSWORD || 'Zq??900725',
  clientId: process.env.MQTT_CLIENT_ID || 'MYSELFWEB_BACKEND',
  topic: process.env.MQTT_TOPIC || 'esp32/topic'
};

// MQTT连接
let mqttClient;
let sensorData = {
  temperature: null,
  humidity: null,
  datetime: null
};

// 历史数据存储
let sensorDataHistory = [];

function connectMQTT() {
  // 使用MQTT协议连接
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
      
      // 存储数据到内存历史记录
      const timestamp = Date.now();
      const sensorDataWithTimestamp = {
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        datetime: sensorData.datetime,
        timestamp: timestamp
      };
      
      sensorDataHistory.push(sensorDataWithTimestamp);
      
      // 只保留最近100条数据
      if (sensorDataHistory.length > 100) {
        sensorDataHistory.shift();
      }
      
      // 存储数据到Firebase
      set(ref(database, 'sensor-data/' + timestamp), sensorDataWithTimestamp)
        .then(() => {
          console.log('数据存储到Firebase成功');
        })
        .catch((error) => {
          console.error('数据存储到Firebase失败:', error);
        });
      
      console.log('数据存储到内存成功');
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

// 延迟连接MQTT，确保服务器先启动
setTimeout(() => {
  connectMQTT();
  // 每5分钟发送一次获取温湿度命令
  setInterval(sendGetSensorData, 5 * 60 * 1000);
  
  // 定期自我ping，保持Replit应用活跃
  setInterval(() => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/health',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('自我ping成功:', data);
      });
    });
    
    req.on('error', (error) => {
      console.error('自我ping失败:', error);
    });
    
    req.end();
  }, 4 * 60 * 1000); // 每4分钟ping一次，比UptimeRobot的5分钟频率稍高
}, 2000);

// API接口

// 根路由 - 显示监控页面
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>ESP32传感器数据监控</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #1a1a2e; color: white; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { text-align: center; color: #00f0ff; }
        .data-card { background: #16213e; padding: 20px; margin: 20px 0; border-radius: 10px; }
        .data-item { display: flex; justify-content: space-between; margin: 10px 0; }
        .label { color: #888; }
        .value { color: #00f0ff; font-size: 24px; font-weight: bold; }
        .refresh-btn { 
          background: #00f0ff; color: #1a1a2e; border: none; padding: 15px 30px; 
          border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 20px;
        }
        .refresh-btn:hover { background: #00c0cc; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌡️ ESP32传感器数据监控</h1>
        <div class="data-card">
          <div class="data-item">
            <span class="label">温度:</span>
            <span class="value" id="temperature">-- °C</span>
          </div>
          <div class="data-item">
            <span class="label">湿度:</span>
            <span class="value" id="humidity">-- %</span>
          </div>
          <div class="data-item">
            <span class="label">更新时间:</span>
            <span class="value" id="datetime">--</span>
          </div>
        </div>
        <button class="refresh-btn" onclick="refreshData()">🔄 刷新数据</button>
        <button class="refresh-btn" onclick="getSensorData()">📡 获取传感器数据</button>
      </div>
      <script>
        async function refreshData() {
          try {
            const response = await fetch('/api/sensor-data');
            const data = await response.json();
            document.getElementById('temperature').textContent = (data.temperature || '--') + ' °C';
            document.getElementById('humidity').textContent = (data.humidity || '--') + ' %';
            document.getElementById('datetime').textContent = data.datetime || '--';
          } catch (error) {
            console.error('获取数据失败:', error);
            alert('获取数据失败，请检查连接');
          }
        }
        
        async function getSensorData() {
          try {
            const response = await fetch('/api/get-sensor-data', { method: 'POST' });
            const data = await response.json();
            alert(data.message);
            setTimeout(refreshData, 2000);
          } catch (error) {
            console.error('发送命令失败:', error);
            alert('发送命令失败');
          }
        }
        
        // 自动刷新
        refreshData();
        setInterval(refreshData, 30000);
      </script>
    </body>
    </html>
  `);
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

// 获取历史传感器数据（最多50条）
app.get('/api/history-data', (req, res) => {
  // 按时间戳排序，获取最近50条数据
  const sortedData = [...sensorDataHistory].sort((a, b) => b.timestamp - a.timestamp);
  const recentData = sortedData.slice(0, 50).reverse(); // 反转数组，使时间戳从小到大
  res.json(recentData);
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 启动服务器
const server = app.listen(port, () => {
  console.log('========================================');
  console.log(`服务器运行在端口 ${port}`);
  console.log(`服务器地址: http://localhost:${port}`);
  console.log(`健康检查: http://localhost:${port}/health`);
  console.log(`API端点: http://localhost:${port}/api/sensor-data`);
  console.log('========================================');
});

// 服务器错误处理
server.on('error', (error) => {
  console.error('========================================');
  console.error('服务器错误:', error);
  console.error('========================================');
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${port} 已被占用`);
  }
});

// 全局错误处理
process.on('uncaughtException', (error) => {
  console.error('========================================');
  console.error('未捕获的异常:', error);
  console.error('========================================');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('========================================');
  console.error('未处理的拒绝:', reason);
  console.error('========================================');
});