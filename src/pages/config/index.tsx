import { I18n } from '@ies/starling_intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchConfigList,
  fetchReposList,
  fetchDelRule,
} from '../../api/service';
import {
  IConfigList,
  IRepos,
} from '../../api/types';
import ConfigList from '../../components/ConfigList';
import ConfigItem from '../../components/ConfigList/ConfigItem';
import CopyBtn from '../../components/CopyBtn/CopyBtn';
import EditModal from '../../components/EditModal/EditModal';
import { ConfigContext } from '../../context/configContext';
import { getProjectKey, isInternal } from '../../utils/utils';
import { Toast } from '@douyinfe/semi-ui';
import CustomRule from '../../components/CustomRule/CustomRule';

const Config = () => {
  const projectKey = getProjectKey();
  const [visible, setVisible] = useState(false); // 是否显示modal
  const [isEdit, setIsEdit] = useState(false); // 是否为修改
  const [repositories, setRepos] = useState<Array<IRepos>>([]); // 仓库列表
  // const [githubEvent, setGithubEvent] = useState<GithubEventList[]>([]);
  const [nodes, setNodes] = useState([]); // 节点列表
  const [updateFlag, setUpdateFlag] = useState(0); // 强制更新
  const [eventList, setEventList] = useState([]); // github事件列表
  const [editInfo, setEditInfo] = useState(null); // 修改信息
  const [workItemList, setWorkItemList] = useState([]); // 工作项 & 模版
  const [required, setRequired] = useState(true); // 配置规则时是否展示必填模式
  const [modalLoading, setModalLoading] = useState(false); // 控制modal框是否loading
  const [templateList, setTemplateList] = useState([]); // 存储已经配置过规则的模版
  const [modalBtnLoading, setModalBtnLoading] = useState(false); // modal确认按钮的loading状态
  const [internal, setInternal] = useState(false);
  const fetchData = useCallback(
    () =>
      fetchConfigList(projectKey).then((res) =>
        res?.data && res.data.length ? { rules: res?.data } : {},
      ),
    [projectKey],
  );
  useEffect(() => {
    fetchReposList(projectKey).then((res) => {
      setRepos(res.data?.repositories.map((item) => item) || []);
    });
  }, [projectKey]);

  useEffect(() => {
    // TODO 这里判断了内外网环境
    isInternal().then((res) => {
      setInternal(res);
    });
  }, []);

  const renderHeader = useMemo(
    () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 12,
        }}>
        <CustomRule/>
        <div style={{ width: 12 }}></div>
        {!internal && <CopyBtn/>}
      </div>
    ),
    [internal],
  );

  return (
    <ConfigContext.Provider
      value={{
        workItem: workItemList,
        setWorkItem: setWorkItemList,
        isEdit,
        setIsEdit,
        repositories,
        setRepos,
        nodes,
        setNodes,
        eventList,
        setEventList,
        editInfo,
        setEditInfo,
        visible,
        setVisible,
        updateFlag,
        setUpdateFlag,
        required,
        setRequired,
        modalLoading,
        setModalLoading,
        templateList,
        setTemplateList,
        modalBtnLoading,
        setModalBtnLoading,
      }}>
      <ConfigList<IConfigList>
        fetchData={fetchData}
        forceUpdataFlag={updateFlag}
        addBtnText={I18n.t(
          'Meego_Shared_GitlabAssociationGuide_AddCompletionRule_Button',
          {},
          '添加流转规则',
        )}
        headerContent={renderHeader}
        renderItem={(item) => (
          <ConfigItem
            {...item}
            onRemove={(id: string) => {
              fetchDelRule(id, projectKey).then((res) => {
                if (res.code === 0) {
                  setUpdateFlag((flag) => flag + 1);
                } else {
                  Toast.error(res.msg);
                }
              });
            }}
            onEdit={(item) => {
              setVisible(true);
              setIsEdit(true);
              setEditInfo(item);
            }}
          />
        )}
        title={I18n.t(
          'Meego_Shared_GitlabAssociationGuide_ListOfGitlabRules_Title',
          {},
          'GitLab 规则列表',
        )}
        onClickAdd={() => {
          setIsEdit(false);
          setVisible(true);
          setModalLoading(true);
          setEditInfo(null);
        }}
      />
      <EditModal
        visible={visible}
        centered
        style={{ minWidth: 1080 }}
        maskClosable={false}
        width={1080}
        height={window.innerHeight < 930 ? 0 : 790}
        confirmLoading={modalBtnLoading}
        okText={
          isEdit
            ? I18n.t('Meego_Shared_GitlabAssociationGuide_Modify', {}, '修改')
            : I18n.t('Meego_Shared_GitlabAssociationGuide_Create', {}, '创建')
        }
        cancelText={I18n.t(
          'Meego_Shared_GitlabAssociationGuide_Modal_Cancel_Button',
          {},
          '取消',
        )}
        onCancel={() => {
          setVisible(false);
          setIsEdit(false);
        }}
      />
    </ConfigContext.Provider>
  );
};

export default Config;
