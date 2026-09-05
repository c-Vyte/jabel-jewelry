import { useState, useEffect, useRef } from 'react';
import { Camera, Cloud, Upload as UploadIcon, X, CheckCircle } from 'lucide-react';

interface CloudinaryUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
  maxWidth?: number;
  maxHeight?: number;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '';

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CloudinaryUpload({
  value,
  onChange,
  onRemove,
  folder = 'jabel-products',
  className = '',
  maxWidth = 1200,
  maxHeight = 1200
}: CloudinaryUploadProps) {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = () => {
        setIsWidgetLoaded(true);
      };
      document.head.appendChild(script);
    } else if (window.cloudinary) {
      setIsWidgetLoaded(true);
    }
  }, []);

  const openWidget = () => {
    if (!window.cloudinary || !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert('Cloudinary not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env');
      return;
    }

    setIsUploading(true);
    
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        folder: folder,
        sources: ['local', 'url', 'camera'],
        maxFiles: 1,
        maxFileSize: 10000000,
        imagePreview: true,
        showAdvancedOptions: false,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#E5E7EB',
            tabIcon: '#000000',
            menuIcons: '#6B7280',
            textDark: '#111827',
            textLight: '#FFFFFF',
            link: '#000000',
            action: '#000000',
            inactiveTabIcon: '#9CA3AF',
            error: '#EF4444',
            inProgress: '#000000',
            complete: '#10B981',
            sourceBg: '#F9FAFB'
          }
        },
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [
          { width: maxWidth, height: maxHeight, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
        ]
      },
      (error: any, result: any) => {
        setIsUploading(false);
        if (!error && result && result.event === 'success') {
          const url = result.info.secure_url;
          onChange(url);
        } else if (error) {
          console.error('Cloudinary upload error:', error);
          alert('Upload failed. Please try again.');
        }
      }
    );
    
    widgetRef.current.open();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      // Fallback to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setIsUploading(false);
        if (data.secure_url) {
          onChange(data.secure_url);
        } else {
          throw new Error(data.error?.message || 'Upload failed');
        }
      })
      .catch(err => {
        setIsUploading(false);
        console.error('Upload error:', err);
        alert('Upload failed. Please try again.');
      });
  };

  return (
    <div className={className}>
      {value && (
        <div className="relative group mb-4">
          <div className="aspect-[4/5] bg-theme-border/30 border border-theme-border/50 overflow-hidden">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={openWidget}
              className="p-2 bg-theme-surface/90 backdrop-blur-sm border border-theme-border rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-surface transition-colors"
              title="Replace Image"
              disabled={isUploading}
            >
              {isUploading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-2 bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-theme-border p-6 bg-theme-bg cursor-pointer hover:bg-theme-border/30 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center gap-2 text-center">
          {isUploading ? (
            <>
              <svg className="w-8 h-8 animate-spin text-theme-accent" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-medium text-theme-text">Uploading...</span>
            </>
          ) : (
            <>
              <Cloud className="w-8 h-8 text-theme-muted" />
              <span className="text-sm font-medium text-theme-text">Upload to Cloudinary</span>
              <span className="text-xs text-theme-muted">Auto-optimized, WebP/AVIF, CDN delivery</span>
            </>
          )}
        </div>
      </label>

      {!isWidgetLoaded && !CLOUDINARY_CLOUD_NAME && (
        <p className="text-xs text-theme-muted mt-2 text-center">
          Configure Cloudinary in .env for auto-optimization: VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
        </p>
      )}
    </div>
  );
}