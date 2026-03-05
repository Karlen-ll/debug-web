import type { DebugWebData } from '@/debugWeb';

declare global {
  interface Window {
    // Default prop name
    info?: DebugWebData

    // Test prop name
    debug?: DebugWebData
  }
}

export {};
