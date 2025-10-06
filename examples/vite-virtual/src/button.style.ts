import s from 'surimi';

// Button styles
s.select('.btn').style({
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
  margin: '0.5rem',
  transition: 'all 0.2s ease',
});

s.select('.btn').hover().style({
  transform: 'translateY(-1px)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
});

s.select('.btn.primary').style({
  backgroundColor: '#3498db',
  color: 'white',
});

s.select('.btn.primary').hover().style({
  backgroundColor: '#2980b9',
});

s.select('.btn.secondary').style({
  backgroundColor: '#95a5a6',
  color: 'white',
});

s.select('.btn.secondary').hover().style({
  backgroundColor: '#7f8c8d',
});
