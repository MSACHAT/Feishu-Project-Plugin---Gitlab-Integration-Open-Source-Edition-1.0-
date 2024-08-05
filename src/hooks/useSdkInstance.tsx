import SDKClient, { unwatch } from '@lark-project/js-sdk';
import { useEffect, useState } from 'react';
import { sdkManager } from '../utils';

const useSdkInstance = () => {
  const [instance, setInstance] = useState<SDKClient | undefined>();
  useEffect(() => {
    let unwatch: unwatch | undefined;
    (async () => {
      try {
        const sdk = await sdkManager.getSdkInstance();
        setInstance(sdk);
      } catch (e) {}
    })();
    return () => {
      unwatch?.();
    };
  }, []);

  return instance;
};
export default useSdkInstance;
