"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickExtract = exports.extractChineseText = exports.ChineseTextExtractor = void 0;
var ChineseTextExtractor_1 = require("./ChineseTextExtractor");
Object.defineProperty(exports, "ChineseTextExtractor", { enumerable: true, get: function () { return ChineseTextExtractor_1.ChineseTextExtractor; } });
Object.defineProperty(exports, "extractChineseText", { enumerable: true, get: function () { return ChineseTextExtractor_1.extractChineseText; } });
const ChineseTextExtractor_2 = require("./ChineseTextExtractor");
// 默认配置
const defaultConfig = {
    sourceFolders: [
        './src',
        './scripts',
        './assets'
    ],
    outputDir: './output',
    outputFileName: 'chinese_texts.txt'
};
/**
 * 快速提取中文字符串
 * @param config 配置选项
 */
function quickExtract(config = {}) {
    const finalConfig = { ...defaultConfig, ...config };
    console.log('🚀 开始提取中文字符串...\n');
    // 显示配置信息
    console.log('📋 配置信息:');
    console.log(`   输出目录: ${finalConfig.outputDir}`);
    console.log(`   输出文件: ${finalConfig.outputFileName}`);
    console.log(`   源文件夹: ${finalConfig.sourceFolders.join(', ')}`);
    console.log('');
    // 开始提取
    const startTime = Date.now();
    try {
        const extractor = new ChineseTextExtractor_2.ChineseTextExtractor(finalConfig.outputDir, finalConfig.outputFileName);
        // 逐个处理每个文件夹
        finalConfig.sourceFolders.forEach((folder, index) => {
            console.log(`📁 处理文件夹 ${index + 1}/${finalConfig.sourceFolders.length}: ${folder}`);
            try {
                extractor.extractChineseFromFolder(folder);
            }
            catch (error) {
                console.error(`处理文件夹 ${folder} 时出错:`, error);
            }
        });
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log('\n🎉 提取完成！');
        console.log(`⏱️  总耗时: ${duration} 秒`);
        console.log(`📄 结果文件: ${finalConfig.outputDir}/${finalConfig.outputFileName}`);
        return extractor.getChineseStrings();
    }
    catch (error) {
        console.error('❌ 提取过程中发生错误:', error);
        throw error;
    }
}
exports.quickExtract = quickExtract;
// 如果直接运行此文件，执行快速提取
if (require.main === module) {
    quickExtract();
}
//# sourceMappingURL=index.js.map