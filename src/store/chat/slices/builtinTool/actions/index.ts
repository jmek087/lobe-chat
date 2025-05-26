import { StateCreator } from 'zustand/vanilla';

import { ChatStore } from '@/store/chat/store';

import { ChatDallEAction, dalleSlice } from './dalle';
import { ChatGptImageAction, gptImageSlice } from './gptImage';
import { LocalFileAction, localFileSlice } from './localFile';
import { SearchAction, searchSlice } from './search';

export interface ChatBuiltinToolAction
  extends ChatDallEAction,
    ChatGptImageAction,
    SearchAction,
    LocalFileAction {}

export const chatToolSlice: StateCreator<
  ChatStore,
  [['zustand/devtools', never]],
  [],
  ChatBuiltinToolAction
> = (...params) => ({
  ...dalleSlice(...params),
  ...gptImageSlice(...params),
  ...searchSlice(...params),
  ...localFileSlice(...params),
});
