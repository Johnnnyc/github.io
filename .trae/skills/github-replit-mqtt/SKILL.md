---
name: "github-replit-mqtt"
description: "实现GitHub静态网页通过Replit后端实时获取MQTT数据的完整项目流程。当用户需要创建类似的物联网数据监控系统时调用。"
---

# GitHub静态网页通过Replit后端实时获取MQTT数据

## 项目概述

这是一个完整的全栈项目，使用GitHub Pages作为静态前端，Replit作为后端服务器，通过MQTT协议实时获取传感器数据并在网页上展示。

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **后端**：Node.js, Express.js, MQTT
- **部署**：GitHub Pages, Replit
- **协议**：MQTT, HTTP/HTTPS

## 核心功能

1. **MQTT数据获取**：后端服务器连接到MQTT broker，接收传感器数据
2. **API接口**：后端提供RESTful API接口，供前端获取传感器数据
3. **实时数据展示**：前端通过API获取数据并在页面上展示
4. **自动数据刷新**：前端每3分钟自动刷新一次数据
5. **手动数据刷新**：提供手动刷新按钮（可选）

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

2. **构建项目**
   - 运行`npm run build`生成生产版本
   - 构建产物会生成在`dist`目录

3. **部署到GitHub Pages**
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

### 前端数据获取 (`index.html`)

```javascript
// 后端API地址
const API_URL = 'https://your-replit-app.sisko.replit.dev:3000/api';

// 获取最新传感器数据
async function refreshData() {
  try {
    const response = await fetch(`${API_URL}/sensor-data`);
    const data = await response.json();
    document.getElementById('temperature').textContent = (data.temperature || '--') + ' °C';
    document.getElementById('humidity').textContent = (data.humidity || '--') + ' %';
    document.getElementById('update-time').textContent = data.datetime || '--';
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}

// 自动刷新
refreshData();
setInterval(refreshData, 3*60*1000);
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

## 项目优势

1. **架构清晰**：前后端分离，职责明确
2. **部署简单**：使用GitHub Pages和Replit，无需自己搭建服务器
3. **实时数据**：通过MQTT协议获取实时传感器数据
4. **自动刷新**：前端自动定时刷新数据，保持数据最新
5. **可扩展性**：可以轻松添加更多传感器数据类型和功能

## 应用场景

- **物联网监控**：实时监控温湿度、光照等环境数据
- **智能家居**：展示智能家居设备状态
- **工业监控**：监控工厂设备运行状态
- **环境监测**：监测空气质量、噪音等环境参数

这个项目展示了如何使用现代Web技术构建一个完整的物联网数据监控系统，从MQTT数据获取到前端展示的全流程。