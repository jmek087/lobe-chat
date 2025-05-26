import { builtinTools } from '@/tools';
import { LobeBuiltinTool } from '@/types/tool';

export interface BuiltinToolState {
  builtinToolLoading: Record<string, boolean>;
  builtinTools: LobeBuiltinTool[];
  gptImageToolLoading: Record<string, boolean>;
}

export const initialBuiltinToolState: BuiltinToolState = {
  builtinToolLoading: {},
  builtinTools,
  gptImageToolLoading: {},
};
