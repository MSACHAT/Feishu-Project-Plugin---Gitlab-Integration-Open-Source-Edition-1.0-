import { bruteTranslate } from '@bdeefe/meego-plugin-modules/src/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { Select, Popover, Input, Tooltip, Icon, withField, Typography } from 'SemiUiReact';
import SearchIcon from '../assert/search.svg';
import TickIcon from '../assert/tick.svg';
import { infoCircle, deleteIcon } from 'SemiIcons';
import { debounce } from 'lodash';
import { deleteRepo, getRepository, updateRepository } from '../api';
import './RepositorySelect.less';
import { observer } from 'mobx-react';
import store from '../store';
import EnterIcon from '../assert/icon_select_outlined.svg';

interface Repository {
  path_with_namespace: string;
}

const RepositorySelect = withField(props => {
  const { value: _value, onChange, error } = props;
  const [keyWord, setKeyWord] = useState('');
  const { _id: project_key = '' } = stores?.projectStore?.currentProject;

  // observer 无效，手动更新
  const [update, setUpdate] = useState(0);
  const [initValue, setInitValue] = useState([]);

  const { repositories, repositoriesExpiredTime } = store;

  useEffect(() => {
    if (Number(new Date()) > repositoriesExpiredTime) {
      store.getRepositories(project_key).then(() => {
        setUpdate(Number(new Date()));
      });
    }
    setInitValue((_value || []).map(item => item?.path_with_namespace));
  }, []);

  const value: string[] | undefined = useMemo(() => {
    if (!_value) {
      return undefined;
    }
    const res = (_value || []).map(item => item?.path_with_namespace);
    return res;
  }, [_value]);

  const options = useMemo(() => {
    const repos = [...initValue.map(key => ({path_with_namespace: key})), ...repositories.filter(option => !initValue.includes(option?.path_with_namespace))];
    if (!keyWord) {
      return repos;
    } else {
      return repos.filter(option => (option?.path_with_namespace || '').includes(keyWord));
    }
  }, [initValue, repositories, keyWord]);

  // useEffect(() => {
  //   const repositoriesKeys = repositories.map(item => item?.path_with_namespace);
  //   const _initVal = initValue.filter(item => repositoriesKeys.includes(item));
  //   setInitValue(_initVal);
  // }, [repositories])

  const hasTargetOption = useMemo(() => {
    return keyWord ? !!(options.find((option) => option.path_with_namespace === keyWord)) : false;
  }, [keyWord, options]);

  const deleteRepository = key => {
    const index = repositories.findIndex(option => option?.path_with_namespace === key);
    repositories.splice(index, 1);
    deleteRepo({ project_key, path_with_namespace: key });
    store.setRepositories([...repositories]);

    if(initValue.includes(key)) {
      initValue.splice(initValue.indexOf(key), 1);
      setInitValue([...initValue]);
    }

    if(value && value.includes(key)) {
      value?.splice(value.indexOf(key), 1)
      const newValue = [...value].map((key) => ({path_with_namespace: key}));
      onChange(newValue);
    }

    setUpdate(Number(new Date()));
  };

  const addSelectValue = (keys: string[]) => {
    onChange([...new Set((value || []).concat(keys))].map(key => ({ path_with_namespace: key })));
  }

  const addRepository = (keys: string[]) => {
    const repositoriesKey = (repositories || []).map(item => item.path_with_namespace);
    const repos = (keys || []).filter(key => !repositoriesKey.includes(key)).map(key => ({path_with_namespace: key}));
    if(repos.length > 0) {
      updateRepository({
        project_key,
        repositories: [...repos],
      });
      store.setRepositories([...repos.reverse()].concat(repositories));
      setUpdate(Number(new Date()));
    }
  };

  const renderOptions = () => (
    <div className="options-wrapper">
      {(options || []).map(item => {
        const v = item?.path_with_namespace;
        const selected = value?.includes(v);
        const highlight = keyWord === item?.path_with_namespace
        return (
          <div
            className={`repository-item ${selected ? 'selected' : ''} ${highlight ? 'highlight' : ''}`}
            onClick={(e) => {
              if(e.target?.nodeName === 'svg' || e.target?.parentNode?.nodeName === 'svg') {
                return;
              }
              let res: any[] | undefined = [...(_value || [])];
              if (selected) {
                if (!value) {
                  return;
                }
                const index = value.findIndex(val => val === v);
                res.splice(index, 1);
              } else {
                res.push({
                  path_with_namespace: v,
                });
              }
              if (res.length === 0) {
                res = undefined;
              }
              onChange(res);
            }}
          >
            <div className='gitlab-options-info'>
              <img src={TickIcon} className="gitlab-tick-icon" />
              <Typography.Text className='gitlab-options-name' ellipsis={{ showTooltip: { opts: { spacing: 0, content: v } } }}>
                {v}
              </Typography.Text>
            </div>
            <Icon type={deleteIcon.id} className="gitlab-delete-icon" onClick={() => deleteRepository(v)} />
          </div>
        );
      })}{' '}
    </div>
  );

  const renderContent = () => (
    <div className="gitlab-repository-content" onClick={e => e.nativeEvent.stopImmediatePropagation()}>
      <div className="repository-search-wrapper">
        <Input
          value={keyWord}
          className="repository-search"
          prefix={<img src={SearchIcon} />}
          placeholder={bruteTranslate('查找或创建仓库')}
          showClear={true}
          onChange={v => setKeyWord(v)}
          onEnterPress={() => {
            if(repositories.find(option => option?.path_with_namespace === keyWord)) {
              addSelectValue([keyWord]);
            } else {
              const keys = keyWord.split(',').map(str => str.replace(/(^\s*)|(\s*$)/g, "")).filter(key => Boolean(key));
              addRepository(keys);
              addSelectValue(keys);
            }
            setKeyWord('');
            return;
          }}
        />
      </div>
      <div className='repo-split-tip'>
        {bruteTranslate('用“,”分割，系统自动解析成多个')}
      </div>
      {!keyWord && (
        <div className="all-repository-wrapper">
          <div
            className={`all-repository ${value && value.length === 0 ? 'selected' : ''}`}
            onClick={() => {
              if (value && value.length === 0) {
                onChange(undefined);
              } else {
                onChange([]);
              }
            }}
          >
            <img src={TickIcon} className="gitlab-tick-icon" />
            <span>{bruteTranslate('任意仓库')}</span>
            <Tooltip
              showArrow={false}
              position="right"
              content={bruteTranslate(
                '「任意」指配置了该插件Webhook的任意仓库；如需分端驱动，请在配置了Webhook的仓库中，挑选目标端端仓库，并将其仓库名称粘贴于此。如：ee/madeira-frontend'
              )}
            >
              <Icon type={infoCircle.id} />
            </Tooltip>
          </div>
        </div>
      )}
      {!keyWord && options?.length > 0 && <div className="divider" />}
      {options?.length > 0 && renderOptions()}
      {
        keyWord && !hasTargetOption && (
          <div className='add-repo'>
            <img src={EnterIcon} />
            <div>{bruteTranslate('按回车添加')}</div>
          </div>
        )
      }
    </div>
  );

  const onClosePopover = isVisble => {
    if (!isVisble) {
      setKeyWord('');
    }
  };

  return (
    <div className="gitlab-repository-select">
      <Popover content={renderContent()} trigger="click" position="bottomLeft" onVisibleChange={onClosePopover}>
        <div>
          <Select
            multiple
            maxTagCount={1}
            showRestTagsPopover={true}
            emptyContent={null}
            options={[]}
            value={value && value.length === 0 ? [bruteTranslate('任意仓库')] : value || []}
            placeholder={error ? '' : bruteTranslate('选择仓库')}
            validateStatus={error ? 'error' : ''}
            renderSelectedItem = {optionsNode => {
              return {
                isRenderInTag: true,
                content: <div className='gitlab-repository-selected'>{optionsNode?.label || optionsNode?.value}</div>}
              }
            }
            onChange={v => {
              if (v.length === 0) {
                onChange(undefined);
              } else {
                onChange((v || []).map(item => ({ path_with_namespace: item })));
              }
            }}
          />
        </div>
      </Popover>
    </div>
  );
});

const RepositorySelectComp = props => {
  const { index } = props;
  const [error, setError] = useState(false);

  return (
    <div className="gitlab-repository-wrapper">
      <RepositorySelect
        error={error}
        field={`forward[${index}].repositories`}
        noLabel={true}
        validate={v => {
          if (!v) {
            setError(true);
            return bruteTranslate('选择仓库');
          } else {
            setError(false);
            return '';
          }
        }}
      />
    </div>
  );
};

export default RepositorySelectComp;
