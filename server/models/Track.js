module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define("Track", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    track: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trackouts: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    basic: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 25,
    },
    premium: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 45,
    },
    MP3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    WAV: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bpm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plays: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reposts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    exclusive: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 250,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Track.associate = (models) => {
    Track.hasMany(models.Producers, {
      onDelete: "cascade",
    });
    Track.hasMany(models.Tags, {
      onDelete: "cascade",
    });
    Track.hasMany(models.Comments, {
      onDelete: "cascade",
    });
    Track.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Track.hasMany(models.Reposts, {
      onDelete: "cascade",
    });
    Track.hasMany(models.Cart, {
      onDelete: "cascade",
    });
    Track.hasMany(models.Transactions, {
      onDelete: "cascade",
    });
  };

  return Track;
};
