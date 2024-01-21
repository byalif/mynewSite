module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comments.associate = (models) => {
    Comments.hasMany(models.CommentLike, {
      onDelete: "cascade",
    });
    Comments.hasMany(models.Reply, {
      onDelete: "cascade",
    });
  };

  return Comments;
};
