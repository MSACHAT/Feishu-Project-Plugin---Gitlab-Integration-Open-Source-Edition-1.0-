import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getTemplateApi } from '../../api/index';
import { PluginConfig, Utils } from '@bdeefe/meego-plugin-modules';
import { Cascader, withField, Icon, Popover, Select } from '@douyinfe/semi-ui';
import { IconAlertCircle} from '@douyinfe/semi-icons';
import './CustomTopCom.less';
import { sdkManager } from '../../utils';

const { bruteTranslate } = Utils;


let templateList = null;
const templateType:any= '';

const CustomTopCom = props => {
  
  const { data } = props;
  const [errorMap, setErrorMap] = useState<boolean[]>([]);
  const ref = useRef(null);

  const message = useMemo(() => data?.work_item_type?.message || data?.template?.message, [data]);

  useEffect(() => {
    if (data?.template?.type === 'stateflow') {
      PluginConfig.updateConfig('otherToMeego.info.right.text', '到达{{split}}{{status}}');
      // PluginConfig.updateConfig('otherToMeego.info.right.text', '{{split}}完成{{control}}');
    } else {
      PluginConfig.updateConfig('otherToMeego.info.right.text', '{{split}}完成{{control}}');
    }
  }, [data?.template?.type]);

  const customCascader = (
    <CustomCascader
      {...props}
      field="custom_wrokitem_template"
      isError={errorMap[0]}
      invalidMessage={message}
      label={bruteTranslate('工作项类型')}
      rules={[{ required: true }]}
      validate={fieldValue => {
        if (!fieldValue || fieldValue.length < 2) {
          errorMap[0] = true;
          setErrorMap(errorMap);
          return bruteTranslate('工作项类型不可为空');
        } else {
          errorMap[0] = false;
          setErrorMap(errorMap);
          return '';
        }
      }}
    />
  );

  return (
    <div className="gitlab_custom_top" ref={ref}>
      {customCascader}
      <div className="title">{bruteTranslate('GitLab的操作事件与飞书项目工作项节点映射关系如下：')}</div>
    </div>
  );
};

const RenderCascader = async props => {
  const sdk = await sdkManager.getSdkInstance();
  const { value: fieldValue, data: formData, isModify, formRef, fetchDatas, isError, onChange, invalidMessage } = props;

  let value = fieldValue;

  if (!value) {
    if (formData.work_item_type?.key && formData.template?.id && templateList) {
      value = [formData.work_item_type?.key, formData.template?.id];
      formRef.current?.formApi?.setValue('custom_wrokitem_template', value);
    } else {
      value = [];
    }
  }
  const [data, setData] = useState<any[]>([]);
  const context = await sdk.Context.load();

  const project_key = context.mainSpace?.id|| '';
  const createTree = templateList => {
    const treeData = [] as any[];
    templateList.forEach(item => {
      treeData.push({
        label: bruteTranslate(item.name),
        value: item.key,
        children: item.templates.map(template => ({
          label: bruteTranslate(template.name),
          value: template.id,
          type: template.type,
        })),
      });
    });
    setData(treeData);
  };

  useEffect(() => {
    // 先使用上一次调用的结果，接口返回后更新，避免闪动
    if (templateList && templateList.length > 0) {
      createTree(templateList);
    }

    getTemplateApi({ project_key }).then(res => {
      templateList = res.data || [];
      createTree(templateList);
    });
  }, []);

  if (invalidMessage) {
    const templateName = formRef?.current?.formApi?.getValue('template.name');
    const workItemName = formRef?.current?.formApi?.getValue('work_item_type.name');
    return (
      <Popover trigger="hover" content={<div className='meego-plugin-gitlab-invalid-message-popover'>{invalidMessage}</div>} position="topLeft">
        <div style={{display: 'inline-block'}}>
          <Select
            prefix={<IconAlertCircle style={{ color: '#6A3AC7' }}/>}
            className="invalid_template"
            style={{ width: 386 }}
            value={`${workItemName || value[0]} > ${templateName || value[1]}`}
            validateStatus={'error'}
            onClick={e => e.preventDefault()}
            
          />
        </div>
      </Popover>
    );
  } else {
    return (
      <Cascader
        disabled={isModify}
        style={{ width: 386 }}
        treeData={data}
        value={value}
        validateStatus={isError ? 'error' : 'default'}
        placeholder={bruteTranslate('选择工作项模版')}
        onChange={value => {
          const workitemType = data.filter(item => item.value === value[0])[0];
          const templateMeta = workitemType.children.filter(item => item.value === value[1])[0];
          const name = `${workitemType.label} > ${templateMeta.label}`;
          formRef.current.formApi.setValue('work_item_type', { key: workitemType.value, name: workitemType.label });
          formRef.current.formApi.setValue('template', {
            id: templateMeta.value,
            name: templateMeta.label,
            type: templateMeta.type,
            message: '',
          });
          formRef.current.formApi.setValue('title', bruteTranslate('GitLab关联') + name);
          onChange([workitemType.value, templateMeta.value]);
          fetchDatas({ workitem_key: workitemType.value, template_id: templateMeta.value });
        }}
        displayRender={selected => selected.join(' > ')}
      />
    );
  }
};

const CustomCascader = withField(RenderCascader);

export default CustomTopCom;
