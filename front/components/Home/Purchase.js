import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "/styles/Track.module.css";
import { useGlobalContext } from "../Layout.js";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { addNewPlay } from "./fetchingData.js";
const Card = ({ idx, setIdx, track }) => {
  const router = useRouter();

  const { isPlaying, loadNew, setLoadNew, song, setTheSong, setPrevSong } =
    useGlobalContext();

  return (
    <div style={{ zIndex: "0" }} className={styles.cont}>
      <div className={styles.cardPlay}></div>
      <img
        onClick={() => {
          setIdx(track);
        }}
        className={`${idx.id === track.id ? styles.selected : styles.img}`}
        style={{ cursor: "pointer" }}
        width="210"
        height="210"
        src={track.img}
      />
      <div
        style={{
          marginTop: "8px",
          fontSize: "17px",
          textAlign: "center",
          boxShadow: `${
            idx.id == track.id ? "0px 3px 2px rgba(0,0,0,0.4)" : "none"
          }`,
          backgroundColor: "#b5c2c7",
        }}
      >
        {track.title}
      </div>
    </div>
  );
};

export default Card;
