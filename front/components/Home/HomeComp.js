import React from "react";
import { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "../Layout.js";
import axios from "axios";
import styles from "/styles/Home.module.css";
import Card from "./Card.js";
import DropDown from "./DropDown.js";
import { FaSearch, FaBeer, FaPlus, FaPaperPlane } from "react-icons/fa";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import AudioPlayer from "../AudioPlayer/AudioPlayer.js";
import {
  allBeats,
  trackTags,
  beatsByTags,
  tracksByTag,
  popularTracks,
  fetchUser,
  getCart,
  postCart,
  newFollower,
  getTheFollowers,
  newPlay,
  followers,
} from "/services/services.js";
import {
  fetchPopularTracks,
  allTags,
  fetchTrackByTags,
  fetchNewestTracks,
  addNewPlay,
} from "./fetchingData.js";
import { errorFunc, beatError, tagError, imgError } from "./HomeErrors.js";
const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [def, setDef] = useState("Most recent");
  const [openInput, setOpenInput] = useState(false);
  const {
    plays,
    setPlays,
    song,
    setTheSong,
    img,
    setImages,
    err,
    setErr,
    error,
    userObj,
    setUserObj,
    setError,
    setAllBeats,
    allBeats,
    defaultSong,
    setDefaultSong,
    tags,
    setTags,
    followers,
    setFollowers,
    typeBeat,
    setTypeBeat,
    loading,
    setNavbar,
    setLoading,
  } = useGlobalContext();
  const btnRef = useRef();
  const [isItLoading, setIsItLoading] = useState(true);
  const [searchQ, setSearch] = useState("");
  const [following, setFollowing] = useState(false);

  const inputref = useRef();

  const searchTags = (e) => {
    setSearch(e.target.value);
  };

  const followMe = () => {
    if (userObj.username) {
      newFollower()
        .then((x) => {
          if (x.status === "FOLLOWED") {
            setFollowing(true);
            setFollowers((prev) => prev + 1);
          } else {
            setFollowing(false);
            setFollowers((prev) => prev - 1);
          }
        })
        .catch((x) => {
          console.log(x);
        });
    } else {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (searchQ.replace(/\s+/g, "") === "") {
      fetchNewestTracks({
        defaultSong,
        setDefaultSong,
        loading,
        setLoading,
        plays,
        setPlays,
        error,
        setError,
        allBeats,
        setAllBeats,
      });
    } else {
      fetchTrackByTags({
        img,
        setImages,
        err,
        setErr,
        error,
        setAllBeats,
        setError,
        tag: searchQ,
      });
    }
  }, [searchQ]); //sends request to server as you start typing

  useEffect(() => {
    const closeDropDown = (e) => {
      if (e.path[0] !== btnRef.current) setIsOpen(false);
    };
    document.body.addEventListener("click", closeDropDown);

    return () => document.body.removeEventListener("click", closeDropDown);
  }, []); // for the drop down menu

  const getData = () => {
    return Promise.all([
      trackTags(),
      popularTracks(),
      getTheFollowers(),
      fetchUser(),
    ]);
  };

  useEffect(() => {
    getData()
      .then(([allTheTags, newestTracksSorted, allFollowers, theUser]) => {
        setUserObj(theUser);
        setTags(allTheTags);
        setFollowers(allFollowers.length);
        let lks = 0;
        newestTracksSorted.forEach((y) => {
          lks += y.plays;
        });
        setPlays(lks);
        let newData = newestTracksSorted.sort(
          (a, b) =>
            new Date().getTime() -
            new Date(a.createdAt).getTime() -
            (new Date().getTime() - new Date(b.createdAt).getTime())
        );
        setDefaultSong(newData[0]);
        setAllBeats(newData);
        allFollowers.forEach((person) => {
          if (person.username === theUser.username) {
            setFollowing(true);
          }
        });
        setIsItLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {!isItLoading ? (
        <div>
          <div className={styles.topCont}>
            <div className={styles.HomeCont}>
              <div className={styles.leftPannel}>
                <div className={styles.ttle}>
                  <div>Byalif</div>
                  <div>Flushing</div>
                </div>
                <div className={styles.followers}>
                  <div onClick={followMe}>
                    <FaPlus /> {following ? "Following" : "Follow"}
                  </div>
                  <div>
                    <FaPaperPlane />
                  </div>
                </div>
                <div className={styles.stats}>
                  <div style={{ color: "#6e6e6e", fontSize: "14px" }}>
                    STATS
                  </div>
                </div>
                <div>
                  <div>Followers</div>
                  <div>{followers}</div>
                </div>
                <div>
                  <div>Plays</div>

                  <div>{plays}</div>
                </div>
                <div>
                  <div>Tracks</div>
                  <div>{allBeats.length}</div>
                </div>
                <hr />
                <div>
                  <div className={styles.stats}>
                    <div style={{ color: "#6e6e6e", fontSize: "14px" }}>
                      ABOUT ME
                    </div>
                  </div>
                </div>
                <p style={{ marginTop: "-10px", fontSize: "15px" }}>
                  Producer from Queens, New York.
                </p>
              </div>
              <div className={styles.rightPannel}>
                <div
                  style={{ paddingBottom: "12px" }}
                  className={styles.topRight}
                >
                  <h4
                    style={{
                      paddingTop: "4px",
                      paddingLeft: "48px",
                      fontWeight: "600",
                      fontSize: "28px",
                    }}
                    className={styles.hide461}
                  >
                    TRACKS
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                    }}
                    className={styles.at461}
                  >
                    <input
                      placeholder="tags, titles etc.."
                      value={searchQ}
                      onChange={(e) => searchTags(e)}
                      ref={inputref}
                      className={`${
                        !openInput ? styles.openInput : styles.closeInput
                      }`}
                      style={{
                        fontSize: "14px",
                        padding: "0 12px",
                        borderRadius: "100px",
                        border: "2px solid #595959",
                        maxWidth: "130px",
                        marginRight: "7px",
                      }}
                      type="text"
                    />
                    <div
                      style={{
                        marginRight: "23px",
                      }}
                    >
                      <div
                        style={{
                          alignItems: "center",
                          display: "flex",
                          maxWidth: "300px",
                          minWidth: "135px",
                        }}
                      >
                        <FaSearch
                          onClick={() => {
                            setOpenInput((prev) => !prev);
                          }}
                          style={{ cursor: "pointer", marginRight: "7px" }}
                        />
                        <div
                          style={{
                            cursor: "pointer",
                            display: "flex",
                          }}
                          ref={btnRef}
                          onClick={() => setIsOpen((prev) => !prev)}
                          className={styles.btn}
                        >
                          Sort by: {def}
                        </div>
                      </div>
                    </div>
                    <DropDown
                      setAllBeats={setAllBeats}
                      setDef={setDef}
                      isOpen={isOpen}
                      error={error}
                      setError={setError}
                      setPlays={setPlays}
                      loading={loading}
                      setLoading={setLoading}
                      plays={plays}
                      allBeats={allBeats}
                    />
                  </div>
                </div>
                <input
                  placeholder="tags, titles etc.."
                  value={searchQ}
                  onChange={(e) => searchTags(e)}
                  ref={inputref}
                  className={`${
                    !openInput ? styles.openInput2 : styles.closeInput2
                  }`}
                  style={{
                    fontSize: "14px",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    border: "2px solid #595959",
                    maxWidth: "80%",
                    marginLeft: "40px",
                  }}
                  type="text"
                />
                <h4
                  style={{
                    paddingTop: "4px",
                    paddingLeft: "48px",
                    fontWeight: "600",
                    fontSize: "28px",
                    width: "330px",
                  }}
                  className={styles.show461}
                >
                  TRACKS
                </h4>
                {Array.isArray(allBeats) ? (
                  <div className={styles.grid}>
                    {allBeats.map((x) => {
                      return <Card track={x} />;
                    })}
                  </div>
                ) : (
                  <div style={{ marginTop: "10px" }}>
                    Could not find any tracks to match your searches. Try
                    removing some of the filters!
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.audioPlayer}>
            {song ? (
              <AudioPlayer
                style={{ zIndex: "101" }}
                defaultSong={defaultSong}
                song={song}
              />
            ) : (
              <AudioPlayer defaultSong={defaultSong} song="" />
            )}
          </div>
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
          Loading tracks. May take a few seconds
        </div>
      )}
    </>
  );
};

export default Home;
