import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "/styles/Track.module.css";
import { useGlobalContext } from "../Layout.js";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { addNewPlay } from "./fetchingData.js";
const Card = ({ track }) => {
  const router = useRouter();
  const { isPlaying, loadNew, setLoadNew, song, setTheSong, setPrevSong } =
    useGlobalContext();
  return (
    <div style={{ zIndex: "0" }} className={styles.cont}>
      <div
        onClick={() => {
          setLoadNew(!loadNew);
          setPrevSong(song);
          setTheSong(track);
        }}
        style={{
          cursor: "pointer",
          display: `${song.track == track.track ? "inline-block" : "none"}`,
        }}
        className={styles.cardPlay}
      >
        {isPlaying ? (
          <FaPauseCircle />
        ) : (
          <FaPlayCircle
            onClick={() => {
              addNewPlay(track.id);
            }}
          />
        )}
      </div>
      <img
        onClick={() => {
          if (song.track === track.track) {
            router.push(`/track/${track.title}/${track.id}`);
          } else {
            addNewPlay(track.id);
            setLoadNew(!loadNew);
            setPrevSong(song);
            setTheSong(track);
          }
        }}
        width="210"
        height="210"
        src={track.img}
      />
      <div className={styles.price}>
        <div style={{ color: "blue" }}>{"$" + track.basic + ".00"}</div>
        <div>{track.bpm + " BPM"}</div>
      </div>
      <div style={{ fontSize: "17px" }}>{track.title}</div>
    </div>
  );
};

export default Card;
