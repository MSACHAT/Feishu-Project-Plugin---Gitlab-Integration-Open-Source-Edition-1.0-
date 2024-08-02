import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  FormInput,
  Toast,
  Popconfirm,
} from 'Component';
import { isEmpty } from 'Lodash';
import I18n from '@ies/starling_intl';
import { getCommonSetting, commonSetting } from '../api';

const CustomRule = () => {
  const spaceId = stores?.projectStore?.currentProject?._id || '';
  const [visible, setVisible] = useState(false);
  const [formApi, setFormApi] = useState<any>(null);

  const showDialog = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (visible && formApi?.setValues) {
      getCommonSetting(spaceId).then((res) => {
        if ((res?.data?.settings || []).length > 0) {
          const settings = res?.data?.settings[0];
          formApi.setValues({
            link_rule: JSON.parse(settings?.settings || '{}')?.link_rule || '',
            trigger_key_words:
              JSON.parse(settings?.settings || '{}')?.trigger_key_words || '',
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

  const fetchCommonSetting = (values) => {
    commonSetting(spaceId, {
      link_rule: values.link_rule,
      trigger_key_words: values.trigger_key_words,
    })
      .then((res) => {
        if (res.code === 0) {
          setVisible(false);
        } else {
          MeegoToast.error(res.msg);
        }
      })
      .catch((e) => {
        MeegoToast.error(e.message);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <MeegoButton onClick={showDialog}>
        {I18n.t(
          'Meego_Shared_GitlabAssociationGuide_GlobalConfiguration',
          {},
          '全局配置'
        )}
      </MeegoButton>
      <MeegoModal
        title={I18n.t(
          'Meego_Shared_GitlabAssociationGuide_WorkItemLinkageConfiguration',
          {},
          '工作项联动配置'
        )}
        visible={visible}
        onCancel={handleCancel}
        closeOnEsc={true}
        footer={
          <>
            <MeegoPopconfirm
              title={I18n.t(
                'Meego_Shared_GitlabAssociationGuide_ConfirmResetTitle',
                {},
                '确定重置吗？'
              )}
              content={I18n.t(
                'Meego_Shared_GitlabAssociationGuide_ConfirmResetContent',
                {},
                '重置后将回到初始状态'
              )}
              onConfirm={() => {
                handleOk(2);
              }}
            >
              <MeegoButton type='primary'>
                {I18n.t(
                  'Meego_Shared_GitlabAssociationGuide_CustomRuleButtonReset',
                  {},
                  '重置'
                )}
              </MeegoButton>
            </MeegoPopconfirm>
            <MeegoButton type='primary' onClick={() => handleOk()}>
              {I18n.t(
                'Meego_Shared_GitlabAssociationGuide_CustomRuleButtonOk',
                {},
                '确认'
              )}
            </MeegoButton>
          </>
        }
      >
        <MeegoForm getFormApi={setFormApi}>
          <MeegoFormInput
            field='link_rule'
            label={I18n.t(
              'Meego_Shared_GitlabAssociationGuide_CustomPrefix',
              {},
              '自定义前缀'
            )}
            placeholder={I18n.t(
              'Meego_Shared_GitlabAssociationGuide_ForExample',
              {},
              '例如: link-[0-9]+'
            )}
            rules={[
              {
                required: true,
                message: I18n.t(
                  'Meego_Shared_GitlabAssociationGuide_ThisFieldIsRequired',
                  {},
                  '此项必填'
                ),
              },
            ]}
          />
          <MeegoFormInput
            field='trigger_key_words'
            label={I18n.t(
              'Meego_Shared_GitlabAssociationGuide_DriverKeyword',
              {},
              '驱动关键字'
            )}
            placeholder={I18n.t(
              'Meego_Shared_GitlabAssociationGuide_MultipleKeywordsSeparatedByCommas',
              {},
              '多个关键字用英文逗号分隔'
            )}
            rules={[
              {
                required: true,
                message: I18n.t(
                  'Meego_Shared_GitlabAssociationGuide_ThisFieldIsRequired',
                  {},
                  '此项必填'
                ),
              },
            ]}
          />
        </MeegoForm>
      </MeegoModal>
    </>
  );
};

export default CustomRule;
