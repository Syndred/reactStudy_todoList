'use client';

import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Share2, X, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  shareUrl: string;
}

export default function ShareButton({ shareUrl }: ShareButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors glow-animation"
      >
        <Share2 className="w-4 h-4" />
        <span>分享</span>
      </button>

      {isVisible && (
        <div
          ref={popoverRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 p-6 min-w-80 max-w-90vw max-h-90vh overflow-auto"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">分享文件</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-4">
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode
                value={shareUrl}
                size={180}
                level="H"
                includeMargin
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2 text-center">
              使用手机扫描二维码访问分享页面
            </p>
            <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-3">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-white text-sm outline-none truncate"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded"
                title="复制链接"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>📱 确保设备在同一局域网内</p>
            <p>🔄 支持手机和电脑互相传输文件</p>
            <p>🌐 复制链接分享给其他用户</p>
          </div>
        </div>
      )}
    </div>
  );
}