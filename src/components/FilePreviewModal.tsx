'use client';

import { useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { FileItem } from '@/types';

interface FilePreviewModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
}

export default function FilePreviewModal({ file, isOpen, onClose, onDownload }: FilePreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !file) return null;


  const renderPreviewContent = () => {
    const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) return '🖼️';
      if (type.startsWith('video/')) return '🎥';
      if (type.startsWith('audio/')) return '🎵';
      if (type.includes('pdf')) return '📄';
      if (type.includes('zip') || type.includes('rar')) return '📦';
      if (type.includes('text') || type.includes('code')) return '📝';
      return '📄';
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // 使用 R2 URL 进行预览
    if (file.url) {
      if (file.type.startsWith('image/')) {
        return (
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-lg"
            onError={(e) => {
              // 如果图片加载失败，显示错误信息
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      }

      if (file.type.startsWith('video/')) {
        return (
          <video
            src={file.url}
            controls
            className="max-w-full max-h-96 rounded-lg"
          >
            您的浏览器不支持视频播放
          </video>
        );
      }

      if (file.type.includes('pdf')) {
        return (
          <iframe
            src={file.url}
            className="w-full h-96 rounded-lg"
            title={file.name}
          />
        );
      }
    }

    // 如果无法预览，显示文件信息
    return (
      <div className="text-center py-12">
        <div className="text-8xl mb-6">{getFileIcon(file.type)}</div>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">文件信息</h3>
            
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">文件名:</span>
                <span className="text-white font-medium">{file.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">文件类型:</span>
                <span className="text-white">{file.type || '未知类型'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">文件大小:</span>
                <span className="text-white">{formatFileSize(file.size)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">上传时间:</span>
                <span className="text-white">{file.uploadTime.toLocaleString('zh-CN')}</span>
              </div>
            </div>
          </div>
          
          <div className="text-gray-400 text-sm">
            <p>💡 支持图片文件的实时预览</p>
            <p>📥 其他文件类型请下载后查看</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white truncate">{file.name}</h2>
            <p className="text-gray-400 text-sm">
              {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDownload(file)}
              className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
              title="下载"
            >
              <Download className="w-5 h-5" />
            </button>
            
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-400/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="flex justify-center">
            {renderPreviewContent()}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/50">
          <div className="text-sm text-gray-400 text-center">
            上传时间: {file.uploadTime.toLocaleString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  );
}
