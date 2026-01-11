const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers, getRoles } = require('../controllers/userController');
const { requirePermission, authenticateToken } = require('../middlewares/authMiddleware');
const { login } = require('../controllers/authController');
router.post('/login', login);
// Public route
// Public route
router.post('/', registerUser);
router.get('/roles', getRoles);

// Protected: Only users with 'view_users' permission can access
router.get('/', authenticateToken, requirePermission('view_users'), getAllUsers);

module.exports = router;