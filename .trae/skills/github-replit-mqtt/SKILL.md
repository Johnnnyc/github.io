---
name: "github-replit-mqtt"
description: "实现GitHub静态网页通过Replit后端实时获取MQTT数据的完整项目流程。当用户需要创建类似的物联网数据监控系统时调用。"
---

# GitHub静态网页通过Replit后端实时获取MQTT数据

## 项目概述

这是一个完整的全栈项目，使用GitHub Pages作为静态前端，Replit作为后端服务器，通过MQTT协议实时获取传感器数据并在网页上展示。

## 技术栈

- **前端**：HTML5, CSS3, JavaScript, Firebase SDK, Chart.js
- **后端**：Node.js, Express.js, MQTT
- **部署**：GitHub Pages, Replit
- **数据存储**：Firebase Realtime Database
- **协议**：MQTT, HTTP/HTTPS

## 核心功能

1. **MQTT数据获取**：后端服务器连接到MQTT broker，接收传感器数据
2. **API接口**：后端提供RESTful API接口，供前端获取传感器数据
3. **实时数据展示**：前端通过API获取数据并在页面上展示
4. **自动数据刷新**：前端每3分钟自动刷新一次数据
5. **手动数据刷新**：提供手动刷新按钮（可选）
6. **Firebase数据存储**：将传感器数据存储到Firebase Realtime Database
7. **数据可视化**：使用Chart.js展示温湿度变化趋势

## 部署步骤

### 1. Replit后端部署

1. **创建Replit项目**
   - 登录Replit
   - 创建一个新的Node.js项目
   - 克隆GitHub仓库到Replit

2. **配置后端文件**
   - 在`backend`目录下创建`server.js`文件
   - 安装依赖：`express`, `cors`, `mqtt`
   - 配置MQTT连接信息（broker地址、用户名、密码等）
   - 实现API接口：
     - `/health`：健康检查
     - `/api/sensor-data`：获取传感器数据
     - `/api/get-sensor-data`：手动触发获取数据

3. **配置Replit设置**
   - 修改`.replit`文件，添加部署配置：
     ```
     [deployment]
     run = ["sh", "-c", "cd backend && npm install && node server.js"]
     
     [web]
     port = 3000
     expose = true
     ```
   - 确保端口3000被暴露到Web

4. **启动后端服务器**
   - 在Replit中点击"Run"按钮
   - 检查服务器日志，确保MQTT连接成功

### 2. GitHub Pages前端部署

1. **准备前端文件**
   - 修改`index.html`文件，配置API URL：
     ```javascript
     const API_URL = 'https://your-replit-app.sisko.replit.dev:3000/api';
     ```
   - 实现数据获取和展示逻辑
   - 配置自动刷新间隔：
     ```javascript
     setInterval(refreshData, 3*60*1000); // 3分钟
     ```

