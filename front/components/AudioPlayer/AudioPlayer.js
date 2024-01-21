import React, { useState, useRef, useEffect } from "react";
import styles from "/styles/audioPlayer.module.css";
import {
  FaBackward,
  FaForward,
  FaPlayCircle,
  FaPauseCircle,
} from "react-icons/fa";
import { useGlobalContext } from "../Layout.js";

const AudioPlayer = ({ defaultSong, song }) => {
  const { navbar, isPlaying, setIsPlaying, loadNew, setPrevSong, prev } =
    useGlobalContext();
  const [duration, setDuration] = useState(0);
  const [currTime, setCurrTime] = useState(0);
  const audioplayer = useRef();
  const progressBar = useRef();
  const animation = useRef();

  useEffect(() => {
    if (song) {
      const prevValue = isPlaying;
      setIsPlaying(!prevValue);
      if (prev.track === song.track && prevValue) {
        audioplayer.current.pause();
        cancelAnimationFrame(animation.current);
      } else if (prev.track === song.track && !prevValue) {
        audioplayer.current.play();
        animation.current = requestAnimationFrame(whilePlaying);
      } else if (audioplayer.current && song) {
        setIsPlaying(true);
        audioplayer.current.pause();
        audioplayer.current.load();
        audioplayer.current.play();
        animation.current = requestAnimationFrame(whilePlaying);
      }
    }
  }, [loadNew]);

  useEffect(() => {
    const seconds = Math.floor(audioplayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioplayer?.current?.loadmetadata, audioplayer?.current?.readyState]);

  const calculateTime = (sec) => {
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  };

  const back = () => {
    progressBar.current.value = Number(progressBar.current.value - 15);
    changeRange();
  };

  const forward = () => {
    progressBar.current.value = Number(progressBar.current.value + 1);
    changeRange();
  };

  const togglePlay = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioplayer.current.play();
      animation.current = requestAnimationFrame(whilePlaying);
    } else {
      audioplayer.current.pause();
      cancelAnimationFrame(animation.current);
    }
  };

  const whilePlaying = () => {
    if (!progressBar || !progressBar.current) return;
    progressBar.current.value = audioplayer?.current?.currentTime;
    progressBar?.current?.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrTime(progressBar.current.value);
    animation.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioplayer.current.currentTime = progressBar.current.value;
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrTime(progressBar.current.value);
  };

  return (
    <div
      style={{ display: `${navbar ? "none" : "block"}` }}
      className={styles.audioPlayer}
    >
      <audio
        key={song.id}
        ref={audioplayer}
        src={song.track ? song.track : defaultSong.track}
      ></audio>
      <div className={styles.topAudio}>
        <input
          style={{ zIndex: "100" }}
          onChange={changeRange}
          ref={progressBar}
          defaultValue="0"
          className={styles.progressBar}
          type="range"
        />
      </div>
      <div className={styles.btns}>
        <img
          width="83"
          height="83"
          //   style={{ maxWidth: "108%", maxHeight: "108%" }}
          src={song.img ? song.img : defaultSong.img}
          alt=""
        />
        <div
          className={styles.start}
          style={{ width: "100%", textAlign: "left", marginLeft: "13px" }}
        >
          {duration && !isNaN(duration) ? calculateTime(currTime) : ""}
        </div>
        <button>
          <FaBackward onClick={back} />
        </button>
        <button className={styles.play} onClick={togglePlay}>
          {!isPlaying ? <FaPlayCircle /> : <FaPauseCircle />}
        </button>
        <button>
          <FaForward onClick={forward} />
        </button>
        <div
          className={styles.duration}
          style={{ width: "100%", textAlign: "right", marginRight: "13px" }}
        >
          {duration && !isNaN(duration) ? calculateTime(duration) : ""}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
