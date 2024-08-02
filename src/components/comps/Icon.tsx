import * as React from 'react';
import Gitlabsrc from '../assert/gitlab.svg';
import IssueIconSrc from '../assert/work_object_icon_issue.svg';
import SprintIconSrc from '../assert/work_object_icon_sprint.svg';
import StoryIconSrc from '../assert/work_object_icon_story.svg';
import VersionIconSrc from '../assert/work_object_icon_version.svg';


const PanelHeaderDiv = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    border: '1px solid rgba(28, 31, 35, 0.08)',
    display: 'flex',
    alignItems: 'center',  
    justifyContent: 'center'
};
  
const PanelHeaderDivImg = {
    display: 'block',
    height: '26px',
    width: '30px',
    margin: '6px auto 6px',
};

const PanelHeaderToDiv = {
    width: '30px',
    height: '30px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

const PanelHeaderToDivImg = {
    width: '14px',
    height: '14px',
}

export const GitlabIcon = () => {
    return (
        <div style={PanelHeaderDiv}>
            <img src={Gitlabsrc} style={PanelHeaderDivImg} />
        </div>
    )
}

const workItemIcon = (src, color) => (
    <div style={PanelHeaderDiv}>
        <div style={{...PanelHeaderToDiv,  backgroundColor: color}}>
            <img src={src} style={PanelHeaderToDivImg}/>
        </div>
    </div>
)

export const IssueIcon = () => workItemIcon(IssueIconSrc, '#FF563B');
export const SprintIcon = () => workItemIcon(SprintIconSrc, '#885BD2');
export const StoryIcon = () => workItemIcon(StoryIconSrc, '#6f5ff4');
export const VersionIcon = () => workItemIcon(VersionIconSrc, '#FFB400');

