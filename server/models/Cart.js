module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MP3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    WAV: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackouts: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Cart.associate = (models) => {
    Cart.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };

  return Cart;
};
