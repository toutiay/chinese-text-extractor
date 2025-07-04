# 发布到NPM指南

## 🚀 发布前的准备工作

### 1. 更新项目信息
在发布之前，请确保更新以下信息：

**package.json 中需要更新的字段：**
- `author`: 替换为您的真实姓名和邮箱
- `repository.url`: 替换为您的实际GitHub仓库地址
- `homepage`: 替换为您的项目主页
- `bugs.url`: 替换为您的GitHub Issues地址

### 2. 检查包名是否可用
```bash
npm info chinese-text-extractor
```
如果包名已存在，需要更改为其他名称。

### 3. 构建项目
```bash
npm run build
```

### 4. 运行测试
```bash
npm test
```

## 📦 发布到NPM

### 步骤1: 登录到NPM
```bash
# 如果还没有npm账户，先注册
npm adduser

# 如果已有账户，登录
npm login
```

### 步骤2: 检查登录状态
```bash
npm whoami
```

### 步骤3: 发布包
```bash
npm publish
```

## 🔄 版本管理

### 更新版本号
```bash
# 补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 小版本 (1.0.0 -> 1.1.0)
npm version minor

# 主版本 (1.0.0 -> 2.0.0)
npm version major
```

### 重新发布
```bash
npm publish
```

## 🧪 测试安装

### 全局安装测试
```bash
npm install -g chinese-text-extractor
extract-chinese --help
```

### 本地项目安装测试
```bash
mkdir test-project
cd test-project
npm init -y
npm install chinese-text-extractor
```

## 🚨 常见问题

### 1. 包名冲突
如果包名已存在，需要：
- 更改package.json中的name字段
- 或者使用scoped package: `@your-username/chinese-text-extractor`

### 2. 权限问题
确保您有发布权限，如果是scoped package，需要：
```bash
npm publish --access public
```

### 3. 版本号问题
每次发布都需要更新版本号，不能重复发布相同版本。

## 📋 发布检查清单

- [ ] 更新package.json中的作者信息
- [ ] 更新repository URL
- [ ] 构建项目 (`npm run build`)
- [ ] 运行测试 (`npm test`)
- [ ] 检查包名可用性
- [ ] 登录到NPM
- [ ] 发布包 (`npm publish`)
- [ ] 测试安装和使用

## 🎉 发布成功后

1. 包将在 https://www.npmjs.com/package/chinese-text-extractor 上可见
2. 用户可以通过以下方式安装：
   ```bash
   npm install -g chinese-text-extractor
   ```
3. 更新README.md中的安装说明

## 📝 维护

- 定期更新依赖
- 修复bug后发布新版本
- 添加新功能后发布新版本
- 保持文档更新 