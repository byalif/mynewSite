module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define("CommentLike", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return CommentLike;
};
