const express = require('express');
const apiRouter = require('./routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API is working!');
});

router.use('/', apiRouter);

module.exports = router;