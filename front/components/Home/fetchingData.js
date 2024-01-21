import React from "react";
import { useGlobalContext } from "../Layout.js";
import axios from "axios";
import {
  allBeats,
  trackTags,
  beatsByTags,
  tracksByTag,
  popularTracks,
  fetchUser,
  getCart,
  postCart,
  newPlay,
  getTheFollowers,
} from "/services/services.js";
import { beatError } from "./HomeErrors.js";

export const getAllTags = ({ id, setTags, tags }) => {
  trackTags(id)
    .then((x) => {
      setTags(x);
    })
    .catch((x) => {
      console.log(x);
    });
};

export const fetchPopularTracks = ({
  error,
  setError,
  allBeats,
  setAllBeats,
  setPlays,
  loading,
  setLoading,
  plays,
}) => {
  popularTracks()
    .then((x) => {
      beatError({ loading, setLoading });
      setAllBeats(x);
      let lks = 0;
      x.forEach((y) => {
        lks += y.plays;
      });
      setPlays(lks);
    })
    .catch((x) => {
      setError({
        ...error,
        ["p"]: true,
      });
    });
};

export const fetchNewestTracks = ({
  defaultSong,
  setDefaultSong,
  error,
  setError,
  allBeats,
  setAllBeats,
  setPlays,
  plays,
  loading,
  setLoading,
}) => {
  popularTracks()
    .then((x) => {
      beatError({ loading, setLoading });
      let lks = 0;
      x.forEach((y) => {
        lks += y.plays;
      });
      setPlays(lks);
      let newData = x.sort(
        (a, b) =>
          new Date().getTime() -
          new Date(a.createdAt).getTime() -
          (new Date().getTime() - new Date(b.createdAt).getTime())
      );
      setDefaultSong(newData[0]);
      setAllBeats(newData);
    })
    .catch((x) => {
      setError({
        ...error,
        ["p"]: true,
      });
    });
};

export const fetchTrackByTags = ({
  img,
  setImages,
  error,
  setError,
  allBeats,
  setAllBeats,
  tag,
}) => {
  tracksByTag(tag)
    .then((x) => {
      setAllBeats(x);
      beatError({ loading, setLoading });
      const imgs = [];
      x.forEach((obj) => {
        imgs.push(obj.img);
      });
      setImages(imgs);
    })
    .catch((x) => {
      setError({
        ...error,
        ["i"]: true,
      });
    });
};

export const addNewPlay = (id) => {
  newPlay(id)
    .then((x) => {})
    .catch((x) => {
      console.log(x);
    });
};

export const allTags = ({ error, setError, tags, setTags }) => {
  beatsByTags()
    .then((x) => {
      setTags(x);
    })
    .catch((x) => {
      setError({
        ...error,
        ["t"]: true,
      });
    });
};

export const getFollowers = ({ error, setError, setFollowers }) => {
  followers()
    .then((x) => {
      setFollowers(x);
    })
    .catch((x) => {
      setError({
        ...error,
        ["f"]: true,
      });
    });
};
