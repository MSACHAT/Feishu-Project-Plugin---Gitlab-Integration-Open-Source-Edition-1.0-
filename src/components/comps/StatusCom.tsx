import { bruteTranslate } from '@bdeefe/meego-plugin-modules/src/utils';
import React from 'react';
import { Icon, Tooltip } from 'SemiUiReact';
import { infoCircle } from 'SemiIcons';
import './StatusCom.less';

const StatusCom = (props) => {
    return (
        <div className='gitlab-status-node'>
            <span>{bruteTranslate('状态')}</span>
            <Tooltip showArrow={false} content={bruteTranslate('为实现自动流转，请确保缺陷的当前状态可进入该目标状态，且该过程中不涉及流转表单')}>
                <Icon type={infoCircle.id} />
            </Tooltip>
        </div>
    )
}

export default StatusCom;