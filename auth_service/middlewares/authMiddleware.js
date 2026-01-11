const { User, Role, Permission } = require('../models');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      // Assuming you have user ID in req.user after login (we'll add JWT later)
      // For now, we'll simulate with userId from body or params (demo only)
      const userId = req.body.userId || req.params.userId || req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const user = await User.findByPk(userId, {
        include: { model: Role, include: Permission },
      });

      if (!user || !user.Role) {
        return res.status(403).json({ message: 'No role assigned' });
      }

      const hasPermission = user.Role.Permissions.some(
        (p) => p.name === permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      req.user = user; // Attach full user for further use
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { requirePermission, authenticateToken };