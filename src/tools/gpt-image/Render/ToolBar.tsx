import { Button } from '@lobehub/ui';
import { Checkbox } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { chatToolSelectors } from '@/store/chat/selectors';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { GPTImageItem } from '@/types/tool/gptImage';

interface ToolBarProps {
  content: GPTImageItem[];
  messageId: string;
}

const ToolBar = memo<ToolBarProps>(({ content, messageId }) => {
  const { t } = useTranslation('tool');
  const generateGptImageFromPrompts = useChatStore((s) => s.generateGptImageFromPrompts);
  const isLoading = useChatStore(chatToolSelectors.isGeneratingGptImage);

  const [isAutoGenerate, setSettings] = useUserStore((s) => [
    settingsSelectors.isDalleAutoGenerating(s),
    s.setSettings,
  ]);

  const genImages = () => {
    generateGptImageFromPrompts(content, messageId);
  };

  const canGen = content.some((i) => !i.imageId);

  return (
    <Flexbox align={'center'} height={28} horizontal justify={'space-between'}>
      {t('gptImage.images')}
      <Flexbox align={'center'} gap={8} horizontal>
        <Checkbox
          checked={isAutoGenerate}
          onChange={(e) => {
            setSettings({ tool: { dalle: { autoGenerate: e.target.checked } } });
          }}
        >
          {t('gptImage.autoGenerate')}
        </Checkbox>
        {canGen && (
          <Button loading={isLoading} onClick={genImages} size={'small'} type={'primary'}>
            {t('gptImage.generate')}
          </Button>
        )}
      </Flexbox>
    </Flexbox>
  );
});

export default ToolBar;