2. **配置Firebase**
   - 访问[Firebase控制台](https://console.firebase.google.com/)
   - 创建一个新的Firebase项目
   - 启用Realtime Database
   - 在项目设置中获取Firebase配置信息
   - 在`index.html`中添加Firebase SDK和配置：
     ```html
     <!-- Firebase SDK v8 -->
     <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
     <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-analytics.js"></script>
     <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
     ```
   - 初始化Firebase：
     ```javascript
     const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id",
       measurementId: "your-measurement-id"
     };
     
     firebase.initializeApp(firebaseConfig);
     const database = firebase.database();
     ```

3. **配置数据存储到Firebase**
   - 在`refreshData`函数中添加数据存储逻辑：
     ```javascript
     // 存储数据到Firebase
     if (data.temperature && data.humidity) {
       const timestamp = Date.now();
       const sensorDataWithTimestamp = {
         temperature: data.temperature,
         humidity: data.humidity,
         datetime: data.datetime || new Date().toLocaleString(),
         timestamp: timestamp
       };
       
       // 存储到Firebase数据库
       database.ref('sensor-data/' + timestamp).set(sensorDataWithTimestamp)
         .then(() => {
           console.log('数据存储到Firebase成功');
         })
         .catch((error) => {
           console.error('数据存储到Firebase失败:', error);
         });
     }
     ```

4. **配置数据可视化**
   - 添加Chart.js库：
     ```html
     <!-- Chart.js -->
     <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
     ```
   - 实现图表绘制函数：
     ```javascript
     function drawSensorChart() {
       // 从Firebase获取历史数据
       database.ref('sensor-data').orderByChild('timestamp').once('value')
         .then((snapshot) => {
           const data = snapshot.val();
           const timestamps = [];
           const temperatures = [];
           const humidities = [];
           
           // 处理数据
           if (data) {
             Object.values(data).forEach((item) => {
               if (item.timestamp && item.temperature && item.humidity) {
                 const date = new Date(item.timestamp);
                 timestamps.push(date.toLocaleString());
                 temperatures.push(item.temperature);
                 humidities.push(item.humidity);
               }
             });
           }
           
           // 绘制图表
           const ctx = document.getElementById('sensorChart').getContext('2d');
           new Chart(ctx, {
             type: 'line',
             data: {
               labels: timestamps,
               datasets: [
                 {
                   label: '温度 (°C)',
                   data: temperatures,
                   borderColor: 'rgb(255, 99, 132)',
                   backgroundColor: 'rgba(255, 99, 132, 0.2)',
                   borderWidth: 2,
                   tension: 0.4
                 },
                 {
                   label: '湿度 (%)',
                   data: humidities,
                   borderColor: 'rgb(54, 162, 235)',
                   backgroundColor: 'rgba(54, 162, 235, 0.2)',
                   borderWidth: 2,
                   tension: 0.4
                 }
               ]
             },
             options: {
               responsive: true,
               maintainAspectRatio: false,
               scales: {
                 y: {
                   beginAtZero: false
                 }
               },
               plugins: {
                 title: {
                   display: true,
                   text: '温湿度变化趋势',
                   font: {
                     size: 16
                   }
                 },
                 legend: {
                   display: true,
                   position: 'top'
                 }
               }
             }
           });
         })
         .catch((error) => {
           console.error('获取历史数据失败:', error);
         });
     }
     
     // 页面加载完成后绘制图表
     window.addEventListener('load', drawSensorChart);
     ```

5. **构建项目**
   - 运行`npm run build`生成生产版本
   - 构建产物会生成在`dist`目录

6. **部署到GitHub Pages**
   - 删除远程`gh-pages`分支（如果存在）：
     ```
     git push origin --delete gh-pages
     ```
   - 在`dist`目录初始化Git仓库并推送：
     ```
     cd dist
     git init
     git add .
     git commit -m "deploy"
     git remote add origin https://github.com/your-username/your-repo.git
     git push -u origin master:gh-pages --force
     ```
   - 在GitHub仓库设置中启用GitHub Pages，选择`gh-pages`分支作为源

### 3. 本地开发设置

1. **克隆仓库**
   - `git clone https://github.com/your-username/your-repo.git`

2. **安装依赖**
   - 前端：`npm install`
   - 后端：`cd backend && npm install`

3. **启动开发服务器**
   - 前端：`npm run dev`
   - 后端：`cd backend && node server.js`

4. **配置本地API URL**
   - 修改`index.html`中的API URL为本地地址：
     ```javascript
     const API_URL = 'http://localhost:3000/api';
     ```

5. **配置本地Firebase**
   - 使用与生产环境相同的Firebase配置
   - 确保Firebase Realtime Database的规则允许读写操作
   - 本地开发环境会自动使用相同的Firebase配置进行数据存储

## 关键代码

### 后端服务器 (`backend/server.js`)

```javascript
// 初始化Express服务器
const app = express();
const port = process.env.PORT || 3000;

// 配置CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// MQTT连接
function connectMQTT() {
  const url = `mqtts://${mqttConfig.broker}:${mqttConfig.port}`;
  
  mqttClient = mqtt.connect(url, {
    clientId: mqttConfig.clientId + '_' + Date.now(),
    username: mqttConfig.username,
    password: mqttConfig.password,
    clean: true,
    keepalive: 60
  });
  
  // 处理MQTT事件...
}

// API接口
app.get('/api/sensor-data', (req, res) => {
  res.json(sensorData);
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});
```

### 前端数据获取和Firebase存储 (`index.html`)

```javascript
// Firebase配置
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 后端API地址
// 本地开发环境使用本地API，生产环境使用Replit API
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal ? 'http://localhost:3000/api' : 'https://your-replit-app.sisko.replit.dev:3000/api';

