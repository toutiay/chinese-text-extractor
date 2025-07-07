import { ChineseTextExtractor } from './ChineseTextExtractor';
import fs from 'fs';
import path from 'path';

// 创建测试用的文件夹和文件 (此函数现在不再使用，直接测试指定目录)
function createTestFiles() {
  console.log('💡 提示: 现在直接测试指定目录，不创建测试文件');
}

// 运行测试
function runTest() {
  console.log('🧪 开始运行测试...\n');
  
  // 测试目录
  const testDir = 'D:/project/dgr/qshop/proj_qshop/assets/';
  
  // 检查测试目录是否存在
  if (!fs.existsSync(testDir)) {
    console.log('❌ 测试目录不存在:', testDir);
    return;
  }
  
  // 创建输出目录
  const outputDir = './test-output';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 运行提取
  const extractor = new ChineseTextExtractor(outputDir, 'test_chinese.txt');
  extractor.extractChineseFromFolder(testDir);
  
  // 获取结果
  const results = extractor.getChineseStrings();
  
  console.log('\n🔍 提取结果:');
  console.log(`📊 共提取到 ${results.length} 个中文字符串:`);
  console.log('='.repeat(50));
  
  results.forEach((str, index) => {
    console.log(`${index + 1}. ${str}`);
  });
  
  console.log('='.repeat(50));
  console.log(`✅ 提取完成！结果已保存到: ${outputDir}/test_chinese.txt`);
  
  // 显示输出文件内容
  const outputFile = path.join(outputDir, 'test_chinese.txt');
  if (fs.existsSync(outputFile)) {
    console.log('\n📄 输出文件内容:');
    const fileContent = fs.readFileSync(outputFile, 'utf8');
    console.log(fileContent);
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runTest();
}

export { runTest, createTestFiles }; 