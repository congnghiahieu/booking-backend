const router = require('express').Router();
const path = require('path');

// Test routes
router.get('/hello', (req, res) => {
  res.status(200).send('Hello World!');
});

router.get('^/$|/index(.html)?', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/new-page(.html)?', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {
  res.status(301).redirect('/new-page.html');
});

// API routes
/*
  http://localhost:8000/v1/...
*/
router.use('/v1', require('./v1'));
/*
  http://localhost:8000/v2/...
*/
router.use('/v2', require('./v2'));

// Xử lý 404
router.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not found' });
  } else {
    res.type('txt').send('404 Not found');
  }
});

module.exports = router;
