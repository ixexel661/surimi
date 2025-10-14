import { select } from 'surimi';

const header = select('.surimi-editor__header').style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const button = header.descendant('button').style({
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
});

button.hover().style({
  backgroundColor: '#0056b3',
});

button.disabled().style({
  backgroundColor: '#ccc',
  cursor: 'not-allowed',
});
