'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert Roles
    await queryInterface.bulkInsert('Roles', [
      { name: 'admin', description: 'Full access', createdAt: new Date(), updatedAt: new Date() },
      { name: 'user', description: 'Basic user', createdAt: new Date(), updatedAt: new Date() },
      { name: 'moderator', description: 'Moderate content', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert Permissions
    await queryInterface.bulkInsert('Permissions', [
      { name: 'create_user', description: 'Can create users', createdAt: new Date(), updatedAt: new Date() },
      { name: 'view_users', description: 'Can view all users', createdAt: new Date(), updatedAt: new Date() },
      { name: 'delete_user', description: 'Can delete users', createdAt: new Date(), updatedAt: new Date() },
      { name: 'manage_roles', description: 'Can manage roles', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Fetch inserted roles and permissions
    const [adminRoleResult, modRoleResult, permissions] = await Promise.all([
      queryInterface.select(null, 'Roles', { where: { name: 'admin' } }),
      queryInterface.select(null, 'Roles', { where: { name: 'moderator' } }),
      queryInterface.select(null, 'Permissions', {}),
    ]);

    const adminRoleId = adminRoleResult[0].id;
    const modRoleId = modRoleResult[0].id;
    const allPermIds = permissions.map(p => p.id);
    const viewUsersPermId = permissions.find(p => p.name === 'view_users').id;

    // Assign all permissions to admin — NO timestamps here!
    const adminPermissions = allPermIds.map(permissionId => ({
      RoleId: adminRoleId,
      PermissionId: permissionId,
    }));
    await queryInterface.bulkInsert('RolePermissions', adminPermissions);

    // Assign view_users to moderator — NO timestamps!
    await queryInterface.bulkInsert('RolePermissions', [{
      RoleId: modRoleId,
      PermissionId: viewUsersPermId,
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};