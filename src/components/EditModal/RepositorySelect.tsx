import React, { useContext, useMemo, useState } from 'react';
import {
  withField,
  Popover,
  Select,
  Input,
  Tooltip,
  Divider,
  Row,
  Col,
  Typography,
  Tag,
  Toast,
} from '@douyinfe/semi-ui';
import { IconSearch, IconInfoCircle, IconTick } from '@douyinfe/semi-icons';
import enterSvg from '../../assets/enter.svg';
import { ConfigContext } from '../../context/configContext';
import { fetchAddRepo, fetchDelRepo } from '../../api/service';
import useSdkContext from '../../hooks/useSdkContext';

const { Text } = Typography;

const renderSearchInput = (
  value,
  keyWord,
  setKeyWord,
  repositories,
  setRepo,
  onChange,
  setUpdate,
) => {
  const addSelectValue = (keys: string[]) => {
    onChange([...new Set((value || []).concat(keys))].map(key => key));
  };
  const context = useSdkContext();
  const spaceId = context?.mainSpace?.id;
  const addRepository = (keys: string[]) => {
    const repositoriesKey = (repositories || []).map(item => item.path_with_namespace);
    const repos = (keys || [])
      .filter(key => !repositoriesKey.includes(key))
      .map(key => ({ path_with_namespace: key }));
    if (repos.length > 0) {
      fetchAddRepo(spaceId ? spaceId : Toast.error('获取空间ID失败，请刷新重试'), [...repos]);
      // store.setRepositories([...repos.reverse()].concat(repositories));
      setRepo([...repos.reverse()].concat(repositories));
      setUpdate(Number(new Date()));
    }
  };

  return (
    <div style={{ padding: 8 }}>
      <Input
        value={keyWord}
        prefix={<IconSearch />}
        placeholder={'查找或创建仓库'}
        showClear={true}
        onChange={v => setKeyWord(v)}
        onEnterPress={() => {
          if (repositories.find(option => option?.path_with_namespace === keyWord)) {
            addSelectValue([keyWord]);
            onChange([keyWord]);
          } else {
            const keys = keyWord
              .split(',')
              .map(str => str.replace(/(^\s*)|(\s*$)/g, ''))
              .filter(key => Boolean(key));
            addRepository(keys);
            addSelectValue(keys);
          }
          setKeyWord('');
          return;
        }}
      />
    </div>
  );
};

const renderOptions = (options, value, onChange, setRepo) => {
  const context = useSdkContext();
  const deleteRepos = (e, index: number) => {
    e?.stopPropagation();
    fetchDelRepo(
      context?.mainSpace?.id ? context?.mainSpace?.id : Toast.error('获取空间ID失败，请刷新重试'),
      options[index]?.path_with_namespace || '',
    ).then(res => {
      options.splice(index, 1);
      setRepo(options);
    });
  };
  return (
    <>
      {/*
        TODO:这里用了<Tag>来代替<MeegoDisplayText>，记得检查是否可用
         */}
      <Tag
        onClick={() => {
          if (value && value.length === 0) {
            onChange(undefined);
          } else {
            onChange([]);
          }
        }}
      >
        <Row>
          <Col span={4}>{value && value.length === 0 && <IconTick size={'small'} />}</Col>
          <Col span={20}>{'任意仓库'}</Col>
        </Row>
      </Tag>
      <Tooltip
        showArrow={false}
        position="right"
        content={
          '“任意”指配置了该插件 Webhook 的任意仓库。如需分端驱动，请在配置了 Webhook 的仓库中，挑选目标端仓库，并将其仓库名称粘贴于此。如：ee/madeira-frontend'
        }
      >
        <IconInfoCircle />
      </Tooltip>
      {options.length !== 0 && (
        <div style={{ padding: '0 8px' }}>
          <Divider style={{ margin: '4px 0' }} />
        </div>
      )}
      {options.map((item, index) => {
        const v = item.path_with_namespace || item.name || '';
        const selected = value?.includes(v);
        return (
          //TODO:这边用了Tag来代替MeegoDisplayText，不确定行不行，记得检查
          <Tag
            onClick={() => {
              let res: string[] | undefined = [...(value || [])];
              if (selected) {
                if (!value) {
                  return;
                }
                const index = value.findIndex(val => val === v);
                res.splice(index, 1);
              } else {
                res.push(v);
              }
              if (res.length === 0) {
                res = undefined;
              }
              onChange(res);
            }}
            key={v}
            color={selected ? 'green' : undefined}
            closable
            onClose={e => {
              deleteRepos(e, index);
            }}
          >
            <Row>
              <Col span={4}>{selected && <IconTick size={'small'} />}</Col>
              <Col span={20}>{v}</Col>
            </Row>
          </Tag>
        );
      })}
    </>
  );
};

const RepositorySelectComp = withField(props => {
  const { value, onChange, error } = props;
  const [keyWord, setKeyWord] = useState('');
  const [, setUpdate] = useState(0);
  const [initValue] = useState<string[]>([]);
  const { repositories, setRepos: setRepo } = useContext(ConfigContext);

  const options = useMemo(() => {
    const repos = [
      ...initValue.map(key => ({ path_with_namespace: key })),
      ...repositories.filter(option => !initValue.includes(option.path_with_namespace)),
    ];
    if (!keyWord) {
      return repos;
    } else {
      return repos.filter(option => (option.path_with_namespace || '').includes(keyWord));
    }
  }, [initValue, repositories, keyWord]);

  const hasTargetOption = useMemo(
    () => (keyWord ? !!options.find(option => option.path_with_namespace === keyWord) : false),
    [keyWord, options],
  );

  const onClosePopover = isVisble => {
    if (!isVisble) {
      setKeyWord('');
    }
  };

  return (
    <Popover
      onVisibleChange={onClosePopover}
      trigger="click"
      content={
        <div style={{ width: 240 }}>
          {renderSearchInput(
            value,
            keyWord,
            setKeyWord,
            repositories,
            setRepo,
            onChange,
            setUpdate,
          )}
          <div style={{ padding: 8 }}>
            <Text type="tertiary">{'用英文逗号分隔多个仓库'}</Text>
          </div>
          {renderOptions(options, value, onChange, setRepo)}
          {keyWord && !hasTargetOption && (
            <div style={{ padding: '8px' }}>
              <Divider style={{ margin: '4px 0' }} />
              <img src={enterSvg} alt="" />
              <Text>{'按回车添加'}</Text>
            </div>
          )}
        </div>
      }
    >
      <div>
        <Select
          multiple
          maxTagCount={1}
          showRestTagsPopover={true}
          emptyContent={null}
          optionList={[]}
          placeholder={error ? '' : '选择仓库'}
          value={value && value.length === 0 ? ['任意仓库'] : value || []}
          validateStatus={error ? 'error' : undefined}
          onChange={(v: undefined | { length: number }) => {
            if (v && v.length === 0) {
              onChange(undefined);
            } else {
              onChange(v);
            }
          }}
        />
      </div>
    </Popover>
  );
});

const RepositorySelect = props => {
  const { field } = props;
  const [error, setError] = useState(false);
  return (
    <RepositorySelectComp
      error={error}
      noLabel={true}
      field={field}
      validate={v => {
        if (!v) {
          setError(true);
          return '选择仓库';
        } else {
          setError(false);
          return '';
        }
      }}
    />
  );
};

export default RepositorySelect;
