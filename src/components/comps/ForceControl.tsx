import { bruteTranslate } from '@bdeefe/meego-plugin-modules/src/utils';
import React, { useMemo } from 'react';
import { Tooltip, withField, Switch, Icon } from 'SemiUiReact';
import { infoCircle } from 'SemiIcons';
import './ForceControl.less';

const CustomSwitch = withField((props) => {
    const { value, onChange } = props;
    return (
        <Switch {...props} checked={value === 1} onChange={(open) => onChange(open ? 1 : 2)}/>
    )
})

const ForceControlComp = (props) => {
    const { index, item } = props;
    const textLength = bruteTranslate('必填模式')?.length;
    return (
        <div className='gitlab-force-control-wrapper'>
            {
                index === 0 && (
                    <div className='gitlab-force-control-title' style={{top: textLength > 4 ? '-48px' : '-24px'}}>
                        {bruteTranslate('必填模式')}
                        <Tooltip showArrow={false} position="right" content={bruteTranslate('必填模式下，将为该节点增设必填字段，只有GitLab信号流入后节点才可流转。')}>
                            <Icon type={infoCircle.id} />
                        </Tooltip>
                    </div>
                )
            }
            <CustomSwitch initValue={item.control_level || 2} field={`forward[${index}].control_level`} noLabel/>
        </div>
    )
}

export default ForceControlComp;