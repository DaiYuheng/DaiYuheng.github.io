# Cloudflare Workers 快速设置指南

## 为什么需要这个？

讯飞星火API不允许浏览器直接调用（CORS限制），公共代理也不支持Authorization头。
Cloudflare Workers是唯一免费且可靠的解决方案。

## 步骤（5分钟）

### 1. 注册Cloudflare账号
- 访问：https://dash.cloudflare.com/sign-up
- 使用邮箱注册（免费）
- 验证邮箱

### 2. 创建Worker
1. 登录后，点击左侧 "Workers & Pages"
2. 点击 "Create application"
3. 点击 "Create Worker"
4. 名称输入：`xingchen-proxy`（或任意名称）
5. 点击 "Deploy"

### 3. 编辑Worker代码
1. 点击 "Edit code"
2. **删除所有现有代码**
3. **复制下面的完整代码**：

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 处理CORS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    })
  }
  
  // 只允许POST请求
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }

  try {
    // 你的API配置
    const API_KEY = 'cb39d80bed4cd4906f3f61c3474eb83d'
    const API_SECRET = 'NjA4Nzc1OGI1NTY5M2I0ZDYxNTJmYjM2'
    
    // 获取请求体
    const body = await request.text()
    
    // 转发到讯飞API
    const response = await fetch('https://xingchen-api.xf-yun.com/workflow/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Authorization': `Bearer ${API_KEY}:${API_SECRET}`
      },
      body: body
    })

    // 获取响应
    const data = await response.text()
    
    // 返回响应，添加CORS头
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}
```

4. 点击右上角 "Save and Deploy"

### 4. 获取Worker URL
- 部署成功后，你会看到类似这样的URL：
  ```
  https://xingchen-proxy.你的用户名.workers.dev
  ```
- **复制这个URL**

### 5. 更新前端代码

在 `script.js` 中找到这部分：

```javascript
const API_CONFIG = {
    endpoint: USE_PROXY 
        ? 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://xingchen-api.xf-yun.com/workflow/v1/chat/completions')
        : 'https://xingchen-api.xf-yun.com/workflow/v1/chat/completions',
```

改为：

```javascript
const API_CONFIG = {
    endpoint: 'https://xingchen-proxy.你的用户名.workers.dev',  // 替换为你的Worker URL
```

### 6. 上传到GitHub
1. 保存修改后的 `script.js`
2. 上传到GitHub
3. 等待1-2分钟
4. 刷新GitHub Pages页面
5. 测试聊天功能

## 完成！

现在你的聊天界面应该可以正常工作了！

## 常见问题

### Q: Worker URL在哪里找？
A: Workers & Pages → 你的worker名称 → 右侧会显示URL

### Q: 免费额度够用吗？
A: 每天10万次请求，个人使用完全够用

### Q: 可以自定义域名吗？
A: 可以！在Worker设置中添加自定义域名

### Q: 如何查看Worker日志？
A: 在Worker页面点击 "Logs" 标签

### Q: Worker代码可以修改吗？
A: 可以随时编辑和重新部署

## 测试Worker

部署后，可以用curl测试：

```bash
curl -X POST https://xingchen-proxy.你的用户名.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "flow_id": "7395016121178791938",
    "uid": "123",
    "parameters": {"AGENT_USER_INPUT": "你好"},
    "ext": {"bot_id": "workflow", "caller": "workflow"},
    "stream": true
  }'
```

应该返回API响应。

## 安全提示

⚠️ 当前配置将API密钥硬编码在Worker中。

生产环境建议：
1. 使用Cloudflare环境变量存储密钥
2. 添加访问限制（域名白名单）
3. 实现速率限制

但对于学习和个人项目，当前配置已经足够安全。