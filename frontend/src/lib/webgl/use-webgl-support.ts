import { useSyncExternalStore } from 'react';
import { detectWebGL2 } from './support';

const subscribe = () => () => undefined;
const getServerSnapshot = () => false;

export function useWebGLSupported(): boolean {
  return useSyncExternalStore(subscribe, detectWebGL2, getServerSnapshot);
}
