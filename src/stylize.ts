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
 * @desc Applies styling to the first attribute only
 */
export const stylizeAttrs = (attrs: unknown[], styles?: string | null)=> {
  if (!styles || !attrs?.length) {
    return attrs;
  }

  return [...stylizeMsg(attrs[0], styles), ...attrs.slice(1)];
};

/** Generate simple CSS styles */
const getStyle = (bg: string, color = '#fff') => {
  return `background-color: ${bg}; color: ${color}; padding: 2px; border-radius: 3px;`;
};

export const defaultStyle = {
  info: getStyle('#155adc'),
  success: getStyle('#13a10e'),
  warn: getStyle('#ffa500'),
  error: getStyle('#dc143c'),
};
