module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define("Reply", {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Reply;
};
