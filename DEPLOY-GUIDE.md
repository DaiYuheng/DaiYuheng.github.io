# 部署指南

## ⚠️ 重要提示

**不要在localhost测试API调用！** 

localhost会遇到CORS跨域问题。必须部署到在线服务器。

## 推荐部署方式：GitHub Pages

### 步骤1：创建GitHub仓库
1. 登录GitHub
2. 创建新仓库（例如：chat-interface）
3. 上传以下文件：
   - index.html
   - styles.css
   - script.js

### 步骤2：启用GitHub Pages
1. 进入仓库Settings
2. 找到Pages选项
3. Source选择：main分支
4. 点击Save

### 步骤3：访问你的网站
- 地址格式：`https://你的用户名.github.io/仓库名/`
- 例如：`https://username.github.io/chat-interface/`

### 步骤4：测试
1. 访问GitHub Pages地址
2. 发送测试消息
3. 检查是否正常工作

## 其他部署选项

### Netlify（推荐）
1. 访问 netlify.com
2. 拖拽文件夹到页面
3. 自动部署完成
4. 获得免费域名

### Vercel
1. 访问 vercel.com
2. 导入GitHub仓库
3. 自动部署
4. 支持自定义域名

## 本地测试（仅UI测试）

如果只想测试UI功能（不调用API）：

1. 在script.js中启用mock模式：
```javascript
// 注释掉API调用
// const response = await fetch(...);

// 启用mock响应
await new Promise(resolve => setTimeout(resolve, 1000));
return this.getMockResponse(message);
```

2. 直接打开index.html即可

## 常见问题

### Q: 为什么localhost不能用？
A: 浏览器的CORS安全策略阻止localhost调用外部API。必须部署到https域名。

### Q: GitHub Pages需要多久生效？
A: 通常1-5分钟。首次部署可能需要10分钟。

### Q: 如何更新代码？
A: 直接在GitHub上编辑文件或重新上传，GitHub Pages会自动更新。

### Q: 可以使用自定义域名吗？
A: 可以！在GitHub Pages设置中添加自定义域名。

## 测试清单

部署后测试以下功能：

- [ ] 页面正常加载
- [ ] 可以输入消息
- [ ] 点击发送按钮
- [ ] 显示加载动画
- [ ] 收到AI回复
- [ ] 对话历史正常显示
- [ ] New Chat按钮工作
- [ ] 响应式设计（手机端）

## 调试技巧

如果遇到问题：

1. **打开浏览器开发者工具**（F12）
2. **查看Console标签**
3. **查看Network标签**
4. **检查API请求详情**

常见错误：
- 403: API密钥错误
- 404: API地址错误
- CORS: 在localhost测试（需要部署）
- 500: 服务器错误

## 安全提示

⚠️ **不要在公开仓库中暴露API密钥！**

生产环境应该：
1. 使用环境变量
2. 通过后端代理API调用
3. 实现用户认证
4. 添加速率限制

当前配置仅用于学习和测试！