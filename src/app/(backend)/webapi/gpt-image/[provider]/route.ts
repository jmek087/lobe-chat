import { NextResponse } from 'next/server';

import { checkAuth } from '@/app/(backend)/middleware/auth';
import { ChatCompletionErrorPayload } from '@/libs/model-runtime';
import { TextToGptImagePayload } from '@/libs/model-runtime/types';
import { initAgentRuntimeWithUserPayload } from '@/server/modules/AgentRuntime';
import { ChatErrorType } from '@/types/fetch';
import { createErrorResponse } from '@/utils/errorResponse';

export const runtime = 'edge';

export const preferredRegion = [
  'arn1',
  'bom1',
  'cdg1',
  'cle1',
  'cpt1',
  'dub1',
  'fra1',
  'gru1',
  'hnd1',
  'iad1',
  'icn1',
  'kix1',
  'lhr1',
  'pdx1',
  'sfo1',
  'sin1',
  'syd1',
];

/**
 * GPT-Image 路由
 * 专门处理基于GPT-Image模型的图像生成请求
 */
export const POST = checkAuth(async (req: Request, { params, jwtPayload }) => {
  const { provider } = await params;

  try {
    // ============  1. init chat model   ============ //
    const agentRuntime = await initAgentRuntimeWithUserPayload(provider, jwtPayload);

    // ============  2. create chat completion   ============ //
    const data = (await req.json()) as TextToGptImagePayload;

    const images = await agentRuntime.textToGptImage(data);

    return NextResponse.json(images);
  } catch (e) {
    const {
      errorType = ChatErrorType.InternalServerError,
      error: errorContent,
      ...res
    } = e as ChatCompletionErrorPayload;

    const error = errorContent || e;
    // track the error at server side
    console.error(`Route: [${provider}] ${errorType}:`, error);

    return createErrorResponse(errorType, { error, ...res, provider });
  }
});
