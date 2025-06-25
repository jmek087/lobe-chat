import { ChatStoreState } from '@/store/chat';

const isDallEImageGenerating = (id: string) => (s: ChatStoreState) => s.dalleImageLoading[id];

const isGeneratingDallEImage = (s: ChatStoreState) =>
  Object.values(s.dalleImageLoading).some(Boolean);

const isGptImageGenerating = (id: string) => (s: ChatStoreState) => s.gptImageLoading[id];

const isGeneratingGptImage = (s: ChatStoreState) => Object.values(s.gptImageLoading).some(Boolean);

const isSearXNGSearching = (id: string) => (s: ChatStoreState) => s.searchLoading[id];
const isSearchingLocalFiles = (id: string) => (s: ChatStoreState) => s.localFileLoading[id];

export const chatToolSelectors = {
  isDallEImageGenerating,
  isGeneratingDallEImage,
  isGeneratingGptImage,
  isGptImageGenerating,
  isSearXNGSearching,
  isSearchingLocalFiles,
};
