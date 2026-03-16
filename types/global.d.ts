import type { DebugWebData } from '@/debugWeb';

declare global {
  interface Window {
    // Default prop name
    debug?: DebugWebData

    // Test prop name
    _debug?: DebugWebData
  }
}

export {};
