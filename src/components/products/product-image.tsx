'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getMLImageUrl } from '@/lib/api/mercado-livre';
import { getSecureImageUrl } from '@/lib/utils/url-security';
import { Package } from 'lucide-react';

interface ProductImageProps {
  thumbnailId?: string;
  thumbnail?: string;
  secureThumbnail?: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24'
};

export function ProductImage({ 
  thumbnailId, 
  thumbnail, 
  secureThumbnail, 
  title, 
  size = 'md',
  className = '' 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determinar a URL da imagem a ser usada
  const getImageUrl = () => {
    // Prioridade: secureThumbnail > thumbnail processado > thumbnailId processado
    if (secureThumbnail) {
      return getSecureImageUrl(secureThumbnail);
    }
    
    if (thumbnail) {
      return getSecureImageUrl(thumbnail);
    }
    
    if (thumbnailId) {
      return getMLImageUrl(thumbnailId, 'O'); // 'O' para tamanho original
    }
    
    return null;
  };

  const imageUrl = getImageUrl();

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.warn('Erro ao carregar imagem do produto:', {
      thumbnailId,
      thumbnail,
      secureThumbnail,
      imageUrl,
      title
    });
    setImageError(true);
    setIsLoading(false);
  };

  if (imageError || !imageUrl) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted rounded-lg flex items-center justify-center`}>
        <Package className="h-1/2 w-1/2 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative bg-muted rounded-lg overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
        sizes={size === 'sm' ? '48px' : size === 'md' ? '64px' : '96px'}
      />
    </div>
  );
}