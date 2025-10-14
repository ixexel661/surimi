import { select } from 'surimi';

const container = select('.surimi-editor').style({
  height: 'calc(100% - 4rem)',
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  gap: '1rem',
  padding: '1rem',
});

container.descendant('.surimi-editor__right').style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '1rem',
  // override panel style to make "invisible" panel
  border: 'none',
  padding: 0,
});
