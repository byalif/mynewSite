module.exports = (sequelize, DataTypes) => {
  const Followers = sequelize.define("Followers", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Followers;
};
