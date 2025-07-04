#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChineseTextExtractor_1 = require("./ChineseTextExtractor");
function showHelp() {
    console.log(`
中文文本提取工具 - Chinese Text Extractor

使用方法:
  extract-chinese <源文件夹> [输出目录] [输出文件名]

参数:
  源文件夹        要扫描的文件夹路径 (必需)
  输出目录        输出文件的目录 (可选，默认: ./output)
  输出文件名      输出文件名 (可选，默认: chinese_texts.txt)

示例:
  extract-chinese ./src
  extract-chinese ./src ./extracted
  extract-chinese ./src ./extracted my_chinese.txt
  extract-chinese "/path/to/project/scripts" "./results" "project_chinese.txt"

选项:
  -h, --help     显示帮助信息
  -v, --version  显示版本信息

支持的文件类型:
  - TypeScript (.ts)
  - JavaScript (.js)
  - Prefab (.prefab)

功能特性:
  ✅ 智能过滤日志函数中的中文
  ✅ 过滤tooltip等注释属性中的中文
  ✅ 递归遍历子文件夹
  ✅ 自动去重和排序
  ✅ UTF-8编码输出
`);
}
function showVersion() {
    console.log('chinese-text-extractor v1.0.0');
}
function main() {
    const args = process.argv.slice(2);
    // 处理帮助和版本参数
    if (args.includes('-h') || args.includes('--help')) {
        showHelp();
        return;
    }
    if (args.includes('-v') || args.includes('--version')) {
        showVersion();
        return;
    }
    // 检查必需参数
    if (args.length === 0) {
        console.error('❌ 错误: 请提供源文件夹路径');
        console.log('使用 extract-chinese -h 查看帮助信息');
        process.exit(1);
    }
    const sourcePath = args[0];
    const outputDir = args[1] || './output';
    const outputFileName = args[2] || 'chinese_texts.txt';
    console.log('🚀 中文文本提取工具启动...\n');
    // 显示配置信息
    console.log('📋 配置信息:');
    console.log(`   源文件夹: ${sourcePath}`);
    console.log(`   输出目录: ${outputDir}`);
    console.log(`   输出文件: ${outputFileName}`);
    console.log('');
    // 开始提取
    const startTime = Date.now();
    try {
        const extractor = new ChineseTextExtractor_1.ChineseTextExtractor(outputDir, outputFileName);
        extractor.extractChineseFromFolder(sourcePath);
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log('\n🎉 提取完成！');
        console.log(`⏱️  总耗时: ${duration} 秒`);
        console.log(`📄 结果文件: ${outputDir}/${outputFileName}`);
        const chineseStrings = extractor.getChineseStrings();
        if (chineseStrings.length > 0) {
            console.log('\n📊 统计信息:');
            console.log(`   共提取到 ${chineseStrings.length} 个不重复的中文字符串`);
            // 显示前几个示例
            console.log('\n📝 提取示例 (前5个):');
            chineseStrings.slice(0, 5).forEach((str, index) => {
                console.log(`   ${index + 1}. ${str}`);
            });
            if (chineseStrings.length > 5) {
                console.log(`   ... 还有 ${chineseStrings.length - 5} 个`);
            }
        }
        else {
            console.log('\n⚠️  警告: 没有找到中文字符串');
            console.log('   请检查:');
            console.log('   - 源文件夹路径是否正确');
            console.log('   - 文件夹中是否包含 .ts、.js 或 .prefab 文件');
            console.log('   - 文件中是否包含中文字符串');
        }
    }
    catch (error) {
        console.error('❌ 提取过程中发生错误:', error);
        if (error instanceof Error) {
            if (error.message.includes('ENOENT')) {
                console.error('   可能原因: 源文件夹不存在或无权限访问');
            }
            else if (error.message.includes('EACCES')) {
                console.error('   可能原因: 权限不足，请检查文件夹权限');
            }
        }
        console.log('\n💡 建议:');
        console.log('   - 检查文件夹路径是否正确');
        console.log('   - 确保有读取源文件夹的权限');
        console.log('   - 确保有写入输出目录的权限');
        console.log('   - 使用 extract-chinese -h 查看帮助信息');
        process.exit(1);
    }
}
// 运行主函数
main();
//# sourceMappingURL=cli.js.map