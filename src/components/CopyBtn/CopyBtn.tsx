import React, { useEffect, useState } from 'react';
import { IconCopy } from '@douyinfe/semi-icons';
import { Tooltip, Button, Toast } from '@douyinfe/semi-ui';
import useSdkContext from '../../hooks/useSdkContext';

export function CopyBtn() {
  const { activeWorkItem } = useSdkContext() || {};
  const spaceId = activeWorkItem?.spaceId;

  const [signature, setSignature] = useState<string | null>(null);
}
