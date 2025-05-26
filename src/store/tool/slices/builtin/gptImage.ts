import { StateCreator } from 'zustand/vanilla';

import { GPTImagePayload } from '@/types/openai/gptImage';
import { GPTImageItem } from '@/types/tool/gptImage';
import { setNamespace } from '@/utils/storeDebug';

import { ToolStore } from '../../store';

const n = setNamespace('gptImageTool');

interface Text2GptImageParams extends Pick<GPTImagePayload, 'quality' | 'size'> {
  prompts: string[];
}

/**
 * GPT Image 代理行为接口
 */
export interface GptImageToolAction {
  text2gptimage: (params: Text2GptImageParams) => GPTImageItem[];
  toggleGptImageToolLoading: (key: string, value: boolean) => void;
  transformGptImageApiArgumentsToAiState: (key: string, params: any) => Promise<string | undefined>;
}

export const createGptImageToolSlice: StateCreator<
  ToolStore,
  [['zustand/devtools', never]],
  [],
  GptImageToolAction
> = (set, get) => ({
  text2gptimage: ({ prompts, size = '1024x1024' as const, quality = 'low' }) =>
    prompts.map((p) => ({ prompt: p, quality, size })),

  toggleGptImageToolLoading: (key, value) => {
    set(
      (state) => ({
        gptImageToolLoading: { ...state.gptImageToolLoading, [key]: value },
      }),
      false,
      n('toggleGptImageToolLoading'),
    );
  },

  transformGptImageApiArgumentsToAiState: async (key, params) => {
    const state = get();
    const gptImageToolLoading = state.gptImageToolLoading || {};
    const { toggleGptImageToolLoading } = state;

    if (gptImageToolLoading[key]) return;

    const { [key as keyof GptImageToolAction]: action } = state;

    if (!action) return JSON.stringify(params);

    toggleGptImageToolLoading(key, true);

    try {
      // @ts-ignore
      const result = await action(params);

      toggleGptImageToolLoading(key, false);

      return JSON.stringify(result);
    } catch (e) {
      toggleGptImageToolLoading(key, false);
      throw e;
    }
  },
});
