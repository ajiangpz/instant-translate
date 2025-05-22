# 即时翻译 Chrome 扩展

一个简单而强大的 Chrome 浏览器扩展，支持实时翻译输入框中的文本。

## 功能特点

- 实时翻译：输入时自动翻译
- 支持多种输入方式：
  - 普通文本输入框
  - 文本区域
  - 可编辑内容区域
  - ProseMirror 编辑器
- 科幻风格界面：美观的弹出窗口设计
- 一键应用：快速将翻译结果应用到输入框
- 多语言支持：可配置源语言和目标语言
- 智能输入法处理：支持中文输入法

## 安装方法

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/instant-translate.git
cd instant-translate
```

2. 安装依赖：
```bash
npm install
```

3. 构建项目：
```bash
npm run build
```

4. 在 Chrome 中加载扩展：
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 启用开发者模式
   - 点击"加载已解压的扩展程序"
   - 选择项目目录

## 使用方法

1. 在支持文本输入的网页上
2. 输入文本（支持中文输入法）
3. 自动显示翻译结果
4. 点击"应用翻译"使用翻译结果

## 配置选项

在扩展选项中可以配置：
- 源语言
- 目标语言

## 技术栈

- TypeScript
- Webpack
- Chrome Extension Manifest V3

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！ 