module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define("Transactions", {
    session: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    MP3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    WAV: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trackouts: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Transactions;
};
