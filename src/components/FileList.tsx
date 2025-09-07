'use client';

import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { FileItem } from '@/types';

interface FileListProps {
  files: FileItem[];
  onDelete: (fileId: string) => void;
  onDownload: (file: FileItem) => void;
  onPreview: (file: FileItem) => void;
}

export default function FileList({ files, onDelete, onDownload, onPreview }: FileListProps) {

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('text') || type.includes('code')) return '📝';
    return '📄';
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>暂无文件，请上传文件开始分享</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">文件列表</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="text-2xl">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{file.name}</div>
                  <div className="text-gray-400 text-sm">
                    {formatFileSize(file.size)} • {formatTime(file.uploadTime)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {file.progress != null && file.progress < 100 ? (
                  <div className="w-20 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                ) : (
                  <>
                    {file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.includes('pdf') ? (
                      <button
                        onClick={() => onPreview(file)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="预览"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : null}
                    <button
                      onClick={() => onDownload(file)}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                      title="下载"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(file.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
