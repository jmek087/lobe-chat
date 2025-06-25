import { Button, Select, TextArea } from '@lobehub/ui';
import { Radio } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { GPTImageItem } from '@/types/tool/gptImage';

interface EditModeProps extends GPTImageItem {
  setEdit: (edit: boolean) => void;
}

const EditMode = memo<EditModeProps>(({ prompt, setEdit, size, quality }) => {
  const { t } = useTranslation('tool');

  return (
    <Flexbox gap={16}>
      <TextArea style={{ minHeight: 120 }} value={prompt} variant={'filled'} />
      <Flexbox horizontal justify={'space-between'}>
        质量
        <Radio.Group
          defaultValue={quality}
          options={[
            { label: 'high', value: 'high' },
            { label: 'medium', value: 'medium' },
            { label: 'low', value: 'low' },
          ]}
        />
      </Flexbox>
      <Flexbox horizontal justify={'space-between'}>
        尺寸
        <Select
          defaultValue={size}
          options={[
            { label: '1024x1024', value: '1024x1024' },
            { label: '1024x1536', value: '1024x1536' },
            { label: '1536x1024', value: '1536x1024' },
            { label: 'auto', value: 'auto' },
          ]}
          size={'small'}
        />
      </Flexbox>

      <Flexbox direction={'horizontal-reverse'} gap={12}>
        <Button type={'primary'}>{t('gptImage.generate')}</Button>
        <Button
          onClick={() => {
            setEdit(false);
          }}
        >
          {t('cancel', { ns: 'common' })}
        </Button>
      </Flexbox>
    </Flexbox>
  );
});

export default EditMode;
