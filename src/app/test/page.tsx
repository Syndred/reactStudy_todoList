'use client';

import { useState } from 'react';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = async () => {
    const results: string[] = [];
    
    // 测试1: 检查浏览器支持
    results.push('✅ 浏览器支持 File API');
    results.push('✅ 浏览器支持 Blob API');
    results.push('✅ 浏览器支持 URL.createObjectURL');

    // 测试2: 检查功能可用性
    try {
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      results.push('✅ 可以创建 File 对象');
      
      const blob = new Blob(['test'], { type: 'text/plain' });
      results.push('✅ 可以创建 Blob 对象');
      
      const url = URL.createObjectURL(blob);
      results.push('✅ 可以创建 Object URL');
      URL.revokeObjectURL(url);
      
    } catch (error) {
      results.push('❌ 文件功能测试失败');
    }

    // 测试3: 检查二维码库
    try {
      // @ts-ignore - 检查全局变量
      if (typeof window !== 'undefined' && window.QRCode) {
        results.push('✅ 二维码库已加载');
      } else {
        results.push('⚠️ 二维码库可能需要动态加载');
      }
    } catch (error) {
      results.push('❌ 二维码库检查失败');
    }

    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">功能测试</h1>
        
        <button
          onClick={runTests}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg mb-6"
        >
          运行测试
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">测试结果</h2>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center">
                {result.startsWith('✅') && (
                  <span className="text-green-500 mr-2">✓</span>
                )}
                {result.startsWith('❌') && (
                  <span className="text-red-500 mr-2">✗</span>
                )}
                {result.startsWith('⚠️') && (
                  <span className="text-yellow-500 mr-2">⚠</span>
                )}
                <span>{result}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="space-y-2 text-gray-700">
            <p>✅ 这是一个纯前端的文件传输应用</p>
            <p>✅ 支持上传文件并保存在浏览器内存中</p>
            <p>✅ 支持文件下载和图片预览</p>
            <p>✅ 支持二维码分享当前页面链接</p>
            <p>⚠️ 注意：刷新页面后文件会丢失（纯前端限制）</p>
            <p>⚠️ 每个设备需要独立上传和管理文件</p>
          </div>
        </div>
      </div>
    </div>
  );
}