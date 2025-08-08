// filepath: /workspaces/microfrmr/Farmers-Choice-API/src/routes/index.ts
import { Router } from 'express';

const router = Router();

// Example route
router.get('/', (req, res) => {
  res.send('API is working!');
});

export default router;