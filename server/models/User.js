module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "subscriber",
    },
    resetPasswordLink: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Comments, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Users.hasMany(models.CommentLike, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Reposts, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Cart, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Followers, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Track, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Followers, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Transactions, {
      onDelete: "cascade",
    });
  };

  return Users;
};
