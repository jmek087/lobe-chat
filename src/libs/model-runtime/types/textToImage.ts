import { DallEImageQuality, DallEImageSize, DallEImageStyle } from '@/types/tool/dalle';
import { GPTImageQuality, GPTImageSize } from '@/types/tool/gptImage';

export interface TextToImagePayload {
  model: string;
  /**
   * The number of images to generate. Must be between 1 and 10.
   */
  n?: number;
  /**
   * A text description of the desired image(s).
   * The maximum length is 1000 characters.
   */
  prompt: string;
  /**
   * The quality of the image that will be generated.
   * hd creates images with finer details and greater consistency across the image.
   * This param is only supported for dall-e-3.
   */
  quality?: DallEImageQuality;
  /**
   * The size of the generated images.
   * Must be one of '1792x1024' , '1024x1024' , '1024x1792'
   */
  size?: DallEImageSize;

  /**
   * The style of the generated images. Must be one of vivid or natural.
   * Vivid causes the model to lean towards generating hyper-real and dramatic images.
   * Natural causes the model to produce more natural, less hyper-real looking images.
   * This param is only supported for dall-e-3.
   * @default vivid
   */
  style?: DallEImageStyle;
}

// 纯文本到图像专属接口
export interface TextToGptImagePayload {
  model: string;
  /**
   * 要生成的图像数量，必须在1到10之间
   */
  n?: number;
  /**
   * 所需图像的文本描述
   * 最大长度为1000个字符
   */
  prompt: string;
  /**
   * 将生成的图像的质量
   * high: 最佳质量，使用更多令牌
   * medium: 平衡质量和令牌使用
   * low: 最快生成，较少令牌
   */
  quality?: GPTImageQuality;
  /**
   * 生成图像的尺寸
   */
  size?: GPTImageSize;
}

// 图像到图像专属接口
export interface Image2ImagePayload {
  model: string;
  /**
   * 要生成的图像数量，必须在1到10之间
   */
  n?: number;
  /**
   * 图像到图像生成的图像URL列表
   */
  // images: string[];
  /**
   * 所需图像的文本描述
   * 最大长度为1000个字符
   */
  prompt: string;
  /**
   * 将生成的图像的质量
   */
  quality?: GPTImageQuality;
  /**
   * 生成图像的尺寸
   */
  size?: GPTImageSize;
}
