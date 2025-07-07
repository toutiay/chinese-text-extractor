import fs from 'fs';
import path from 'path';
import { parse } from "@babel/parser";
const traverse = require("@babel/traverse").default;
import ts from 'typescript';

export class ChineseTextExtractor {
  private chineseSet: Set<string> = new Set();
  private outputDir: string;
  private outputFileName: string;

  constructor(outputDir: string, outputFileName: string = 'chinese_texts.txt') {
    this.outputDir = outputDir;
    this.outputFileName = outputFileName;
    this.ensureOutputDirExists();
  }

  /**
   * 确保输出目录存在
   */
  private ensureOutputDirExists(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 提取指定文件夹中的所有中文字符
   * @param folderPath 文件夹路径
   */
  public extractChineseFromFolder(folderPath: string): void {
    console.log(`开始提取文件夹: ${folderPath}`);

    const files = this.getAllFiles(folderPath);

    for (const file of files) {
      try {
        if (file.endsWith('.ts')) {
          console.log(`处理TS文件: ${file}`);
          this.extractChineseFromTsFile(file);
        } else if (file.endsWith('.js')) {
          console.log(`处理JS文件: ${file}`);
          this.extractChineseFromJsFile(file);
        } else if (file.endsWith('.prefab')) {
          console.log(`处理Prefab文件: ${file}`);
          this.extractChineseFromPrefabFile(file);
        } else if (file.endsWith('.json')) {
          console.log(`处理JSON文件: ${file}`);
          this.extractChineseFromJsonFile(file);
        }
      } catch (error) {
        console.error(`处理文件 ${file} 时出错:`, error);
      }
    }

    this.saveToFile();
    console.log(`提取完成！共找到 ${this.chineseSet.size} 个不重复的中文字符串`);
  }

  /**
   * 递归获取所有文件
   */
  private getAllFiles(dir: string, files: string[] = []): string[] {
    if (!fs.existsSync(dir)) {
      console.error(`目录不存在: ${dir}`);
      return files;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.getAllFiles(fullPath, files);
      } else if (this.isTargetFile(item)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * 判断是否为目标文件类型
   */
  private isTargetFile(filename: string): boolean {
    return filename.endsWith('.ts') || filename.endsWith('.js') || filename.endsWith('.prefab') || filename.endsWith('.json');
  }

  /**
   * 检查字符串是否包含中文
   */
  private containsChinese(text: string): boolean {
    return /[\u4e00-\u9fa5]/.test(text);
  }

  /**
   * 清理中文字符串：保留中文、数字和必要的标点符号
   */
  private cleanChineseText(text: string): string {
    if (!text) return '';

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
  private addChineseString(text: string): void {
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
  private extractChineseFromTsFile(filePath: string): void {
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );

    this.visitTsNode(sourceFile);
  }

  /**
   * 递归访问TypeScript节点
   */
  private visitTsNode(node: ts.Node): void {
    if (ts.isStringLiteral(node) && this.containsChinese(node.text)) {
      if (this.shouldIncludeTsString(node)) {
        this.addChineseString(node.text);
      }
    }
    ts.forEachChild(node, (child) => this.visitTsNode(child));
  }

  /**
   * 判断TypeScript字符串是否应该包含（过滤注释和日志函数）
   */
  private shouldIncludeTsString(node: ts.Node): boolean {
    // 过滤tooltip和displayName
    if (this.isToolTipValueTs(node)) {
      return false;
    }

    // 过滤日志函数
    let parent = node.parent;
    while (parent) {
      if (ts.isCallExpression(parent)) {
        const callee = parent.expression;
        if (ts.isPropertyAccessExpression(callee) && this.isLogFunction(callee.name.text)) {
          return false;
        } else if (ts.isIdentifier(callee) && this.isLogFunction(callee.text)) {
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
  private extractChineseFromJsFile(filePath: string): void {
    const code = fs.readFileSync(filePath, 'utf8');

    try {
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx'],
      });

      traverse(ast, {
        StringLiteral: (path: any) => {
          if (this.containsChinese(path.node.value)) {
            if (this.shouldIncludeJsString(path)) {
              this.addChineseString(path.node.value);
            }
          }
        },
      });
    } catch (error) {
      console.error(`解析JS文件 ${filePath} 时出错:`, error);
    }
  }

  /**
   * 判断JavaScript字符串是否应该包含（过滤注释和日志函数）
   */
  private shouldIncludeJsString(path: any): boolean {
    // 过滤tooltip和displayName
    if (this.isToolTipValueJs(path)) {
      return false;
    }

    // 过滤日志函数
    let parentPath = path;
    while (parentPath != null) {
      if (
        this.isLogFunction(parentPath.node?.callee?.property?.name) ||
        this.isLogFunction(parentPath.node?.callee?.name)
      ) {
        return false;
      }
      parentPath = parentPath.parentPath;
    }

    return true;
  }

  /**
   * 提取Prefab文件中的中文
   */
  private extractChineseFromPrefabFile(filePath: string): void {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Prefab文件通常是JSON格式，尝试解析
      const jsonData = JSON.parse(content);
      this.extractChineseFromObject(jsonData);
    } catch (error) {
      // 如果不是JSON格式，尝试直接文本匹配
      console.warn(`Prefab文件 ${filePath} 不是有效的JSON格式，尝试文本匹配`);
      this.extractChineseFromText(filePath);
    }
  }

  /**
   * 提取JSON文件中的中文
   */
  private extractChineseFromJsonFile(filePath: string): void {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(content);
      this.extractChineseFromObject(jsonData);
    } catch (error) {
      console.error(`解析JSON文件 ${filePath} 时出错:`, error);
      // 如果JSON解析失败，尝试文本匹配
      this.extractChineseFromText(filePath);
    }
  }

  /**
   * 从对象中递归提取中文
   */
  private extractChineseFromObject(obj: any): void {
    if (typeof obj === 'string') {
      if (this.containsChinese(obj)) {
        this.addChineseString(obj);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => this.extractChineseFromObject(item));
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(value => this.extractChineseFromObject(value));
    }
  }

  /**
   * 从文本中提取中文（用于非JSON格式的prefab文件）
   */
  private extractChineseFromText(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf8');

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
  protected isLogFunction(name: string): boolean {
    if (!name) return false;
    const logFunctions = [
      'log', 'error', 'debug', 'info', 'warn', 'console',
      'pintLog', 'receiveFightLog', 'sendFightLog', 'assert', 'alert'
    ];
    return logFunctions.includes(name);
  }

  /**
   * 判断是否为tooltip值（TypeScript）
   */
  private isToolTipValueTs(node: ts.Node): boolean {
    const parentNode = node.parent;
    if (ts.isPropertyAssignment(parentNode)) {
      const key = parentNode.name;
      if (ts.isIdentifier(key) && this.isTooltipKey(key.text)) {
        return true;
      }
      return this.isToolTipValueTs(parentNode.parent);
    }
    return false;
  }

  /**
   * 判断是否为tooltip值（JavaScript）
   */
  private isToolTipValueJs(path: any): boolean {
    return path.parentPath?.isObjectProperty() &&
      this.isTooltipKey(path.parentPath?.node?.key?.name);
  }

  /**
   * 判断是否为tooltip相关的键名
   */
  protected isTooltipKey(keyName: string): boolean {
    if (!keyName) return false;
    const tooltipKeys = ['tooltip', 'displayName', 'description', 'placeholder'];
    return tooltipKeys.includes(keyName);
  }

  /**
   * 保存结果到文件
   */
  private saveToFile(): void {
    const outputPath = path.join(this.outputDir, this.outputFileName);
    const chineseArray = Array.from(this.chineseSet).sort();

    // 创建文件内容
    let content = chineseArray.join('');

    // 把所有的感叹号换成 ^!
    if (content.includes("!")) {
      content = content.replace(/!/g, "^^^!");
    }

    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`中文字符串已保存到: ${outputPath}`);
    console.log(`共提取到 ${chineseArray.length} 个不重复的中文字符串`);
  }

  /**
   * 清空已收集的中文字符串
   */
  public clear(): void {
    this.chineseSet.clear();
  }

  /**
   * 获取已收集的中文字符串数组
   */
  public getChineseStrings(): string[] {
    return Array.from(this.chineseSet);
  }
}

// 使用示例
export function extractChineseText(folderPath: string, outputDir: string, outputFileName?: string): void {
  const extractor = new ChineseTextExtractor(outputDir, outputFileName);
  extractor.extractChineseFromFolder(folderPath);
} 