import React, { useEffect, useState } from 'react';
import { Utils } from '@bdeefe/meego-plugin-modules';
import { Button, Tooltip, Toast } from 'SemiUiReact';
import { copyText, logEvent } from '../utils';
import { getSetting } from '../../api';
import CopyIcon from '../assert/CopyIcon';

const { bruteTranslate } = Utils;

const CopyBtn = () => {
  const { _id: project_key = '' } = stores?.projectStore?.currentProject;
  const user_id = stores?.userStore?.user?.username;
  const enter_from = stores?.projectStore?.currentProject?.simple_name;
  const host =
    Utils.isDev || Utils.isBoe ?
      'https://meego.boe.bytedance.net/' :
      Utils.isExternal ?
        'https://project.feishu.cn/' :
        'https://meego.feishu.cn/';

  const [signature, setSignature] = useState(undefined);

  const updateSignature = () => {
    getSetting({ project_key }).then(res => {
      if (res.status_code === 0) {
        setSignature(res.data.signature);
      } else {
        setSignature('');
      }
    });
  };

  useEffect(() => {
    if (Utils.isBoe || Utils.isExternal) {
      updateSignature();
    }
  }, []);

  return (
    <>
      {(Utils.isBoe || Utils.isExternal) && (
          <Tooltip
            content={bruteTranslate('用于配置GitLab Webhook的URL和token，详见规则配置页的帮助文档')}
            position="bottom"
            showArrow={false}
          >
            <Button
              className="copy-btn"
              theme="solid"
              onClick={async () => {
                logEvent('copy_workitem_node', { user_id, enter_from });
                if (signature) {
                  copyText(`${host}bff/v2/builtin_app/gitlab/webhook?signature=${signature}`);
                } else {
                  Toast.error('获取 token 失败');
                  updateSignature();
                }
              }}
            >
              <CopyIcon style={{ fill: 'white' }} />&nbsp;&nbsp;{bruteTranslate('复制URL')}
            </Button>
          </Tooltip>
      )}
    </>
  );
};

export default CopyBtn;
