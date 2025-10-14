import { select } from 'surimi';

import { config } from '#styles/config';

select('.surimi-playground-container').style({
  height: `calc(100vh - ${config.header.height} - 100px)`,
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  padding: '0 1rem 1rem 1rem',
});
