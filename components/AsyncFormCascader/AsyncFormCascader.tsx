import { I18n } from '@ies/starling_intl';
import React, {
  type FC,
  type ComponentProps,
  useState,
  useEffect,
} from 'react';
import { FormCascader, Loading } from 'Component';
import type { CascaderData } from '@douyinfe/semi-ui/lib/es/cascader';
import type { Form } from '@douyinfe/semi-ui';

export type AsyncFormCascaderProps = ComponentProps<typeof Form.Cascader> & {
  fetchData: () => Promise<CascaderData[]>;
};

const AsyncFormCascader: FC<AsyncFormCascaderProps> = (props) => {
  const { fetchData, ...rest } = props;
  const [options, setOptions] = useState<CascaderData[]>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setOptions(undefined);
    fetchData()
      .then(setOptions)
      .finally(() => {
        setLoading(false);
      });
  }, [fetchData]);

  return (
    <FormCascader
      {...rest}
      emptyContent={
        loading ? (
          <Loading style={{ width: 80 }} tip="" />
        ) : (
          <div>
            {I18n.t(
              'Meego_Shared_GitlabAssociationGuide_NoDataYet',
              {},
              '暂无数据',
            )}
          </div>
        )
      }
      placeholder={I18n.t(
        'Meego_Shared_GitlabAssociationGuide_PleaseSelectAWorkItemOrATemplate_PlaceHolder',
        {},
        '请选择工作项或模版',
      )}
      treeData={options}
    />
  );
};

export default AsyncFormCascader;
