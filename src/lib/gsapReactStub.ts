import { useEffect } from 'react';

type UseGsapCallback = () => void | (() => void);

export const useGSAP = (callback: UseGsapCallback, deps: any[] = []) => {
  useEffect(() => {
    const cleanup = callback();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useGSAP;
