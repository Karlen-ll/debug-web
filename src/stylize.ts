import { isString } from '@/utils';

/**
 * Style a message for console
 * @desc CSS-style format: `background-color: red; color: white`
 * @example console.log(...stylizeMessage('Error', 'color:red'))
 */
export const stylizeMsg = (message: unknown, style: string): [string, string] => {
  return [style.includes('background') ? `%c ${message} ` : `%c${message}`, style];
};

/**
 * Style attributes for console
 * @desc Applies styling to the first attribute only if it is a string
 */
export const stylizeAttrs = (attrs: unknown[], styles?: string | null) => {
  if (!styles || !attrs?.length || !isString(attrs[0])) {
    return attrs;
  }

  return [...stylizeMsg(attrs[0], styles), ...attrs.slice(1)];
};

/** Generate simple CSS styles */
const getStyle = (bg: string, color = '#fff') => {
  return `background: ${bg}; color: ${color}; padding: 2px; border-radius: 3px;`;
};

export const defaultStyle = {
  info: getStyle('#155adc'),
  success: getStyle('#13a10e'),
  focus: getStyle('#881798'),
  alert: getStyle('#ffa500'),
  danger: getStyle('#dc143c'),
};
