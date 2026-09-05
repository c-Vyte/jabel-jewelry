import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

function getCloudinaryOptimizedUrl(
  src: string,
  width: number,
  height: number,
  quality: number,
  format: string
): string {
  if (!isCloudinaryUrl(src) || !CLOUDINARY_CLOUD_NAME) return src;
  
  try {
    const url = new URL(src);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) return src;
    
    const transformations = [
      `w_${width}`,
      `h_${height}`,
      `c_fill`,
      `q_${quality}`,
      `f_${format}`,
      'fl_progressive'
    ].join(',');
    
    pathParts.splice(uploadIndex + 1, 0, transformations);
    url.pathname = pathParts.join('/');
    return url.toString();
  } catch {
    return src;
  }
}

function getBlurDataUrl(src: string, width: number, height: number): string {
  if (!isCloudinaryUrl(src) || !CLOUDINARY_CLOUD_NAME) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23e5e7eb' width='100%25' height='100%25'/%3E%3C/svg%3E`;
  }
  
  try {
    const url = new URL(src);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23e5e7eb' width='100%25' height='100%25'/%3E%3C/svg%3E`;
    }
    
    const transformations = [
      'w_20',
      'h_20',
      'c_fill',
      'q_10',
      'f_auto',
      'fl_progressive'
    ].join(',');
    
    pathParts.splice(uploadIndex + 1, 0, transformations);
    url.pathname = pathParts.join('/');
    return url.toString();
  } catch {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23e5e7eb' width='100%25' height='100%25'/%3E%3C/svg%3E`;
  }
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  priority = false,
  quality = 80,
  format = 'auto'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const optimizedSrc = getCloudinaryOptimizedUrl(src, width, height, quality, format);
  const blurSrc = getBlurDataUrl(src, width, height);

  useEffect(() => {
    if (priority || isInView) return;
    
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.01 }
    );
    
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }
    
    return () => observerRef.current?.disconnect();
  }, [priority]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }} ref={imgRef as any}>
      {!isLoaded && (
        <img
          src={blurSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          } blur-sm`}
          style={{ filter: 'blur(20px) scale(1.1)' }}
        />
      )}
      
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-theme-border/30 border border-theme-border/50">
          <svg className="w-8 h-8 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}