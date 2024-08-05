import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Toast, Popconfirm } from '@douyinfe/semi-ui';
import { isEmpty } from 'lodash';
import { getCommonSetting, commonSetting } from '../../api/service';
import useSdkContext from '../../hooks/useSdkContext';

const FormInput = Form.Input;
const CustomRule = () => {
  const { mainSpace } = useSdkContext() || {};
  const spaceId = mainSpace?.id ?? '';

  const [visible, setVisible] = useState(false);
  const [formApi, setFormApi] = useState<any>(null);

  const showDialog = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (visible && formApi?.setValues) {
      getCommonSetting(spaceId).then(res => {
        if ((res?.data?.settings || []).length > 0) {
          const settings = res?.data?.settings[0];
          formApi.setValues({
            link_rule: JSON.parse(settings?.settings || '{}')?.link_rule || '',
            trigger_key_words: JSON.parse(settings?.settings || '{}')?.trigger_key_words || '',
          });
        }
      });
    }
  }, [visible, formApi]);

  const handleOk = async (type = 1) => {
    if (type === 2) {
      fetchCommonSetting({
        link_rule: '',
        trigger_key_words: '',
      });
    }
    if (type === 1) {
      formApi?.submitForm();
      setTimeout(() => {
        const values = formApi?.getValues();
        const error = formApi?.getError();
        if (isEmpty(error)) {
          fetchCommonSetting(values);
        }
      }, 0);
    }
  };

  const fetchCommonSetting = values => {
    commonSetting(spaceId, {
      link_rule: values.link_rule,
      trigger_key_words: values.trigger_key_words,
    })
      .then(res => {
        if (res.code === 0) {
          setVisible(false);
        } else {
          Toast.error(res.msg);
        }
      })
      .catch(e => {
        Toast.error(e.message);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button onClick={showDialog}>全局配置</Button>
      <Modal
        title="工作项联动配置"
        visible={visible}
        onCancel={handleCancel}
        closeOnEsc={true}
        footer={
          <>
            <Popconfirm
              title="确定重置吗？"
              content="重置后将回到初始状态"
              onConfirm={() => {
                handleOk(2);
              }}
            >
              <Button type="primary">重置</Button>
            </Popconfirm>
            <Button type="primary" onClick={() => handleOk()}>
              确认
            </Button>
          </>
        }
      >
        <Form getFormApi={setFormApi}>
          <FormInput
            field="link_rule"
            label="自定义前缀"
            placeholder="例如: link-[0-9]+"
            rules={[
              {
                required: true,
                message: '此项必填',
              },
            ]}
          />
          <FormInput
            field="trigger_key_words"
            label="驱动关键字"
            placeholder="多个关键字用英文逗号分隔"
            rules={[
              {
                required: true,
                message: '此项必填',
              },
            ]}
          />
        </Form>
      </Modal>
    </>
  );
};

export default CustomRule;
