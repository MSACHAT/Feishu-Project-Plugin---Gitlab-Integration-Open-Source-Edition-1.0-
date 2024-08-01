export interface ResponseWrap<D> {
  code: number;
  msg: string;
  data?: D;
  error?: {
    id: number;
    localizedMessage: {
      locale: string;
      message: string;
    };
  };
}

export enum DisabledState {
  Disabled = 1,
  Enabled,
}

export interface GithubEvent<T> {
  events: Array<T>;
}

export interface GithubEventList {
  key: string;
  name: string;
}

export interface IWorkItem {
  label: string;
  value: string;
  flowMode?: string;
  children?: Array<{
    is_disabled: number;
    template_id: string;
    template_key: string;
    template_name: string;
    unique_key: string;
    version: number;
    label: string;
    value: string;
    flowMode?: string;
    isLeaf?: boolean;
  }>;
}

export interface WorkflowConfig {
  deletable: boolean;
  deletable_operation_role: string[];
  different_schedule: boolean;
  done_allocate_owner: boolean;
  done_operation_role: string[];
  done_schedule: boolean;
  is_limit_node: boolean;
  name: string;
  need_schedule: boolean;
  owner_roles: string[];
  owner_usage_mode: number;
  owners: string[];
  pass_mode: number;
  state_key: string;
  tags: string[];
  visibility_usage_mode: number;
}

export interface Connection {
  source_state_key: string;
  target_state_key: string;
}
