"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChineseTextExtractor = void 0;
exports.extractChineseText = extractChineseText;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const parser_1 = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const typescript_1 = __importDefault(require("typescript"));
const pako_1 = __importDefault(require("pako"));
class ChineseTextExtractor {
    constructor(outputDir, outputFileName = 'chinese_texts.txt') {
        this.chineseSet = new Set();
        this.outputDir = outputDir;
        this.outputFileName = outputFileName;
        this.ensureOutputDirExists();
    }
    /**
     * 确保输出目录存在
     */
    ensureOutputDirExists() {
        if (!fs_1.default.existsSync(this.outputDir)) {
            fs_1.default.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    /**
     * 提取指定文件夹中的所有中文字符
     * @param folderPath 文件夹路径
     */
    extractChineseFromFolder(folderPath) {
        console.log(`开始提取文件夹: ${folderPath}`);
        const files = this.getAllFiles(folderPath);
        for (const file of files) {
            try {
                if (file.endsWith('.ts')) {
                    console.log(`处理TS文件: ${file}`);
                    this.extractChineseFromTsFile(file);
                }
                else if (file.endsWith('.js')) {
                    console.log(`处理JS文件: ${file}`);
                    this.extractChineseFromJsFile(file);
                }
                else if (file.endsWith('.prefab')) {
                    console.log(`处理Prefab文件: ${file}`);
                    this.extractChineseFromPrefabFile(file);
                }
                else if (file.endsWith('.json')) {
                    console.log(`处理JSON文件: ${file}`);
                    this.extractChineseFromJsonFile(file, false);
                }
                else if (file.endsWith('.bin')) {
                    console.log(`处理bin文件: ${file}`);
                    this.extractChineseFromJsonFile(file, true);
                }
            }
            catch (error) {
                console.error(`处理文件 ${file} 时出错:`, error);
            }
        }
        this.saveToFile();
        console.log(`提取完成！共找到 ${this.chineseSet.size} 个不重复的中文字符串`);
    }
    /**
     * 递归获取所有文件
     */
    getAllFiles(dir, files = []) {
        if (!fs_1.default.existsSync(dir)) {
            console.error(`目录不存在: ${dir}`);
            return files;
        }
        const items = fs_1.default.readdirSync(dir);
        for (const item of items) {
            const fullPath = path_1.default.join(dir, item);
            const stat = fs_1.default.statSync(fullPath);
            if (stat.isDirectory()) {
                this.getAllFiles(fullPath, files);
            }
            else if (this.isTargetFile(item)) {
                files.push(fullPath);
            }
        }
        return files;
    }
    /**
     * 判断是否为目标文件类型
     */
    isTargetFile(filename) {
        return filename.endsWith('.ts') || filename.endsWith('.js') || filename.endsWith('.prefab') || filename.endsWith('.json') || filename.endsWith('.bin');
    }
    /**
     * 检查字符串是否包含中文
     */
    containsChinese(text) {
        return /[\u4e00-\u9fa5]/.test(text);
    }
    /**
     * 清理中文字符串：保留中文、数字和必要的标点符号
     */
    cleanChineseText(text) {
        if (!text)
            return '';
        // 去掉首尾和中间的空格
        const cleaned = text.replace(/\s+/g, '');
        let result = '';
        for (let i = 0; i < cleaned.length; i++) {
            if (!this.chineseSet.has(cleaned[i])) {
                result += cleaned[i];
            }
        }
        // 如果清理后的字符串仍然包含中文，则返回清理后的结果
        if (this.containsChinese(cleaned)) {
            return cleaned;
        }
        // 如果清理后没有中文了，返回空字符串
        return '';
    }
    /**
     * 添加中文字符串到集合（自动清理）
     */
    addChineseString(text) {
        const cleaned = this.cleanChineseText(text);
        if (cleaned) {
            console.log(`添加中文字符串: ${cleaned}`);
            for (let i = 0; i < cleaned.length; i++) {
                const element = cleaned[i];
                this.chineseSet.add(element);
            }
        }
    }
    /**
     * 提取TypeScript文件中的中文
     */
    extractChineseFromTsFile(filePath) {
        const sourceCode = fs_1.default.readFileSync(filePath, 'utf8');
        const sourceFile = typescript_1.default.createSourceFile(filePath, sourceCode, typescript_1.default.ScriptTarget.Latest, true);
        this.visitTsNode(sourceFile);
    }
    /**
     * 递归访问TypeScript节点
     */
    visitTsNode(node) {
        // 检查普通字符串字面量
        if (typescript_1.default.isStringLiteral(node) && this.containsChinese(node.text)) {
            if (this.shouldIncludeTsString(node)) {
                this.addChineseString(node.text);
            }
        }
        // 检查模板字符串（无替换变量的模板字面量）
        if (typescript_1.default.isNoSubstitutionTemplateLiteral(node) && this.containsChinese(node.text)) {
            if (this.shouldIncludeTsString(node)) {
                this.addChineseString(node.text);
            }
        }
        typescript_1.default.forEachChild(node, (child) => this.visitTsNode(child));
    }
    /**
     * 判断TypeScript字符串是否应该包含（过滤注释和日志函数）
     */
    shouldIncludeTsString(node) {
        // 过滤tooltip和displayName
        if (this.isToolTipValueTs(node)) {
            return false;
        }
        // 过滤日志函数
        let parent = node.parent;
        while (parent) {
            if (typescript_1.default.isCallExpression(parent)) {
                const callee = parent.expression;
                if (typescript_1.default.isPropertyAccessExpression(callee) && this.isLogFunction(callee.name.text)) {
                    return false;
                }
                else if (typescript_1.default.isIdentifier(callee) && this.isLogFunction(callee.text)) {
                    return false;
                }
            }
            parent = parent.parent;
        }
        return true;
    }
    /**
     * 提取JavaScript文件中的中文
     */
    extractChineseFromJsFile(filePath) {
        const code = fs_1.default.readFileSync(filePath, 'utf8');
        try {
            const ast = (0, parser_1.parse)(code, {
                sourceType: 'module',
                plugins: ['jsx'],
            });
            traverse(ast, {
                StringLiteral: (path) => {
                    if (this.containsChinese(path.node.value)) {
                        if (this.shouldIncludeJsString(path)) {
                            this.addChineseString(path.node.value);
                        }
                    }
                },
            });
        }
        catch (error) {
            console.error(`解析JS文件 ${filePath} 时出错:`, error);
        }
    }
    /**
     * 判断JavaScript字符串是否应该包含（过滤注释和日志函数）
     */
    shouldIncludeJsString(path) {
        // 过滤tooltip和displayName
        if (this.isToolTipValueJs(path)) {
            return false;
        }
        // 过滤日志函数
        let parentPath = path;
        while (parentPath != null) {
            if (this.isLogFunction(parentPath.node?.callee?.property?.name) ||
                this.isLogFunction(parentPath.node?.callee?.name)) {
                return false;
            }
            parentPath = parentPath.parentPath;
        }
        return true;
    }
    /**
     * 提取Prefab文件中的中文
     */
    extractChineseFromPrefabFile(filePath) {
        try {
            const content = fs_1.default.readFileSync(filePath, 'utf8');
            // Prefab文件通常是JSON格式，尝试解析
            const jsonData = JSON.parse(content);
            this.extractChineseFromObject(jsonData);
        }
        catch (error) {
            // 如果不是JSON格式，尝试直接文本匹配
            console.warn(`Prefab文件 ${filePath} 不是有效的JSON格式，尝试文本匹配`);
            this.extractChineseFromText(filePath);
        }
    }
    /**
     * 提取JSON文件中的中文
     */
    extractChineseFromJsonFile(filePath, decompress) {
        try {
            if (decompress) {
                const content = fs_1.default.readFileSync(filePath);
                const data = content instanceof ArrayBuffer
                    ? new Uint8Array(content)
                    : content;
                let decompressed;
                if (data.length >= 2 && data[0] === 0x78) {
                    // zlib格式（带头部）
                    decompressed = pako_1.default.inflate(data, { to: 'string' });
                }
                else {
                    // 原始deflate格式
                    decompressed = pako_1.default.inflateRaw(data, { to: 'string' });
                }
                this.extractChineseFromObject(JSON.parse(decompressed));
            }
            else {
                const content = fs_1.default.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(content);
                this.extractChineseFromObject(jsonData);
            }
        }
        catch (error) {
            console.error(`解析JSON文件 ${filePath} 时出错:`, error);
            // 如果JSON解析失败，尝试文本匹配
            this.extractChineseFromText(filePath);
        }
    }
    /**
     * 从对象中递归提取中文
     */
    extractChineseFromObject(obj) {
        if (typeof obj === 'string') {
            if (this.containsChinese(obj)) {
                this.addChineseString(obj);
            }
        }
        else if (Array.isArray(obj)) {
            obj.forEach(item => this.extractChineseFromObject(item));
        }
        else if (obj && typeof obj === 'object') {
            Object.values(obj).forEach(value => this.extractChineseFromObject(value));
        }
    }
    /**
     * 从文本中提取中文（用于非JSON格式的prefab文件）
     */
    extractChineseFromText(filePath) {
        const content = fs_1.default.readFileSync(filePath, 'utf8');
        // 使用正则表达式匹配中文字符串
        const chineseRegex = /["']([^"']*[\u4e00-\u9fa5][^"']*)["']/g;
        let match;
        while ((match = chineseRegex.exec(content)) !== null) {
            const chineseText = match[1];
            if (this.containsChinese(chineseText)) {
                this.addChineseString(chineseText);
            }
        }
    }
    /**
     * 判断是否为日志函数
     */
    isLogFunction(name) {
        if (!name)
            return false;
        const logFunctions = [
            'log', 'error', 'debug', 'info', 'warn', 'console',
            'pintLog', 'receiveFightLog', 'sendFightLog', 'assert', 'alert'
        ];
        return logFunctions.includes(name);
    }
    /**
     * 判断是否为tooltip值（TypeScript）
     */
    isToolTipValueTs(node) {
        const parentNode = node.parent;
        if (typescript_1.default.isPropertyAssignment(parentNode)) {
            const key = parentNode.name;
            if (typescript_1.default.isIdentifier(key) && this.isTooltipKey(key.text)) {
                return true;
            }
            return this.isToolTipValueTs(parentNode.parent);
        }
        return false;
    }
    /**
     * 判断是否为tooltip值（JavaScript）
     */
    isToolTipValueJs(path) {
        return path.parentPath?.isObjectProperty() &&
            this.isTooltipKey(path.parentPath?.node?.key?.name);
    }
    /**
     * 判断是否为tooltip相关的键名
     */
    isTooltipKey(keyName) {
        if (!keyName)
            return false;
        const tooltipKeys = ['tooltip', 'displayName', 'description', 'placeholder'];
        return tooltipKeys.includes(keyName);
    }
    /**
     * 保存结果到文件
     */
    saveToFile() {
        const outputPath = path_1.default.join(this.outputDir, this.outputFileName);
        const chineseArray = Array.from(this.chineseSet).sort();
        // 创建文件内容
        let content = chineseArray.join('');
        // 把所有的感叹号换成 ^!
        if (content.includes("!")) {
            content = content.replace(/!/g, `^^^!`);
        }
        if (content.includes(`"`)) {
            content = content.replace(/"/g, `""`);
        }
        fs_1.default.writeFileSync(outputPath, content, 'utf8');
        console.log(`中文字符串已保存到: ${outputPath}`);
        console.log(`共提取到 ${chineseArray.length} 个不重复的中文字符串`);
    }
    /**
     * 清空已收集的中文字符串
     */
    clear() {
        this.chineseSet.clear();
    }
    /**
     * 获取已收集的中文字符串数组
     */
    getChineseStrings() {
        return Array.from(this.chineseSet);
    }
}
exports.ChineseTextExtractor = ChineseTextExtractor;
// 使用示例
function extractChineseText(folderPath, outputDir, outputFileName) {
    const extractor = new ChineseTextExtractor(outputDir, outputFileName);
    extractor.extractChineseFromFolder(folderPath);
}
//# sourceMappingURL=ChineseTextExtractor.js.map