import { produce } from 'immer';
import pMap from 'p-map';
import { SWRResponse } from 'swr';
import { StateCreator } from 'zustand/vanilla';

import { useClientDataSWR } from '@/libs/swr';
import { fileService } from '@/services/file';
import { imageGenerationService } from '@/services/textToImage';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatStore } from '@/store/chat/store';
import { useFileStore } from '@/store/file';
import { GPTImageItem } from '@/types/tool/gptImage';
import { setNamespace } from '@/utils/storeDebug';

const n = setNamespace('tool');

const SWR_FETCH_KEY = 'FetchImageItem';

export interface ChatGptImageAction {
  generateGptImageFromPrompts: (items: GPTImageItem[], id: string) => Promise<void>;
  text2gptimage: (id: string, data: GPTImageItem[]) => Promise<void>;
  toggleGptImageLoading: (key: string, value: boolean) => void;
  updateGptImageItem: (id: string, updater: (data: GPTImageItem[]) => void) => Promise<void>;
  useFetchGptImageItem: (id: string) => SWRResponse;
}

export const gptImageSlice: StateCreator<
  ChatStore,
  [['zustand/devtools', never]],
  [],
  ChatGptImageAction
> = (set, get) => ({
  generateGptImageFromPrompts: async (items, messageId) => {
    const { toggleGptImageLoading, updateGptImageItem } = get();
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const getMessageById = (id: string) => chatSelectors.getMessageById(id)(get());

    const message = getMessageById(messageId);
    if (!message) return;

    let errorArray: any[] = [];

    await pMap(items, async (params, index) => {
      toggleGptImageLoading(messageId + params.prompt, true);

      let url = '';
      try {
        url = await imageGenerationService.generateGptImage(params);
      } catch (e) {
        toggleGptImageLoading(messageId + params.prompt, false);
        errorArray[index] = e;

        await get().updatePluginState(messageId, { error: errorArray });
      }

      if (!url) return;

      toggleGptImageLoading(messageId + params.prompt, false);

      const data = await useFileStore.getState().uploadBase64FileWithProgress(url);

      if (!data) return;

      await updateGptImageItem(messageId, (draft) => {
        draft[index].imageId = data.id;
      });
    });
  },
  text2gptimage: async (id, data) => {
    // const isAutoGen = settingsSelectors.isDalleAutoGenerating(useGlobalStore.getState());
    // if (!isAutoGen) return;

    await get().generateGptImageFromPrompts(data, id);
  },

  toggleGptImageLoading: (key, value) => {
    set(
      { gptImageLoading: { ...get().gptImageLoading, [key]: value } },
      false,
      n('toggleGptImageLoading'),
    );
  },

  updateGptImageItem: async (id, updater) => {
    const message = chatSelectors.getMessageById(id)(get());
    if (!message) return;

    const data: GPTImageItem[] = JSON.parse(message.content);

    const nextContent = produce(data, updater);
    await get().internal_updateMessageContent(id, JSON.stringify(nextContent));
  },

  useFetchGptImageItem: (id) =>
    useClientDataSWR([SWR_FETCH_KEY, id], async () => {
      const item = await fileService.getFile(id);

      set(
        produce((draft) => {
          if (draft.gptImageMap[id]) return;

          draft.gptImageMap[id] = item;
        }),
        false,
        n('useFetchFile'),
      );

      return item;
    }),
});
