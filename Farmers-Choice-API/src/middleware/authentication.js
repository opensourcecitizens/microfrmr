/**
 * Dev-friendly authentication middleware (CommonJS).
 * Exports:
 *  - authenticate (original name)
 *  - authenticateUser (alias used by routes)
 *  - authorize(roles) for role checks
 *
 * Replace with production-grade JWT verification (jsonwebtoken) when ready.
 */

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const authenticate = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// alias to satisfy routes that expect `authenticateUser`
const authenticateUser = authenticate;

// role-based authorizer factory
const authorize = (allowedRoles = []) => (req, res, next) => {
  const userRole = (req.user && req.user.role) || 'viewer';
  if (!allowedRoles || allowedRoles.length === 0) return next();
  if (!allowedRoles.includes(userRole)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

module.exports = { authenticate, authenticateUser, authorize };
