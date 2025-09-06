export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string; // R2文件的公共访问URL
  uploadTime: Date;
  progress?: number;
  key?: string; // R2中的文件key
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

export interface SignedUrlResponse {
  signedUrl: string;
  publicUrl: string;
}

export interface R2File {
  Key: string;
  Size: number;
  LastModified: string;
}