// 获取最新传感器数据
async function refreshData() {
  try {
    const response = await fetch(`${API_URL}/sensor-data`);
    const data = await response.json();
    document.getElementById('temperature').textContent = (data.temperature || '--') + ' °C';
    document.getElementById('humidity').textContent = (data.humidity || '--') + ' %';
    document.getElementById('update-time').textContent = data.datetime || '--';
    
    // 存储数据到Firebase
    if (data.temperature && data.humidity) {
      const timestamp = Date.now();
      const sensorDataWithTimestamp = {
        temperature: data.temperature,
        humidity: data.humidity,
        datetime: data.datetime || new Date().toLocaleString(),
        timestamp: timestamp
      };
      
      // 存储到Firebase数据库
      database.ref('sensor-data/' + timestamp).set(sensorDataWithTimestamp)
        .then(() => {
          console.log('数据存储到Firebase成功');
        })
        .catch((error) => {
          console.error('数据存储到Firebase失败:', error);
        });
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    alert('获取数据失败，请检查连接');
  }
}

// 绘制传感器数据图表
function drawSensorChart() {
  // 从Firebase获取历史数据
  database.ref('sensor-data').orderByChild('timestamp').once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      const timestamps = [];
      const temperatures = [];
      const humidities = [];
      
      // 处理数据
      if (data) {
        Object.values(data).forEach((item) => {
          if (item.timestamp && item.temperature && item.humidity) {
            const date = new Date(item.timestamp);
            timestamps.push(date.toLocaleString());
            temperatures.push(item.temperature);
            humidities.push(item.humidity);
          }
        });
      }
      
      // 绘制图表
      const ctx = document.getElementById('sensorChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: timestamps,
          datasets: [
            {
              label: '温度 (°C)',
              data: temperatures,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: '湿度 (%)',
              data: humidities,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 2,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false
            }
          },
          plugins: {
            title: {
              display: true,
              text: '温湿度变化趋势',
              font: {
                size: 16
              }
            },
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });
    })
    .catch((error) => {
      console.error('获取历史数据失败:', error);
    });
}

// 自动刷新
refreshData();
setInterval(refreshData, 3*60*1000);

// 页面加载完成后绘制图表
window.addEventListener('load', drawSensorChart);
```

## 常见问题及解决方案

1. **Replit端口暴露问题**
   - 症状：API请求返回502错误
   - 解决方案：在`.replit`文件中添加`[web]`配置，确保端口3000被暴露

2. **GitHub Pages 404错误**
   - 症状：访问GitHub Pages URL返回404
   - 解决方案：确保正确推送`gh-pages`分支，并在GitHub设置中启用GitHub Pages

3. **MQTT连接失败**
   - 症状：后端日志显示MQTT连接错误
   - 解决方案：检查MQTT broker地址、端口、用户名和密码是否正确

4. **CORS错误**
   - 症状：前端控制台显示CORS错误
   - 解决方案：确保后端配置了正确的CORS设置

5. **Firebase连接失败**
   - 症状：前端控制台显示Firebase连接错误
   - 解决方案：检查Firebase配置信息是否正确，确保Firebase项目已启用

6. **Firebase数据存储失败**
   - 症状：控制台显示"数据存储到Firebase失败"错误
   - 解决方案：检查Firebase Realtime Database的规则是否允许读写操作，确保数据库URL正确

7. **Chart.js图表不显示**
   - 症状：页面上图表区域为空
   - 解决方案：确保Chart.js库已正确加载，检查Canvas元素ID是否为"sensorChart"，确保Firebase中有数据

## 项目优势

1. **架构清晰**：前后端分离，职责明确
2. **部署简单**：使用GitHub Pages和Replit，无需自己搭建服务器
3. **实时数据**：通过MQTT协议获取实时传感器数据
4. **自动刷新**：前端自动定时刷新数据，保持数据最新
5. **数据持久化**：使用Firebase Realtime Database存储历史数据
6. **数据可视化**：使用Chart.js展示温湿度变化趋势
7. **可扩展性**：可以轻松添加更多传感器数据类型和功能

## 应用场景

- **物联网监控**：实时监控温湿度、光照等环境数据
- **智能家居**：展示智能家居设备状态
- **工业监控**：监控工厂设备运行状态
- **环境监测**：监测空气质量、噪音等环境参数

这个项目展示了如何使用现代Web技术构建一个完整的物联网数据监控系统，从MQTT数据获取到前端展示的全流程。