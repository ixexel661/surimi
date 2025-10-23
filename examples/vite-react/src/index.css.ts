import { select } from 'surimi';

select('*').style({
  boxSizing: 'border-box',
});

select('html', 'body').style({
  margin: 0,
  padding: 0,
});

select(':root').style({
  colorScheme: 'light dark',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  margin: 0,
  padding: 0,
});
