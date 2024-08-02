export const bindings = {
    "branch": [
        {
            "id": "1824971294123523454", // 主键id
            "name": "", // 分支名称
            "url": "", // 链接
            "repository": {
                "path_with_namespace": "", // 仓库名称
                "url": "" // 仓库链接
            },
            "update_time": 12312435453, // 更新时间，秒时间戳
            "deletable": true // 是否可解绑
        }
    ],
    "commit": [
        {
            "id": "1824971294123523454", // 主键id
            "repository": {
                "path_with_namespace": "", // 仓库名称
                "url": "" // 仓库链接
            },
            "commit_id": "", // gitlab commit id
            "message": "",  // commit message
            "url": "", // commit 链接
            "author": [ 
                {
                    "id": "",  // gitlab user id
                    "username": "", // gitlab 用户名
                    "email": "" // gitlab 邮箱
                }
            ],
            "update_time": 12312435453, // 更新时间，秒时间戳
            "deletable": true // 是否可解绑
        }
    ],
    "merge_request": [
        {
            "id": "1824971294123523454", // 主键id
            "repository": {
                "path_with_namespace": "test", // 仓库名称
                "url": "" // 仓库链接
            },
            "merge_request_id": "merge_request_id",  // gitlab mr id
            "title": "title", // mr 标题
            "state": "state", // mr 状态
            "target_branch": "target_branch", // 目标分支
            "source_branch": "source_branch", // 源分支
            "developers": [ // 开发者
                {
                    "id": "",
                    "username": "",
                    "email": "shaomingqi.0906@bytedance.com"
                }
            ],
            "reviewers": [ // reviewer
                {
                    "id": "",
                    "username": "",
                    "email": "shaomingqi.0906@bytedance.com"
                }
            ],
            "update_time": 12312435453, // 更新时间，秒时间戳
            "deletable": true // 是否可解绑
        }
    ]
} 