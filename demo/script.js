import { createDebug } from '../dist/index.mjs';

window.debugWeb = createDebug({
  level: 'error',
  data: {
    message: 'Welcome!',
    description: 'Browser debug utility',
    time: new Date().toISOString(),
  },
  style: { custom: 'color: orange', debug: 'color:#155adc' },
  title: { custom: 'Title!' },
  native: false,
});

window.debugWeb.dump(['description', 'time'], {
  title: (data) => `${data.message} 😊`,
  level: 'info',
  open: true,
});
