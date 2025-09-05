export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadTime: Date;
  progress?: number;
  content?: ArrayBuffer; // 文件内容
}

export interface UploadState {
  files: FileItem[];
  isUploading: boolean;
  selectedFile: FileItem | null;
}

export interface ShareState {
  shareUrl: string;
  isSharing: boolean;
  qrCodeVisible: boolean;
}

