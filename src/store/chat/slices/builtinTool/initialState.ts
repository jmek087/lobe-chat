import { FileItem } from '@/types/files';

export interface ChatToolState {
  activePageContentUrl?: string;
  dalleImageLoading: Record<string, boolean>;
  dalleImageMap: Record<string, FileItem>;
  gptImageLoading: Record<string, boolean>;
  gptImageMap: Record<string, FileItem>;
  localFileLoading: Record<string, boolean>;
  searchLoading: Record<string, boolean>;
}

export const initialToolState: ChatToolState = {
  dalleImageLoading: {},
  dalleImageMap: {},
  gptImageLoading: {},
  gptImageMap: {},
  localFileLoading: {},
  searchLoading: {},
};
