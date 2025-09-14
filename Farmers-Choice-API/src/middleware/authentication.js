/**
 * Dev-friendly authentication middleware (CommonJS).
 * Exports:
 *  - authenticate (original name)
 *  - authenticateUser (alias used by routes)
 *  - authorize(roles) for role checks
 *
 * Replace with production-grade JWT verification (jsonwebtoken) when ready.
 */

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization || null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized (dev stub)' });
  }
  // DEV STUB: attach a fake user
  req.user = { id: token.slice(0, 8), role: 'farmer', token };
  next();
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
