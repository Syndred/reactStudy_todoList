'use client';

import { useState, useCallback, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';
import ShareButton from '@/components/ShareButton';
import FilePreviewModal from '@/components/FilePreviewModal';
import { FileItem, UploadState, ShareState, SignedUrlResponse, R2File } from '@/types';

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

  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/r2-list');
      if (!response.ok) {
        throw new Error('Failed to fetch files from R2');
      }
      const { files: r2Files }: { files: R2File[] } = await response.json();

      const fetchedFileItems: FileItem[] = r2Files.map(r2File => ({
        id: r2File.Key, // Use Key as ID
        name: r2File.Key.split('/').pop() || r2File.Key, // Extract file name
        size: r2File.Size,
        type: 'application/octet-stream', // Default type, can be improved
        url: `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${r2File.Key}`,
        uploadTime: new Date(r2File.LastModified),
        progress: 100,
        key: r2File.Key,
      }));
      setUploadState(prev => ({ ...prev, files: fetchedFileItems }));
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('获取文件列表失败，请检查控制台');
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setUploadState(prev => ({ ...prev, isUploading: true }));

    for (const file of files) {
      const fileKey = `${Date.now()}-${file.name}`; // Unique key for R2

      // Get signed URL from API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileKey);

      const uploadResponse = await fetch('/api/r2-upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.error('Failed to upload file:', await uploadResponse.text());
        alert('文件上传失败');
        setUploadState(prev => ({ ...prev, isUploading: false }));
        return;
      }

      const { publicUrl, fileName: uploadedFileName, size, type }: { publicUrl: string, fileName: string, size: number, type: string } = await uploadResponse.json();

      const fileItem: FileItem = {
        id: uploadedFileName,
        name: file.name,
        size: size,
        type: type,
        uploadTime: new Date(),
        progress: 0,
        url: publicUrl,
        key: uploadedFileName,
      };

      setUploadState(prev => ({
        ...prev,
        files: [...prev.files, fileItem]
      }));

      try {
        // Simulate progress (optional, R2 upload is fast)
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadState(prev => ({
            ...prev,
            files: prev.files.map(f =>
              f.id === fileItem.id ? { ...f, progress } : f
            )
          }));
        }

        // Simulate progress (optional, R2 upload is fast)
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadState(prev => ({
            ...prev,
            files: prev.files.map(f =>
              f.id === fileItem.id ? { ...f, progress } : f
            )
          }));
        }

        setUploadState(prev => ({
          ...prev,
          files: prev.files.map(f =>
            f.id === fileItem.id ? { ...f, progress: 100 } : f
          )
        }));
        fetchFiles(); // Refresh file list after successful upload
      } catch (uploadError) {
        console.error('Error uploading file to R2:', uploadError);
        alert('文件上传失败');
        setUploadState(prev => ({
          ...prev,
          files: prev.files.filter(f => f.id !== fileItem.id), // Remove failed upload
        }));
      }
    }

    setUploadState(prev => ({ ...prev, isUploading: false }));
  }, [fetchFiles]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
    const fileToDelete = uploadState.files.find(f => f.id === fileId);
    if (!fileToDelete || !fileToDelete.key) {
      alert('文件信息不完整，无法删除');
      return;
    }

    try {
      const response = await fetch('/api/r2-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: fileToDelete.key }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file from R2');
      }

      setUploadState(prev => ({
        ...prev,
        files: prev.files.filter(f => f.id !== fileId)
      }));
      alert('文件删除成功');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('删除文件失败，请重试');
    }
  }, [uploadState.files]);

  const handleDownloadFile = useCallback(async (file: FileItem) => {
    if (!file.url) {
      alert('文件URL不存在，无法下载');
      return;
    }
    try {
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
