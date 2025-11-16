# 讯飞星火API正确格式

## 请求格式

### Headers
```json
{
    "Content-Type": "application/json",
    "Accept": "text/event-stream",
    "Authorization": "Bearer {API_KEY}:{API_SECRET}"
}
```

**重要**: Authorization格式必须是 `Bearer API_KEY:API_SECRET`，用冒号连接

### Request Body
```json
{
    "flow_id": "7395016121178791938",
    "uid": "123",
    "parameters": {
        "AGENT_USER_INPUT": "你好"
    },
    "ext": {
        "bot_id": "workflow",
        "caller": "workflow"
    },
    "stream": true
}
```

## 响应格式

### 成功响应
```json
{
    "code": 0,
    "message": "Success",
    "id": "cha000c0076@dx191c21ce879b8f3532",
    "created": 123412324431,
    "workflow_step": {
        "seq": 0,
        "progress": 0.4
    },
    "choices": [
        {
            "delta": {
                "role": "assistant",
                "content": "你好，",
                "reasoning_content": ""
            },
            "index": 0,
            "finish_reason": null
        }
    ]
}
```

## 代码实现

### JavaScript/Fetch
```javascript
const API_KEY = 'cb39d80bed4cd4906f3f61c3474eb83d';
const API_SECRET = 'NjA4Nzc1OGI1NTY5M2I0ZDYxNTJmYjM2';
const FLOW_ID = '7395016121178791938';

const response = await fetch('https://xingchen-api.xf-yun.com/workflow/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Authorization': `Bearer ${API_KEY}:${API_SECRET}`
    },
    body: JSON.stringify({
        flow_id: FLOW_ID,
        uid: '123',
        parameters: {
            'AGENT_USER_INPUT': '你好'
        },
        ext: {
            bot_id: 'workflow',
            caller: 'workflow'
        },
        stream: true
    })
});

const data = await response.json();
console.log(data.choices[0].delta.content);
```

### Python
```python
import requests

headers = {
    "Content-Type": "application/json",
    "Accept": "text/event-stream",
    "Authorization": f"Bearer {API_KEY}:{API_SECRET}"
}

data = {
    "flow_id": "7395016121178791938",
    "uid": "123",
    "parameters": {
        "AGENT_USER_INPUT": "你好"
    },
    "ext": {
        "bot_id": "workflow",
        "caller": "workflow"
    },
    "stream": True
}

response = requests.post(
    'https://xingchen-api.xf-yun.com/workflow/v1/chat/completions',
    headers=headers,
    json=data
)
```

## 常见错误

### 403 Forbidden
- 检查Authorization格式是否正确
- 确认API_KEY和API_SECRET是否有效
- 确认flow_id是否存在

### 404 Not Found
- 检查endpoint URL是否正确
- 确认flow_id是否正确

### CORS错误
- 使用GitHub Pages或其他在线托管
- 或使用本地服务器
- 或在浏览器中禁用CORS（仅开发环境）

## 部署建议

1. **GitHub Pages**: 最简单，免费，自动解决CORS
2. **Netlify/Vercel**: 免费，支持自定义域名
3. **本地服务器**: 开发测试使用