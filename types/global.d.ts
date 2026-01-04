import type { WebDebugData } from '@/shared/lib/debug/webDebug';

declare global {
  interface Window {
    // Default prop name
    info?: WebDebugData

    // Test prop name
    debug?: WebDebugData
  }
}

export {};
