# Markdown 功能说明

聊天界面现在支持完整的Markdown格式和代码高亮！

## 支持的Markdown语法

### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 文本格式
```markdown
**粗体文本**
*斜体文本*
~~删除线~~
`行内代码`
```

### 列表
```markdown
- 无序列表项1
- 无序列表项2

1. 有序列表项1
2. 有序列表项2
```

### 引用
```markdown
> 这是一段引用文本
> 可以多行
```

### 链接
```markdown
[链接文本](https://example.com)
```

### 代码块
````markdown
```python
def hello():
    print("Hello, World!")
```

```javascript
function hello() {
    console.log("Hello, World!");
}
```
````

### 表格
```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |
```

### 分隔线
```markdown
---
```

## 代码高亮

支持100+种编程语言的语法高亮，包括：

- Python
- JavaScript/TypeScript
- Java
- C/C++/C#
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin
- HTML/CSS
- SQL
- Bash/Shell
- 等等...

### 使用方法

在代码块中指定语言：

````markdown
```python
# Python代码会自动高亮
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```
````

如果不指定语言，系统会自动检测：

````markdown
```
function hello() {
    console.log("自动检测为JavaScript");
}
```
````

## 复制代码功能

- 鼠标悬停在代码块上会显示"复制"按钮
- 点击按钮一键复制代码
- 复制成功后显示"已复制"提示
- 2秒后自动恢复

## 样式特性

### 深色主题
- 代码块使用GitHub Dark主题
- 适合长时间阅读
- 高对比度，保护视力

### 响应式设计
- 代码块支持横向滚动
- 在手机上也能完美显示
- 自适应不同屏幕尺寸

### 美化元素
- 圆角边框
- 柔和阴影
- 平滑过渡动画
- 悬停效果

## 测试示例

你可以让AI生成以下内容来测试Markdown功能：

### 测试提示词

1. **代码示例**
   ```
   请用Python写一个快速排序算法
   ```

2. **表格**
   ```
   请创建一个对比Python和JavaScript的表格
   ```

3. **列表**
   ```
   请列出学习编程的10个步骤
   ```

4. **混合格式**
   ```
   请写一篇关于Markdown的教程，包含标题、列表、代码示例和表格
   ```

## 技术实现

### 使用的库

- **marked.js** - Markdown解析器
  - 版本：11.1.1
  - 支持GitHub风格Markdown (GFM)
  - 自动换行支持

- **highlight.js** - 代码高亮
  - 版本：11.9.0
  - 支持190+种语言
  - GitHub Dark主题

### 特性

- ✅ 完整的Markdown语法支持
- ✅ 自动代码高亮
- ✅ 语言自动检测
- ✅ 一键复制代码
- ✅ 响应式设计
- ✅ 深色主题优化
- ✅ 安全的HTML渲染

## 自定义配置

如果需要修改Markdown渲染行为，可以在 `script.js` 的 `formatMessage` 方法中调整 `marked.setOptions`：

```javascript
marked.setOptions({
    breaks: true,      // 换行支持
    gfm: true,         // GitHub风格
    headerIds: false,  // 禁用标题ID
    mangle: false,     // 禁用邮箱混淆
    // 更多选项...
});
```

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动浏览器全支持

## 性能优化

- CDN加速加载
- 按需高亮（只高亮可见代码）
- 轻量级库（总大小 < 200KB）
- 无需构建工具

## 安全性

- 自动转义HTML标签
- 防止XSS攻击
- 安全的代码渲染
- 可信的CDN源