export declare class ChineseTextExtractor {
    private chineseSet;
    private outputDir;
    private outputFileName;
    constructor(outputDir: string, outputFileName?: string);
    /**
     * 确保输出目录存在
     */
    private ensureOutputDirExists;
    /**
     * 提取指定文件夹中的所有中文字符
     * @param folderPath 文件夹路径
     */
    extractChineseFromFolder(folderPath: string): void;
    /**
     * 递归获取所有文件
     */
    private getAllFiles;
    /**
     * 判断是否为目标文件类型
     */
    private isTargetFile;
    /**
     * 检查字符串是否包含中文
     */
    private containsChinese;
    /**
     * 清理中文字符串：保留中文、数字和必要的标点符号
     */
    private cleanChineseText;
    /**
     * 添加中文字符串到集合（自动清理）
     */
    private addChineseString;
    /**
     * 提取TypeScript文件中的中文
     */
    private extractChineseFromTsFile;
    /**
     * 递归访问TypeScript节点
     */
    private visitTsNode;
    /**
     * 判断TypeScript字符串是否应该包含（过滤注释和日志函数）
     */
    private shouldIncludeTsString;
    /**
     * 提取JavaScript文件中的中文
     */
    private extractChineseFromJsFile;
    /**
     * 判断JavaScript字符串是否应该包含（过滤注释和日志函数）
     */
    private shouldIncludeJsString;
    /**
     * 提取Prefab文件中的中文
     */
    private extractChineseFromPrefabFile;
    /**
     * 提取JSON文件中的中文
     */
    private extractChineseFromJsonFile;
    /**
     * 从对象中递归提取中文
     */
    private extractChineseFromObject;
    /**
     * 从文本中提取中文（用于非JSON格式的prefab文件）
     */
    private extractChineseFromText;
    /**
     * 判断是否为日志函数
     */
    protected isLogFunction(name: string): boolean;
    /**
     * 判断是否为tooltip值（TypeScript）
     */
    private isToolTipValueTs;
    /**
     * 判断是否为tooltip值（JavaScript）
     */
    private isToolTipValueJs;
    /**
     * 判断是否为tooltip相关的键名
     */
    protected isTooltipKey(keyName: string): boolean;
    /**
     * 保存结果到文件
     */
    private saveToFile;
    /**
     * 清空已收集的中文字符串
     */
    clear(): void;
    /**
     * 获取已收集的中文字符串数组
     */
    getChineseStrings(): string[];
}
export declare function extractChineseText(folderPath: string, outputDir: string, outputFileName?: string): void;
//# sourceMappingURL=ChineseTextExtractor.d.ts.map