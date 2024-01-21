import axios from "axios";

// const url = `https://beat-website.herokuapp.com`;
// const url = `https://cors-everywhere.herokuapp.com/http://ec2-18-209-43-100.compute-1.amazonaws.com:8000`;
const url = `http://mysite-env.eba-z6gx6yiu.us-east-2.elasticbeanstalk.com/api`;
//Log in user
export const logIn = async (user) => {
  const fetched = await axios.post(`${url}/auth/login`, user);
  return fetched;
};

//Register user
export const register = async (user) => {
  const fetched = await axios.post(`${url}/auth/register`, user);
  return fetched;
};

//Confirmed registration
export const confirm = async (token) => {
  const fetched = await axios.post(`${url}/auth/createAccount/${token}`);
  return fetched;
};

//Fetch all my beats
export const allBeats = async () => {
  const fetched = await axios.get(`${url}/users/1`);
  return fetched.data.Tracks;
};

//fetch track by Id
export const trackById = async (id) => {
  const fetched = await axios.get(`${url}/tracks/getTrack/${id}`);
  return fetched.data;
};

//Fetch all tags
export const beatsByTags = async () => {
  const fetched = await axios.get(`${url}/tracks/beatsByTags`);
  return fetched.data;
};

//Fetch tags of specific track by [TrackId]
export const trackTags = async (id) => {
  const fetched = await axios.get(`${url}/tracks/tags/${id}`);
  return fetched.data;
};

//Fetch tracks by [tags]
export const tracksByTag = async (tag) => {
  const fetched = await axios.get(`${url}/tracks/tracks/${tag}`);
  return fetched.data;
};

//Fetch most popular tracks
export const popularTracks = async (tag) => {
  const fetched = await axios.get(`${url}/tracks/popular`);
  return fetched.data;
};

//Fetch most popular tracks
export const mostLiked = async (tag) => {
  const fetched = await axios.get(`${url}/tracks/mostLiked`);
  return fetched.data;
};

//New follower
export const newFollower = async () => {
  const fetched = await axios.get(`${url}/auth/newFollower`, {
    headers: { accessToken: localStorage.getItem("token") },
  });
  return fetched.data;
};

//Get followers
export const getTheFollowers = async () => {
  const fetched = await axios.get(`${url}/auth/followers`);
  return fetched.data;
};

//addPlay
export const newPlay = async (id) => {
  const fetched = await axios.post(`${url}/tracks/plays/${id}`);
  return fetched.data;
};

//add a like
export const addLike = async (id) => {
  const fetched = await axios.get(`${url}/tracks/likes/${id}`, {
    headers: { accessToken: localStorage.getItem("token") },
  });
  return fetched.data;
};

//post Cart data
export const postCart = async ({
  TrackId,
  UserId,
  type,
  title,
  price,
  MP3,
  img,
  WAV,
  trackouts,
}) => {
  const fetched = await axios.post(`${url}/cart/addItems`, {
    TrackId,
    UserId,
    title,
    type,
    price,
    MP3,
    img,
    WAV,
    trackouts,
  });
  return fetched.data;
};

//fetch Cart data
export const getCart = async (id) => {
  const fetched = await axios.get(`${url}/cart/getItems/${id}`);
  return fetched.data;
};

//fetch User
export const fetchUser = async () => {
  const fetched = await axios.get(`${url}/auth`, {
    headers: { accessToken: localStorage.getItem("token") },
  });
  return fetched.data;
};

//checkout
export const checkoutItems = async () => {
  const fetched = await axios.get(`${url}/cart/checkout`, {
    headers: { accessToken: localStorage.getItem("token") },
  });
  return fetched.data;
};

//success page
export const isValid = async (session) => {
  const fetched = await axios.get(`${url}/cart/check/${session}`, {
    headers: { accessToken: localStorage.getItem("token") },
  });
  return fetched.data;
};

//fetch allPurchases
export const allPurchases = async () => {
  const fetched = await axios.get(`${url}/cart/purchases`, {
    headers: { accessToken: localStorage.getItem("token") },
  });
  return fetched.data;
};

//comment on track
export const addComments = async (comment, trackId) => {
  const fetched = await axios.post(
    `${url}/tracks/addComment`,
    { comment: comment, trackId: trackId },
    {
      headers: { accessToken: localStorage.getItem("token") },
    }
  );
  return fetched.data;
};

//delete comment
export const deleteComments = async (id) => {
  const fetched = await axios.post(
    `${url}/tracks/deleteComment`,
    {
      headers: { accessToken: localStorage.getItem("token") },
    },
    { commentId: id }
  );
  return fetched.data;
};

//get comments
export const getComments = async (id) => {
  const fetched = await axios.get(`${url}/tracks/getComments/${id}`);
  return fetched.data;
};

//Like a comment
export const likeACom = async (comId) => {
  const fetched = await axios.get(`${url}/tracks/likes/comment/${comId}`, {
    headers: { accessToken: localStorage.getItem("token") },
  });
  return fetched.data;
};

//upload trak
export const uploadTrack = async (audioData, postBody) => {
  const fetched = await axios.post(`${url}/tracks/upload`, audioData);
  return fetched.data;
};

//track meta data
export const trackData = async (postBody) => {
  const fetched = await axios.post(`${url}/tracks/upload/data`, postBody);
  return fetched.data;
};

//track meta data
export const deleteItem = async (id) => {
  const fetched = await axios.delete(`${url}/cart/deleteItems/${id}`, {
    headers: { accessToken: localStorage.getItem("token") },
  });
  return fetched.data;
};
