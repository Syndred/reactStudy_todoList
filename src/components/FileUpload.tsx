'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FolderOpen, File } from 'lucide-react';
import { FileItem } from '@/types';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFilesSelected, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDragActive(false);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
  });

  const handleFolderClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      onFilesSelected(files);
    };
    input.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive || dragActive 
            ? 'border-blue-400 bg-blue-50/10 scale-105' 
            : 'border-gray-600 hover:border-gray-400 bg-gray-800/30'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onMouseEnter={() => setDragActive(true)}
        onMouseLeave={() => setDragActive(false)}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Upload className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              拖放文件到此处或点击上传
            </h3>
            <p className="text-gray-400 text-sm">
              支持单个文件、多个文件或整个文件夹
            </p>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = Array.from((e.target as HTMLInputElement).files || []);
                  onFilesSelected(files);
                };
                input.click();
              }}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <File className="w-4 h-4" />
              <span>选择文件</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFolderClick();
              }}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span>选择文件夹</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}