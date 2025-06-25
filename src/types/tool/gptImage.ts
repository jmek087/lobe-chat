export type GPTImageQuality = 'high' | 'medium' | 'low';
export type GPTImageSize = '1024x1024' | '1024x1536' | '1536x1024' | 'auto';

export interface GPTImageItem {
  imageId?: string;
  images?: string[];
  mask?: string;
  previewUrl?: string;
  prompt: string;
  quality: GPTImageQuality;
  size: GPTImageSize;
}
