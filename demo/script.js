import { createDebug } from '../dist/index.mjs';

window.debugWeb = createDebug({
  level: 'error',
  data: {
    message: 'Welcome!',
    description: 'Browser debug utility',
    time: new Date().toISOString(),
  },
  style: { custom: 'color: orange' },
  native: false,
});

window.debugWeb.dump(['description', 'time'], {
  title: (data) => `${data.message} 😊`,
  level: 'error',
  open: true,
});

window.logs = function() {
  debugWeb.debug('Debug');
  debugWeb.log('Log');
  debugWeb.info('Info');
  debugWeb.success('Success');
  debugWeb.alert('Alert');
  debugWeb.danger('Danger');
  debugWeb.warn('Warn');
  debugWeb.error('Error');
}
