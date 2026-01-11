const sequelize = require('../config/db');

const User = require('./user');
const Role = require('./role');
const Permission = require('./permission');
const RolePermission = require('./rolePermission'); // This sets up many-to-many

// Define associations here AFTER all models are loaded
User.belongsTo(Role);
Role.hasMany(User);

 // Many-to-many is already set in rolePermission.js
// But we can reinforce if needed:
// Role.belongsToMany(Permission, { through: RolePermission });
// Permission.belongsToMany(Role, { through: RolePermission });

// Sync database (creates/updates tables)
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Sync error:', err));

module.exports = { sequelize, User, Role, Permission };