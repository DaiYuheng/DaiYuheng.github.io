// Cloudflare Worker 代理脚本
// 部署到 Cloudflare Workers 来解决 CORS 问题

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 只允许 POST 请求
  if (request.method === 'OPTIONS') {
    return handleOptions(request)
  }
  
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // 获取请求体
    const body = await request.json()
    
    // 你的API配置
    const API_KEY = 'cb39d80bed4cd4906f3f61c3474eb83d'
    const API_SECRET = 'NjA4Nzc1OGI1NTY5M2I0ZDYxNTJmYjM2'
    
    // 转发到讯飞API
    const response = await fetch('https://xingchen-api.xf-yun.com/workflow/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Authorization': `Bearer ${API_KEY}:${API_SECRET}`
      },
      body: JSON.stringify(body)
    })

    // 获取响应内容类型
    const contentType = response.headers.get('content-type') || 'application/json'
    
    // 获取响应
    const data = await response.text()
    
    // 返回响应，添加CORS头
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

function handleOptions(request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}