import { Router } from 'express';
// @ts-ignore
const apiRouter = require('./routes'); // Import your main router

const router = Router();

router.get('/', (req, res) => {
  res.send('API is working!');
});

// Mount all resource routes
router.use('/', apiRouter);

export default router;