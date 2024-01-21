const express = require("express");
const { verifyToken } = require("../middleware/Verify.js");
const router = express.Router();
const multer = require("multer");
const { memoryStorage } = require("multer");
const storage = memoryStorage();
const upload = multer({ storage });

const {
  uploadData,
  getComments,
  allTracks,
  beatsByTags,
  specificTag,
  mostPopular,
  uploadTrack,
  addTagToBeat,
  allTagsOfATrack,
  trackById,
  likeAPost,
  updatePlay,
  likeACom,
  addComment,
  deleteComment,
} = require("../controller/tracks.js");

//All tracks
router.get("/", allTracks);

//All beatsByTags
router.get("/beatsByTags", beatsByTags);

//Tracks with specific tag
router.get("/tracks/:tag", specificTag);

//Most popular tracks in order
router.get("/popular", mostPopular);

//Upload a new track
router.post("/upload", upload.array("audio", 4), uploadTrack);

//Upload data of track
router.post("/upload/data", uploadData);

//Add a new tag to existing track
router.post("/tags", addTagToBeat);

//All tags of a specific track
router.get("/tags/:id", allTagsOfATrack);

//Add a like
router.get("/likes/:trackId", verifyToken, likeAPost);

//Add a Comment like
router.get("/likes/comment/:comId", verifyToken, likeACom);

//Add a play
router.post("/plays/:id", updatePlay);

//track by Id
router.get("/getTrack/:id", trackById);

//add comment to track
router.post("/addComment", verifyToken, addComment);

//delete comment
router.post("/deleteComment", verifyToken, deleteComment);

//getComments
router.get("/getComments/:trackId", getComments);

module.exports = router;
