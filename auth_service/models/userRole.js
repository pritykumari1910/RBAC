module.exports = (sequelize) => {
    return sequelize.define(
      "UserRole",
      {},
      { tableName: "user_roles", timestamps: false }
    );
  };
  