# github.io

个人网站项目，托管于 GitHub Pages。

## 网站访问

网站地址：`https://johnnnyc.github.io`

## 说明

这是一个通过 GitHub Pages 托管的静态网站。网站内容位于 `index.html` 文件中。

### GitHub Pages 配置要求

- 对于 `username.github.io` 格式的仓库，网站内容必须位于默认分支（通常是 `main` 或 `master`）
- GitHub Pages 会自动从根目录的 `index.html` 文件提供网站服务
- 确保仓库设置中 GitHub Pages 功能已启用

## 本地测试

你可以在本地测试网站：

```bash
# 使用 Python 启动简单 HTTP 服务器
python3 -m http.server 8000

# 或使用 Node.js
npx http-server
```

然后在浏览器中访问 `http://localhost:8000`