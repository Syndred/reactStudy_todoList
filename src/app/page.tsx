'use client';

import { useState, useCallback } from 'react';
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';
import ShareButton from '@/components/ShareButton';
import FilePreviewModal from '@/components/FilePreviewModal';
import { FileItem, UploadState, ShareState } from '@/types';

export default function Home() {
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isUploading: false,
    selectedFile: null,
  });

  const [shareState, setShareState] = useState<ShareState>({
    shareUrl: typeof window !== 'undefined' ? window.location.href : '',
    isSharing: false,
    qrCodeVisible: false,
  });

  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setUploadState(prev => ({ ...prev, isUploading: true }));

    for (const file of files) {
      // 读取文件内容
      const fileContent = await readFileAsArrayBuffer(file);
      
      const fileItem: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadTime: new Date(),
        progress: 0,
        content: fileContent // 存储文件内容
      };

      // 首先添加文件到列表
      setUploadState(prev => ({
        ...prev,
        files: [...prev.files, fileItem]
      }));

      // 模拟上传进度
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadState(prev => ({
          ...prev,
          files: prev.files.map(f =>
            f.id === fileItem.id ? { ...f, progress } : f
          )
        }));
      }

      // 上传完成
      setUploadState(prev => ({
        ...prev,
        files: prev.files.map(f =>
          f.id === fileItem.id ? { ...f, progress: 100 } : f
        )
      }));
    }

    setUploadState(prev => ({ ...prev, isUploading: false }));
  }, []);

  // 读取文件为ArrayBuffer
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleDeleteFile = useCallback((fileId: string) => {
    setUploadState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  }, []);

  const handleDownloadFile = useCallback(async (file: FileItem) => {
    try {
      if (file.content) {
        // 使用实际的文件内容创建Blob
        const blob = new Blob([file.content], { type: file.type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // 如果没有文件内容，创建一个包含文件信息的文本文件
        const fileInfo = `文件名: ${file.name}\n文件大小: ${file.size} bytes\n文件类型: ${file.type}\n上传时间: ${file.uploadTime.toLocaleString()}`;
        
        const blob = new Blob([fileInfo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('下载文件失败:', error);
      alert('下载文件失败，请重试');
    }
  }, []);

  const handlePreviewFile = useCallback((file: FileItem) => {
    setPreviewFile(file);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewFile(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 select-none">
            FileShare
          </h1>
          <p className="text-gray-400 text-lg">
            多端文件传输助手 - 纯前端解决方案
          </p>
        </div>

        {/* 上传区域 */}
        <div className="mb-8">
          <FileUpload 
            onFilesSelected={handleFilesSelected}
            isUploading={uploadState.isUploading}
          />
        </div>

        {/* 文件列表和分享按钮 */}
        <div className="flex flex-col items-center space-y-6">
          <FileList
            files={uploadState.files}
            onDelete={handleDeleteFile}
            onDownload={handleDownloadFile}
            onPreview={handlePreviewFile}
          />
          
          {uploadState.files.length > 0 && (
            <ShareButton shareUrl={shareState.shareUrl} />
          )}
        </div>

        {/* 状态提示 */}
        {uploadState.isUploading && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            正在上传文件...
          </div>
        )}

        {/* 文件预览模态框 */}
        <FilePreviewModal
          file={previewFile}
          isOpen={!!previewFile}
          onClose={handleClosePreview}
          onDownload={handleDownloadFile}
        />

        {/* 使用说明 */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>💡 使用说明：</p>
          <p>1. 上传文件或文件夹到本地列表</p>
          <p>2. 点击分享按钮生成二维码</p>
          <p>3. 使用手机扫描二维码访问当前页面</p>
          <p>4. 每个设备独立管理自己的文件列表</p>
          <p>5. 支持图片预览和文件下载功能</p>
        </div>
      </div>
    </div>
  );
}
