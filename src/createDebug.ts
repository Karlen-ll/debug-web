import { DebugWeb } from '@/debugWeb';
import { isFunc } from '@/utils';
import { DEFAULT_ALIAS_MAP, INFO } from '@/const';
import { CreateDebugOptions, CustomLogLevels, DebugWebAliasMap, DebugWebTitleMap } from '@/types';

/** Creates a proxy for DebugWeb instance that allows dynamic logging levels */
export function createDebug<T extends typeof DebugWeb>(
  options?: CreateDebugOptions,
  DebugClass: T = DebugWeb as T
) {
  const instance = new DebugClass(options);
  const aliasMap: DebugWebAliasMap = { ...DEFAULT_ALIAS_MAP, ...options?.alias };
  const titleMap: DebugWebTitleMap = { ...options?.title };

  return new Proxy(instance, {
    get(target, name: string) {
      const prop = (aliasMap[name] || name) as keyof typeof target;

      if (target[prop]) {
        return isFunc(target[prop]) ? target[prop].bind(target) : target[prop];
      }

      return (...attrs: unknown[]) => {
        return target.call(INFO, titleMap[prop] ? [titleMap[prop], ...attrs] : attrs, prop, true);
      };
    }
  }) as CustomLogLevels & InstanceType<T>;
}
