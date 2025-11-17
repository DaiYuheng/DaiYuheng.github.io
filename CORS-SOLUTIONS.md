# CORS 问题解决方案

## 问题说明

讯飞星火API不允许来自浏览器的直接跨域请求（CORS），即使部署到GitHub Pages也会被阻止。

错误信息：
```
Access to fetch at 'https://xingchen-api.xf-yun.com/...' has been blocked by CORS policy
```

## 解决方案对比

| 方案 | 难度 | 成本 | 推荐度 |
|------|------|------|--------|
| 1. 公共CORS代理 | ⭐ | 免费 | ⭐⭐⭐ (临时测试) |
| 2. Cloudflare Workers | ⭐⭐ | 免费 | ⭐⭐⭐⭐⭐ (推荐) |
| 3. 自建代理服务器 | ⭐⭐⭐ | 免费/付费 | ⭐⭐⭐⭐ |
| 4. 浏览器扩展 | ⭐ | 免费 | ⭐⭐ (仅开发) |

---

## 方案1：公共CORS代理（最简单）

### 优点
- 无需配置
- 立即可用
- 完全免费

### 缺点
- 不稳定
- 可能被限流
- 不适合生产环境

### 使用方法

在 `script.js` 中已经配置好了，设置 `USE_PROXY = true` 即可。

当前使用的代理：`https://api.allorigins.win/raw?url=`

### 其他可用的公共代理

```javascript
// 选项1: allOrigins
'https://api.allorigins.win/raw?url=' + encodeURIComponent(apiUrl)

// 选项2: CORS Anywhere (需要先访问激活)
'https://cors-anywhere.herokuapp.com/' + apiUrl

// 选项3: ThingProxy
'https://thingproxy.freeboard.io/fetch/' + apiUrl
```

---

## 方案2：Cloudflare Workers（推荐）

### 优点
- 完全免费（每天10万次请求）
- 稳定可靠
- 全球CDN加速
- 5分钟部署

### 步骤

1. **注册 Cloudflare 账号**
   - 访问 https://workers.cloudflare.com/
   - 免费注册

2. **创建 Worker**
   - 点击 "Create a Service"
   - 输入名称（如：xingchen-proxy）
   - 点击 "Create service"

3. **编辑代码**
   - 点击 "Quick edit"
   - 复制 `cloudflare-worker.js` 的内容
   - 粘贴并保存

4. **获取Worker URL**
   - 例如：`https://xingchen-proxy.你的用户名.workers.dev`

5. **更新前端代码**
   ```javascript
   const API_CONFIG = {
       endpoint: 'https://xingchen-proxy.你的用户名.workers.dev',
       // ...
   };
   ```

### 完整Worker代码

见 `cloudflare-worker.js` 文件

---

## 方案3：自建代理服务器

### 使用 Vercel/Netlify Functions

#### Vercel Serverless Function

创建 `api/chat.js`:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.API_KEY;
  const API_SECRET = process.env.API_SECRET;

  try {
    const response = await fetch('https://xingchen-api.xf-yun.com/workflow/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Authorization': `Bearer ${API_KEY}:${API_SECRET}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

部署到Vercel：
```bash
npm i -g vercel
vercel
```

---

## 方案4：浏览器扩展（仅开发）

### Chrome/Edge

1. 安装扩展：
   - "CORS Unblock"
   - "Allow CORS"
   - "Moesif Origin & CORS Changer"

2. 启用扩展

3. 刷新页面

### 命令行启动（临时）

**Chrome:**
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\temp\chrome_dev"
```

**Edge:**
```cmd
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --disable-web-security --user-data-dir="C:\temp\edge_dev"
```

⚠️ **警告：仅用于开发测试，不要用于日常浏览！**

---

## 推荐配置

### 开发/测试阶段
使用公共CORS代理或浏览器扩展

### 生产环境
使用 Cloudflare Workers 或自建代理服务器

---

## 当前配置

你的代码已经配置了公共CORS代理。

要切换到其他方案：

1. 部署代理服务器（Cloudflare Workers等）
2. 获取代理URL
3. 修改 `script.js` 中的 `endpoint`
4. 重新部署到GitHub Pages

---

## 安全建议

⚠️ **不要在前端代码中暴露API密钥！**

生产环境应该：
1. 使用后端代理
2. 在服务器端存储API密钥
3. 实现用户认证
4. 添加速率限制

当前配置仅用于学习和演示！