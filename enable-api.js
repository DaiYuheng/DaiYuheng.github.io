// 要启用真实API，请按以下步骤操作：

// 1. 运行代理服务器：python proxy-server.py
// 2. 在script.js中找到这行代码并修改：

// 将这行：
// endpoint: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://xingchen-api.xf-yun.com/workflow/v1/chat/completions'),

// 改为：
// endpoint: 'http://localhost:8080/api/chat',

// 3. 取消注释API调用代码
// 4. 注释掉模拟响应代码

// 完整的修改示例：
/*
// 注释掉这些行：
// await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
// return this.getMockResponse(message);

// 取消注释API调用部分（移除 /* 和 */）
*/