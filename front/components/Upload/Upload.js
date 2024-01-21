import React, { useEffect, useState } from "react";
// import FormData from "form-data";
import { fetchUser } from "/services/services.js";
import styles from "/styles/Home.module.css";
import { uploadTrack, trackData } from "/services/services.js";

const Upload = () => {
  const [loading, setLoading] = useState(true);
  const [postBody, setBody] = useState({
    title: "",
    img: "",
    bpm: "",
    genre: "",
  });
  const arr = [];
  const idx = 0;
  const [audio, setAudio] = useState({
    mp3_dl: null,
    mp3_display: null,
    trackouts: null,
    wav_dl: null,
  });

  const changeIt = (e) => {
    setBody((body) => {
      return {
        ...body,
        [e.target.name]: e.target.value,
      };
    });
  };

  const uWav = (e) => {
    setAudio((audio) => {
      let file = e.target.files[0];
      e.target.files = null;
      console.log(audio);
      return {
        ...audio,
        [e.target.name]: file,
      };
    });
  };

  const uploadIt = () => {
    setLoading(true);
    const audioData = new FormData();
    audioData.append("audio", audio.mp3_dl);
    audioData.append("name", audio.mp3_dl.name);
    audioData.append("audio", audio.mp3_display);
    audioData.append("name", audio.mp3_display.name);
    audioData.append("audio", audio.trackouts);
    audioData.append("name", audio.trackouts.name);
    audioData.append("audio", audio.wav_dl);
    audioData.append("name", audio.wav_dl.name);
    uploadTrack(audioData)
      .then((x) => {
        trackData({ ...postBody, ...x })
          .then((x) => {
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((x) => {
        console.log(x);
      });
  };

  // useEffect(() => {
  //   fetchUser().then((x) => {
  //     console.log(x);
  //     if (x.role && x.role === "Admin") {
  //       setLoading(false);
  //     } else {
  //       window.location.href = "/";
  //     }
  //   });
  // }, []);
  return (
    <div>
      {loading ? (
        <div>
          <div>
            <div>Title</div>
            <input
              onChange={(e) => changeIt(e)}
              value={postBody.title}
              name="title"
              type="text"
            />
          </div>
          <div>
            <div>img</div>
            <input
              onChange={(e) => changeIt(e)}
              value={postBody.img}
              name="img"
              type="text"
            />
          </div>
          <div>
            <div>BPM</div>
            <input
              onChange={(e) => changeIt(e)}
              value={postBody.bpm}
              name="bpm"
              type="text"
            />
          </div>
          <div>
            <div>genre</div>
            <input
              onChange={(e) => changeIt(e)}
              value={postBody.genre}
              name="genre"
              type="text"
            />
          </div>
          <div>
            <div>Downloadable WAV</div>
            <input
              onChange={(e) => uWav(e)}
              accept="audio/*"
              name="wav_dl"
              type="file"
            />
          </div>
          <div>
            <div>Downloadable MP3</div>
            <input
              onChange={(e) => uWav(e)}
              accept="audio/*"
              name="mp3_dl"
              type="file"
            />
          </div>
          <div>
            <div>Display MP3</div>
            <input
              onChange={(e) => uWav(e)}
              accept="audio/*"
              name="mp3_display"
              type="file"
            />
          </div>
          <div>
            <div>Trackouts</div>
            <input
              onChange={(e) => uWav(e)}
              accept="zip/*"
              name="trackouts"
              type="file"
            />
          </div>
          <button onClick={uploadIt}>Upload</button>
        </div>
      ) : (
        <div
          className={styles.loading2}
          style={{
            color: "black",
            padding: "10px",
            height: "100vh",
            fontSize: "16px",
            fontWeight: "300",
            letterSpacing: "1px",
          }}
        >
          Loading
        </div>
      )}
    </div>
  );
};

export default Upload;
