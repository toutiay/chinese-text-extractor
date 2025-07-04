import { ChineseTextExtractor, extractChineseText, quickExtract } from '../src/index';

// 示例1: 使用简单函数
console.log('=== 示例1: 使用简单函数 ===');
function example1() {
  // 提取单个文件夹
  extractChineseText('./src', './output', 'simple_chinese.txt');
}

// 示例2: 使用类的方式
console.log('=== 示例2: 使用类的方式 ===');
function example2() {
  const extractor = new ChineseTextExtractor('./output', 'class_chinese.txt');
  
  // 提取多个文件夹
  extractor.extractChineseFromFolder('./src');
  extractor.extractChineseFromFolder('./examples');
  
  // 获取结果
  const results = extractor.getChineseStrings();
  console.log(`共找到 ${results.length} 个中文字符串`);
  
  // 显示前几个结果
  console.log('前5个中文字符串:');
  results.slice(0, 5).forEach((str, index) => {
    console.log(`${index + 1}. ${str}`);
  });
}

// 示例3: 快速提取
console.log('=== 示例3: 快速提取 ===');
function example3() {
  quickExtract({
    sourceFolders: ['./src', './examples'],
    outputDir: './output',
    outputFileName: 'quick_chinese.txt'
  });
}

// 示例4: 自定义配置
console.log('=== 示例4: 自定义配置 ===');
function example4() {
  // 创建自定义提取器
  class CustomExtractor extends ChineseTextExtractor {
    // 重写过滤方法，添加自定义日志函数
    protected isLogFunction(name: string): boolean {
      const customLogFunctions = [
        'log', 'error', 'debug', 'info', 'warn', 'console',
        'pintLog', 'receiveFightLog', 'sendFightLog', 'assert', 'alert',
        // 添加自定义函数
        'myLog', 'gameLog', 'systemLog'
      ];
      return customLogFunctions.includes(name);
    }
    
    // 重写tooltip键名检查
    protected isTooltipKey(keyName: string): boolean {
      const tooltipKeys = [
        'tooltip', 'displayName', 'description', 'placeholder',
        // 添加自定义键名
        'hint', 'label', 'title', 'note'
      ];
      return tooltipKeys.includes(keyName);
    }
  }
  
  const customExtractor = new CustomExtractor('./output', 'custom_chinese.txt');
  customExtractor.extractChineseFromFolder('./src');
}

// 示例5: 批量处理项目
console.log('=== 示例5: 批量处理项目 ===');
function example5() {
  const projects = [
    { name: 'project1', path: './project1/src' },
    { name: 'project2', path: './project2/scripts' },
    { name: 'project3', path: './project3/assets' }
  ];
  
  projects.forEach(project => {
    if (require('fs').existsSync(project.path)) {
      console.log(`处理项目: ${project.name}`);
      extractChineseText(project.path, './output', `${project.name}_chinese.txt`);
    } else {
      console.log(`项目路径不存在: ${project.path}`);
    }
  });
}

// 示例6: 结果分析
console.log('=== 示例6: 结果分析 ===');
function example6() {
  const extractor = new ChineseTextExtractor('./output', 'analysis_chinese.txt');
  extractor.extractChineseFromFolder('./src');
  
  const results = extractor.getChineseStrings();
  
  console.log('\n📊 统计分析:');
  console.log(`总字符串数: ${results.length}`);
  
  // 按长度分类
  const short = results.filter(str => str.length <= 5);
  const medium = results.filter(str => str.length > 5 && str.length <= 15);
  const long = results.filter(str => str.length > 15);
  
  console.log(`短字符串 (≤5字): ${short.length} 个`);
  console.log(`中等字符串 (6-15字): ${medium.length} 个`);
  console.log(`长字符串 (>15字): ${long.length} 个`);
  
  // 显示最长的字符串
  const longest = results.reduce((a, b) => a.length > b.length ? a : b, '');
  console.log(`最长字符串: "${longest}" (${longest.length}字)`);
  
  // 显示最短的字符串
  const shortest = results.reduce((a, b) => a.length < b.length ? a : b, results[0] || '');
  console.log(`最短字符串: "${shortest}" (${shortest.length}字)`);
}

// 运行示例
function runExamples() {
  console.log('🚀 开始运行示例...\n');
  
  try {
    // 运行所有示例
    example1();
    example2();
    example3();
    example4();
    example5();
    example6();
    
    console.log('\n✅ 所有示例运行完成！');
    console.log('📁 查看 ./output 文件夹获取结果文件');
    
  } catch (error) {
    console.error('❌ 运行示例时出错:', error);
  }
}

// 如果直接运行此文件，执行示例
if (require.main === module) {
  runExamples();
}

export {
  example1, example2, example3, example4, example5, example6,
  runExamples
}; 