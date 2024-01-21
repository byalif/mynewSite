const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const {
  Track,
  Tags,
  Likes,
  Comments,
  CommentLike,
  Reply,
} = require("../models");
const querystring = require("querystring");
const { verifyToken } = require("../middleware/Verify");
const bucket = `${process.env.BUCKET}`;
const AWS_ACCESS_ID = `${process.env.AWS_ACCESS_ID}`;
const AWS_SECRET_ACCESS_KEY = `${process.env.AWS_SECRET_ACCESS_KEY}`;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const uploadAudio = (filename, bucketName, file, type) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: filename,
      Bucket: bucketName,
      Body: file,
      ContentType: type,
      ACL: "public-read",
    };
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.allTracks = async (req, res) => {
  const tracks = await Track.findAll({ include: [Tags, Likes] });
  res.json(tracks);
};

exports.beatsByTags = async (req, res) => {
  const tracks = await Track.findAll({ include: [Tags, Likes] });

  let map = new Map();
  tracks.forEach((z) => {
    z.Tags.forEach((g) => {
      if (map.has(g.type)) {
        let arr = map.get(g.type);
        arr.push(z);
        map.set(g.type, arr);
      } else {
        let arr = [];
        arr.push(z);
        map.set(g.type, arr);
      }
    });
  });

  const arr = [...map].map(([name, value]) => ({ name, value }));
  res.json(arr);
};

exports.specificTag = async (req, res) => {
  const tracks = await Track.findAll({ include: [Tags, Likes] });

  const { tag } = req.params;

  let tagg = tag.toUpperCase();
  tagg = tagg.replace(/\s+/g, ""); //replace space for search optimization
  let arr = [];
  const set = new Set();
  tracks.forEach((x) => {
    x.Tags.forEach((y) => {
      let str = y.type.toUpperCase();
      let str2 = x.title.toUpperCase();
      str = str.replace(/\s+/g, "");
      str2 = str2.replace(/\s+/g, ""); //replace space for search optimization
      if (str.includes(tagg) || str2.includes(tagg)) {
        console.log(str + " " + str2);
        set.add(x);
      }
    });
  });

  arr = [...set];

  if (!Array.isArray(arr) || !arr.length) {
    res.json({ status: "NOT_FOUND" });
    return;
  }
  res.json(arr);
};

exports.mostPopular = async (req, res) => {
  const sorted = await Track.findAll({ include: [Tags, Likes] });
  sorted.sort((a, b) => b.plays - a.plays);
  res.json(sorted);
};

exports.uploadTrack = async (req, res) => {
  let wavttle = req.files[0].originalname; //downloadable wav
  let mp3ttle = req.files[1].originalname; //downloadable mp3
  let dismp3 = req.files[2].originalname; //displayable file
  let zip = req.files[3].originalname; //zip file
  dismp3 = dismp3.substring(0, dismp3.length - 5) + "display.mp3";

  console.log(zip);
  const promises = [
    uploadAudio(wavttle, `byalif`, req.files[0].buffer),
    uploadAudio(mp3ttle, `byalif`, req.files[1].buffer),
    uploadAudio(zip, `byalif`, req.files[3].buffer),
    uploadAudio(dismp3, `byalif`, req.files[2].buffer, "audio/mp3"),
  ];

  Promise.all(promises).then(([wav, mp3, zipFile, display]) => {
    res.json({
      wavLink: wav.Location,
      displayLink: display.Location,
      mp3Link: mp3.Location,
      zipLink: zipFile.Location,
    });
  });
};

exports.uploadData = async (req, res) => {
  const { title, img, bpm, genre, zipLink, displayLink, mp3Link, wavLink } =
    req.body;
  postBody = {
    trackouts: zipLink,
    track: displayLink,
    MP3: mp3Link,
    WAV: wavLink,
    title: title,
    img: img,
    bpm: bpm,
    genre: genre,
  };

  Track.create(postBody).then((x) => {
    res.json(postBody);
  });
};

exports.addTagToBeat = async (req, res) => {
  const { type, id } = req.body;
  const tagged = await Tags.create({ type, TrackId: id });
  res.json(tagged);
};

exports.allTagsOfATrack = async (req, res) => {
  const { id } = req.params;
  const tags = await Tags.findAll({ where: { TrackId: id } });
  res.json(tags);
};

exports.updatePlay = async (req, res) => {
  const { id } = req.params;
  const trak = await Track.findByPk(id);
  let newPlays = trak.plays + 1;
  await Track.update({ plays: newPlays }, { where: { id: id } });
  res.json({ Status: "Played" });
};

exports.likeAPost = async (req, res) => {
  const { trackId } = req.params;
  const { id, username } = req.user;
  const like = await Likes.findOne({
    where: { UserId: id, TrackId: trackId },
  });
  if (like != null) {
    Likes.destroy({
      where: { UserId: id, TrackId: trackId },
    });
    res.json({ Status: "UNLIKED" });
    return;
  }

  Likes.create({ UserId: id, username: username, TrackId: trackId });
  res.json({ Status: "LIKED" });
  return;
};

exports.trackById = async (req, res) => {
  const { id } = req.params;
  const track = await Track.findByPk(id, { include: [Tags, Likes] });
  res.json(track);
};

exports.addComment = async (req, res) => {
  const { id, username } = req.user;
  const { comment, trackId } = req.body;
  await Comments.create({
    username: username,
    comment: comment,
    TrackId: trackId,
    UserId: id,
  });
  res.json({ status: "ADDED" });
};

exports.getComments = async (req, res) => {
  const { trackId } = req.params;
  const comments = await Comments.findAll({
    where: { TrackId: trackId },
    include: [CommentLike],
  });
  res.json(comments);
};

exports.deleteComment = async (req, res) => {
  const { id } = req.user;
  const { commentId } = req.body;
  await Comments.destroy({ where: { UserId: id, id: commentId } });
  res.json({ status: "DELETED" });
};

exports.likeACom = async (req, res) => {
  const { id, username } = req.user;
  const { comId } = req.params;

  const like = await CommentLike.findOne({
    where: {
      UserId: id,
      CommentId: comId,
    },
  });
  if (like != null) {
    await CommentLike.destroy({
      where: { UserId: id, CommentId: comId },
    });
    res.json({ Status: "UNLIKED" });
    return;
  }

  await CommentLike.create({
    CommentId: comId,
    UserId: id,
    username: username,
  });
  res.json({ Status: "LIKED" });
  return;
};
