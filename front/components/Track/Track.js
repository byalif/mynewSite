import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { trackTags, confirm, fetchUser, addLike } from "/services/services.js";
import styles from "/styles/page.module.css";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import stylesA from "/styles/audioPlayer.module.css";
import AudioPlayer from "/components/AudioPlayer/AudioPlayer.js";
import {
  trackById,
  postCart,
  getCart,
  getComments,
  addComments,
  deleteComments,
  likeACom,
} from "/services/services.js";
import { BsFillCartFill, BsCartDash } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { RiThumbUpFill } from "react-icons/ri";
import { MdSend, MdComment, MdDownload, MdPersonPin } from "react-icons/md";
import { useGlobalContext } from "../Layout.js";
import {
  FaPlay,
  FaHeart,
  FaRepost,
  FaRetweet,
  FaComment,
} from "react-icons/fa";
import { getAllTags } from "../Home/fetchingData.js";
const Track = () => {
  const {
    setTotal,
    total,
    checkout,
    setCheckout,
    setIsPlaying,
    userObj,
    clicked,
    setClicked,
    setUserObj,
  } = useGlobalContext();
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [touch, setTouch] = useState(false);
  const [header, setHeader] = useState("");
  const [usage, setUsage] = useState(true);
  const [text, setText] = useState("");
  const [commentLikes, setCommentLikes] = useState(0);
  const { id } = router.query;
  const [pageId, setPageId] = useState("");
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [idx, setIdx] = useState(0);
  const set = new Set();
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const arr = [];
  const [newComment, setnewComment] = useState("");

  const addComLike = ({ theId }) => {
    console.log(theId);
    if (userObj.username && id) {
      likeACom(theId)
        .then((x) => {
          console.log(x);
          getComments(id).then((y) => {
            let temp = y;
            temp.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            console.log(y);
            setComments(temp);
          });
        })
        .catch((x) => {
          console.log(x);
        });
    }
  };

  const sendCom = (comment, trackId) => {
    if (userObj && userObj.id) {
      addComments(comment, trackId)
        .then((x) => {
          console.log(x);
          let temp = comments;
          temp = [
            ...comments,
            {
              comment: newComment,
              createdAt: new Date(),
              UserId: userObj.id,
              TrackId: data.id,
              username: userObj.username,
            },
          ];
          temp.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setComments(temp);
          setnewComment("");
        })
        .catch((x) => {
          console.log(x);
        });
    } else {
      window.location.href = "/login";
    }
  };

  const getTme = (time) => {
    let hour = Math.round(time * 24);
    let minutes = Math.floor(time * 24 * 60);
    if (minutes > 1 && minutes < 60) return `${minutes}m`;
    else if (minutes < 1) return `${minutes}m`;
    else if (minutes == 1) return `${minutes}m`;
    else if (hour >= 24) return `${Math.ceil(time)}d`;
    return `${hour}h`;
  };

  const check = ({ username }) => {
    data.Likes.forEach((x) => {
      if (x.username === username) {
        console.log("matched");
        setLiked(true);
        return;
      }
    });
  };

  const addALike = () => {
    if (!userObj.username) {
      window.location.href = "/login";
    } else {
      if (id) {
        setLength((prev) => {
          if (liked) return prev - 1;
          return prev + 1;
        });
        setLiked((prev) => !prev);
        addLike(id)
          .then((x) => {
            console.log(x);
          })
          .catch((x) => {
            console.log(x);
          });
      }
    }
  };

  const [cart, setCart] = useState({
    type: "Basic License",
    price: 25,
    copies: 2000,
    streams: 500000,
    videos: 1,
  });

  const addToCart = () => {
    if (id) {
      if (!userObj.username) {
        window.location.href = "/login";
      } else {
        setClicked((prev) => !prev);
        setTouch((prev) => !prev);
        let temp = [];
        temp = checkout.filter((x) => x.TrackId != data.id);
        setCheckout([
          ...temp,
          {
            TrackId: data.id,
            MP3: data.MP3,
            WAV: data.WAV,
            img: data.img,
            trackouts: data.trackouts,
            type: cart.type,
            price: cart.price,
            UserId: userObj.id,
            title: data.title,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    let ttl = 0;
    checkout.forEach((z) => (ttl += z.price));
    setTotal(ttl);
    if (userObj.username && pageId) {
      postCart({
        TrackId: data.id,
        UserId: userObj.id,
        type: cart.type,
        img: data.img,
        title: data.title,
        price: cart.price,
        MP3: data.MP3,
        WAV: data.WAV,
        trackouts: data.trackouts,
      });
    }
  }, [touch]);

  const getData = () => {
    const promises = [];
    let index = 0;
    if (id) {
      promises[index++] = trackTags(id);
      promises[index++] = trackById(id);
      promises[index++] = fetchUser();
      promises[index++] = getComments(id);
    }
    return Promise.all(promises);
  };

  useEffect(() => {
    if (id) {
      setPageId(id);
      getData()
        .then(([theTags, theTrack, theUser, theComments]) => {
          setIsLoading(false);
          console.log("????");
          setTags(theTags);
          setLength(theTrack.Likes.length);
          console.log(theTrack);
          setData(theTrack);
          setComments(() => {
            let coms = theComments.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            return coms;
          });
          console.log(theComments);
          if (theUser.status && theUser.status === "NOT_AUTHORIZED") return;

          theTrack.Likes.forEach((likers) => {
            if (theUser.username === likers.username) {
              setLiked(true);
            }
          });
          setUserObj(theUser);
          getCart(theUser.id)
            .then((theCart) => {
              setCheckout(theCart);
              let ttl = 0;
              theCart.forEach((z) => (ttl += z.price));
              setTotal(ttl);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  return (
    <>
      {isLoading ? (
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
      ) : (
        <div>
          <div className={styles.container}>
            <div className={styles.cont}>
              <div className={styles.leftPannel}>
                <div className={styles.topOne}>{data.title}</div>
                <div className={styles.botOne}>Byalif</div>
                <img
                  style={{ maxHeight: "250px", maxWidth: "250px" }}
                  height="100%"
                  width="100%"
                  src={data.img}
                  alt=""
                />
                <div
                  style={{
                    display: "flex",
                  }}
                  className={styles.icons}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaPlay
                      style={{
                        cursor: "pointer",
                        marginRight: "2px",
                        padding: "0 2px",
                      }}
                    />{" "}
                    {data.plays}
                  </div>

                  <div
                    style={{
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaHeart
                      onClick={addALike}
                      style={{
                        color: `${liked ? "#a12828" : "black"}`,
                        cursor: "pointer",
                        marginRight: "3px",
                      }}
                    />
                    {length}
                  </div>
                  {/* <div>
                <FaRetweet
                  style={{ marginRight: "3px", marginBottom: "4px" }}
                />
                0
              </div> */}
                  <div
                    style={{
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaComment style={{ marginRight: "3px" }} />
                    {comments.length}
                  </div>
                </div>
                <div className={styles.btn}>
                  <a
                    onClick={() => {
                      if (userObj.username) {
                        window.location.href = data.MP3;
                      } else {
                        window.location.href = "/login";
                      }
                    }}
                  >
                    <MdDownload
                      style={{ fontSize: "24px", marginRight: "4px" }}
                    />
                    Download for free
                  </a>
                </div>
                <hr />
                <div className={styles.ttle}>INFORMATION</div>
                <div className={styles.info}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Published</span>{" "}
                    <span>{new Date(data.createdAt).toDateString()}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>BPM</span>
                    <span>{data.bpm}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Genre</span>
                    <span>{data.genre}</span>
                  </div>
                  <hr />
                  <div className={styles.ttle}>TAGS</div>
                  <div style={{ display: "flex", justifyContent: "left" }}>
                    {tags.map((x) => {
                      return <p className={styles.tag}>#{x.type}</p>;
                    })}
                  </div>
                </div>
              </div>
              <div
                style={{ position: "relative" }}
                className={styles.rightPannel}
              >
                <div style={{ overflow: "hidden" }} className={styles.rightTop}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div className={styles.rightTtle}>Licensing</div>
                    <div className={styles.hide500}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ marginRight: "18px" }}>
                          <div style={{ fontSize: "12px" }}>TOTAL:</div>
                          <div style={{ fontWeight: "500" }}>
                            ${cart.price}.00
                          </div>
                        </div>
                        <div style={{ cursor: "pointer" }}>
                          <button
                            onClick={addToCart}
                            className={styles.btn2}
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <BsCartDash
                              style={{ fontSize: "18px", marginTop: "-2px" }}
                            />
                            <div
                              style={{ fontSize: "16px", fontWeight: "300" }}
                            >
                              Add to Cart
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.body}>
                    <div
                      className={`${
                        idx == 0 ? styles.highlighted : styles.child
                      }`}
                      onClick={() => {
                        setIdx(0);
                        setCart({
                          copies: 2000,
                          streams: 500000,
                          videos: 1,
                          type: "Basic License",
                          price: 25,
                        });
                      }}
                    >
                      <div>Basic License</div>
                      <div style={{ fontSize: "15px" }}>${data.basic}.00</div>
                      <div style={{ fontSize: "12px" }}>MP3</div>
                    </div>
                    <div
                      className={`${
                        idx == 1 ? styles.highlighted : styles.child
                      }`}
                      onClick={() => {
                        setIdx(1);
                        setCart({
                          copies: 4000,
                          streams: 500000,
                          videos: 1,
                          type: "Premium License",
                          price: 45,
                        });
                      }}
                    >
                      <div>Premium License</div>
                      <div style={{ fontSize: "15px" }}>${data.premium}.00</div>
                      <div style={{ fontSize: "12px" }}>MP3 + WAV</div>
                    </div>
                    {data.trackouts && (
                      <div
                        className={`${
                          idx == 2 ? styles.highlighted : styles.child
                        }`}
                        onClick={() => {
                          setIdx(2);
                          setCart({
                            copies: 10000,
                            streams: 1000000,
                            videos: 1,
                            type: "Trackout License",
                            price: 80,
                          });
                        }}
                      >
                        <div>Trackout License</div>
                        <div style={{ fontSize: "15px" }}>$80.00</div>
                        <div style={{ fontSize: "12px" }}>
                          MP3 + WAV + TRACKOUTS
                        </div>
                      </div>
                    )}
                    {data.trackouts && (
                      <div
                        className={`${
                          idx == 3 ? styles.highlighted : styles.child
                        }`}
                        onClick={() => {
                          setIdx(3);
                          setCart({
                            copies: "UNLIMITED",
                            streams: "UNLIMITED",
                            videos: "UNLIMITED",
                            type: "Unlimited License",
                            price: 100,
                          });
                        }}
                      >
                        <div>Unlimited License</div>
                        <div style={{ fontSize: "15px" }}>$100.00</div>
                        <div style={{ fontSize: "12px" }}>
                          MP3 + WAV + TRACKOUTS
                        </div>
                      </div>
                    )}
                    {data.trackouts && (
                      <div
                        className={`${
                          idx == 4 ? styles.highlighted : styles.child
                        }`}
                        onClick={() => {
                          setIdx(4);
                          setCart({
                            copies: "UNLIMITED",
                            streams: "UNLIMITED",
                            videos: "UNLIMITED",
                            type: "Exclusive License",
                            price: data.exclusive,
                          });
                        }}
                      >
                        <div>Exclusive License</div>
                        <div style={{ fontSize: "15px" }}>
                          ${data.exclusive}.00
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          MP3 + WAV + TRACKOUTS
                        </div>
                      </div>
                    )}
                    <div
                      className={styles.show500}
                      style={{ marginRight: "18px" }}
                    >
                      <div style={{ fontWeight: "600", fontSize: "20px" }}>
                        TOTAL:
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: "400" }}>
                        ${cart.price}.00
                      </div>
                    </div>
                    <div
                      className={styles.show500}
                      style={{ cursor: "pointer" }}
                    >
                      <button
                        onClick={addToCart}
                        className={styles.btn2}
                        style={{
                          width: "94%",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BsCartDash
                          style={{ fontSize: "18px", marginTop: "-2px" }}
                        />
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "300",
                          }}
                        >
                          Add to Cart
                        </div>
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.rightTtle}>
                    <div style={{ display: "flex" }}>
                      <div>Usage terms</div>
                      <div>
                        <BiChevronDown />
                      </div>
                    </div>

                    <div
                      style={{ marginTop: "20px", fontSize: "17px" }}
                    >{`${cart.type} ($${cart.price}.00)`}</div>
                    <div className={styles.usage}>
                      <div> - USED FOR MUSIC RECORDING</div>
                      <div> - DISTRIBUTE UP TO {cart.copies} COPIES</div>
                      <div>- {cart.streams} ONLINE AUDIO STREAMS</div>
                      <div>- {cart.videos} MUSIC VIDEO</div>
                      <div> - FOR PROFIT LIVE PERFORMANCES</div>
                      <div> - RADIO BROADCASTING RIGHTS</div>
                    </div>
                  </div>
                </div>
                <div className={styles.rightBottom}>
                  <div className={styles.rightTtle}>
                    <div>Comments</div>
                  </div>
                  <div
                    style={{
                      paddingBottom: "10px",
                      borderBottom: "1px solid #b0b0b0",
                    }}
                    className={styles.bottomttle}
                  >
                    <div>
                      <MdComment
                        style={{
                          color: "#3f403f",
                          fontSize: "42px",
                        }}
                      />
                    </div>
                    <div className={styles.send}>
                      <input
                        value={newComment}
                        onChange={(x) => setnewComment(x.target.value)}
                        placeholder="Share your thoughts..."
                        type="text"
                      />
                    </div>
                    <div>
                      <MdSend
                        onClick={() => {
                          sendCom(newComment, data.id);
                        }}
                        style={{
                          cursor: "pointer",
                          borderRadius: "50%",
                          fontSize: "35px",
                          padding: "7px",
                          color: "#c9c9c9",
                          backgroundColor: "#4d4d4d",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{ marginTop: "-1px" }}
                    className={styles.commentBox}
                  >
                    {comments.length > 0 ? (
                      comments.map((x) => {
                        return (
                          <div style={{ marginBottom: "20px" }}>
                            <div
                              style={{
                                display: "flex",
                                // alignItems: "center",
                              }}
                            >
                              <div>
                                <MdPersonPin
                                  style={{
                                    marginTop: "4px",
                                    marginRight: "13px",
                                    fontSize: "48px",
                                  }}
                                />
                              </div>
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      marginRight: "15px",
                                      fontWeight: "500",
                                      fontSize: "18px",
                                    }}
                                  >
                                    {x.username}
                                  </div>
                                  <div
                                    style={{
                                      marginRight: "15px",
                                      fontWeight: "300",
                                      fontSize: "15px",
                                    }}
                                  >
                                    {getTme(
                                      (new Date().getTime() -
                                        new Date(x.createdAt).getTime()) /
                                        (1000 * 3600 * 24)
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={styles.wrap}
                                  style={{
                                    margin: "3px 0",
                                    fontWeight: "400",
                                  }}
                                >
                                  {x.comment}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <RiThumbUpFill
                                      onClick={() => {
                                        addComLike({ theId: x.id });
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        marginRight: "3px",
                                        fontWeight: "600",
                                        fontSize: "19px",
                                      }}
                                    />
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        marginRight: "18px",
                                      }}
                                    >
                                      {Array.isArray(x.CommentLikes)
                                        ? x.CommentLikes.length
                                        : 0}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: "14px" }}>REPLY</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ marginBottom: "100px" }}>
                        No comments yet! Share something :)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ position: "fixed", bottom: "0" }}
            className={stylesA.audioPlayer}
          >
            <AudioPlayer defaultSong={data} song={data} />
          </div>
        </div>
      )}
    </>
  );
};

export default Track;
