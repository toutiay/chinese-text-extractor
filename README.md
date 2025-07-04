# Chinese Text Extractor (中文文本提取工具)

一个用于提取 TypeScript、JavaScript 和 Prefab 文件中中文字符串的工具。

## 🌟 功能特性

- ✅ **多文件类型支持**: TypeScript (.ts)、JavaScript (.js)、Prefab (.prefab)
- ✅ **智能过滤**: 自动过滤日志函数、tooltip等注释属性中的中文
- ✅ **递归遍历**: 深度遍历文件夹及其子文件夹
- ✅ **自动去重**: 去重并按字母顺序排序
- ✅ **UTF-8编码**: 支持中文字符的正确编码
- ✅ **命令行工具**: 提供便捷的CLI工具
- ✅ **编程接口**: 支持在代码中调用

## 📦 安装

### 方式1: 从源码安装

```bash
git clone <repository-url>
cd chinese-text-extractor
npm install
npm run build
```

### 方式2: 全局安装 (如果发布到npm)

```bash
npm install -g chinese-text-extractor
```

## 🚀 快速开始

### 命令行使用

```bash
# 基本用法
extract-chinese ./src

# 指定输出目录
extract-chinese ./src ./output

# 指定输出文件名
extract-chinese ./src ./output my_chinese.txt

# 查看帮助
extract-chinese --help
```

### 编程接口

```typescript
import { ChineseTextExtractor, extractChineseText, quickExtract } from 'chinese-text-extractor';

// 方式1: 使用简单函数
extractChineseText('./src', './output', 'chinese.txt');

// 方式2: 使用类
const extractor = new ChineseTextExtractor('./output', 'chinese.txt');
extractor.extractChineseFromFolder('./src');

// 方式3: 快速提取
quickExtract({
  sourceFolders: ['./src', './scripts'],
  outputDir: './output',
  outputFileName: 'chinese.txt'
});
```

## 🔧 配置选项

### 智能过滤规则

工具会自动过滤以下类型的中文：

#### 1. 日志函数中的中文
```typescript
// 这些中文会被过滤掉
console.log('调试信息');
console.error('错误信息');
console.warn('警告信息');
```

#### 2. 注释属性中的中文
```typescript
// 这些中文会被过滤掉
const config = {
  tooltip: '提示信息',
  displayName: '显示名称',
  description: '描述信息',
  placeholder: '占位符'
};
```

#### 3. 其他日志函数
```typescript
// 这些也会被过滤掉
pintLog('游戏日志');
assert('断言信息');
alert('弹窗信息');
```

## 📁 项目结构

```
chinese-text-extractor/
├── src/
│   ├── ChineseTextExtractor.ts  # 核心提取类
│   ├── index.ts                 # 主入口文件
│   ├── cli.ts                   # 命令行工具
│   └── test.ts                  # 测试文件
├── dist/                        # 编译输出
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 测试

运行内置测试：

```bash
npm test
```

测试会自动：
1. 创建测试文件
2. 运行提取
3. 验证结果
4. 清理测试文件

## 📊 输出格式

生成的txt文件格式：
```
中文字符串1
中文字符串2
中文字符串3
...
```

每行一个中文字符串，已自动去重和排序。

## 🛠️ 开发

### 本地开发

```bash
# 克隆项目
git clone <repository-url>
cd chinese-text-extractor

# 安装依赖
npm install

# 开发模式 (监听文件变化)
npm run dev

# 构建项目
npm run build

# 运行测试
npm test
```

### 脚本命令

- `npm run build` - 编译TypeScript
- `npm run dev` - 开发模式（监听文件变化）
- `npm run start` - 运行主程序
- `npm run extract` - 编译并运行CLI工具
- `npm test` - 运行测试

## 🔍 使用示例

### 示例1: 提取Cocos Creator项目中的中文

```bash
extract-chinese "./assets/scripts" "./extracted" "cocos_chinese.txt"
```

### 示例2: 批量处理多个文件夹

```typescript
import { quickExtract } from 'chinese-text-extractor';

quickExtract({
  sourceFolders: [
    './assets/scripts',
    './assets/resources',
    './assets/prefabs'
  ],
  outputDir: './extracted',
  outputFileName: 'all_chinese.txt'
});
```

### 示例3: 自定义过滤规则

```typescript
import { ChineseTextExtractor } from 'chinese-text-extractor';

// 继承并自定义过滤规则
class CustomExtractor extends ChineseTextExtractor {
  // 重写过滤方法
  protected isLogFunction(name: string): boolean {
    const customLogFunctions = [
      'log', 'error', 'debug', 'info', 'warn',
      'myCustomLog', 'gameLog' // 添加自定义函数
    ];
    return customLogFunctions.includes(name);
  }
}
```

## 🐛 故障排除

### 常见问题

1. **"目录不存在"错误**
   - 检查文件夹路径是否正确
   - 使用绝对路径试试

2. **"权限被拒绝"错误**
   - 确保有读取源文件夹的权限
   - 确保有写入输出文件夹的权限

3. **输出文件为空**
   - 检查源文件夹是否包含ts、js、prefab文件
   - 检查文件中是否真的包含中文字符串

4. **编译错误**
   - 运行 `npm install` 重新安装依赖
   - 运行 `npm run build` 重新编译

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 支持TypeScript、JavaScript、Prefab文件提取
- 智能过滤功能
- 命令行工具
- 编程接口

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## �� 致谢

感谢所有贡献者和用户的支持！ 