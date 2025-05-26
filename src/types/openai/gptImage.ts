import { GPTImageQuality, GPTImageSize } from '@/types/tool/gptImage';

export interface GPTImagePayload {
  /**
   * List of image URLs for image-to-image generation or editing.
   */
  // images?: string[];
  /**
   * Image mask for inpainting. Base64 encoded image.
   */
  mask?: string;
  model: 'gpt-image-1';
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
   * high: best quality, more tokens used
   * medium: balanced quality and token usage
   * low: fastest generation, fewer tokens
   */
  quality?: GPTImageQuality;
  /**
   * The size of the generated images.
   * Options: '1024x1024', '1024x1536', '1536x1024', 'auto'
   */
  size?: GPTImageSize;
}

/**
 * API response structure for image generation
 */
export interface GPTImageResponse {
  created: number; // Unix timestamp
  data: {
    /**
     * Base64 encoded image if response_format is b64_json
     */
    b64_json?: string;
    /**
     * Revised prompt used for generation
     */
    revised_prompt?: string;
    /**
     * Image URL if response_format is url
     */
    url?: string;
  }[];
  usage?: {
    /**
     * Number of tokens used for input
     */
    input_tokens: number;
    /**
     * Detailed breakdown of input tokens
     */
    input_tokens_details: {
      /**
       * Tokens used for processing input images
       */
      image_tokens: number;
      /**
       * Tokens used for processing input text
       */
      text_tokens: number;
    };
    /**
     * Number of tokens used for output
     */
    output_tokens: number;
    /**
     * Total number of tokens used
     */
    total_tokens: number;
  };
}
