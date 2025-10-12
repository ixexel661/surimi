import { select } from 'surimi';

select('.surimi-editor').style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr auto',
  gridTemplateAreas: `'input output' 'input terminal'`,
  height: '100%',
  gap: '8px',
});
