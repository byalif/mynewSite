module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define("Tags", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Tags;
};
