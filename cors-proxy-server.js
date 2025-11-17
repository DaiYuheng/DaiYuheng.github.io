// 简单的Node.js CORS代理服务器
// 可以部署到 Heroku, Railway, Render 等免费平台

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS
app.use(cors());
app.use(express.json());

// 代理端点
app.post('/api/chat', async (req, res) => {
  try {
    const API_KEY = 'cb39d80bed4cd4906f3f61c3474eb83d';
    const API_SECRET = 'NjA4Nzc1OGI1NTY5M2I0ZDYxNTJmYjM2';
    
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
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CORS代理服务器运行在端口 ${PORT}`);
});

// package.json 内容：
/*
{
  "name": "cors-proxy",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "node-fetch": "^2.6.7"
  }
}
*/