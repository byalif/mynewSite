import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "/styles/purchases.module.css";
import axios from "axios";
import Card from "../Home/Purchase.js";
import { getCart, fetchUser, allPurchases } from "/services/services.js";
import { useGlobalContext } from "../Layout.js";
const Purchases = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const {
    setTotal,
    total,
    checkout,
    setCheckout,
    setIsPlaying,
    userObj,
    setUserObj,
  } = useGlobalContext();
  const [idx, setIdx] = useState({});
  useEffect(() => {
    fetchUser()
      .then((x) => {
        setUserObj(x);
        if (x.status && x.status === "NOT_AUTHORIZED") {
          window.location.href = "/login";
        } else {
          allPurchases()
            .then((beats) => {
              setIsLoading(false);
              setPurchases(beats);
              setIdx(beats[0]);
            })
            .catch((err) => {
              console.log(err);
            });
          getCart(x.id)
            .then((y) => {
              console.log(y);
              setCheckout(y);
              let ttl = 0;
              y.forEach((z) => (ttl += z.price));
              setTotal(ttl);
            })
            .catch((y) => {
              console.log(y);
            });
        }
      })
      .catch((x) => {
        console.log(x);
      });
  }, []);

  return (
    <div className={styles.container}>
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
        <div
          style={{ justifyContent: `${idx ? "" : "center"}` }}
          className={styles.cont}
        >
          {!idx ? (
            <div></div>
          ) : (
            <div className={styles.topLeft}>
              <div className={styles.leftHigh}>
                {idx && (
                  <div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "300",
                      }}
                    >
                      <b>{idx.title} </b>({idx.type})
                    </div>

                    <img
                      style={{
                        width: "200px",
                        height: "200px",
                        margin: "25px 0",
                      }}
                      height="100%"
                      src={idx.img}
                      alt=""
                    />
                  </div>
                )}
              </div>
              <div className={styles.leftLow}>
                {idx.MP3 && (
                  <div className={styles.files}>
                    <button
                      onClick={() => {
                        window.location.href = idx.MP3;
                      }}
                    >
                      Download MP3
                    </button>
                  </div>
                )}
                {idx.WAV && (
                  <div className={styles.files}>
                    <button
                      onClick={() => {
                        window.location.href = idx.WAV;
                      }}
                    >
                      Download WAV
                    </button>
                  </div>
                )}
                {idx.trackouts && (
                  <div className={styles.files}>
                    <button
                      onClick={() => {
                        window.location.href = idx.trackouts;
                      }}
                    >
                      Download Trackouts
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={styles.topLeft2}>
            <div className={styles.leftHigh}>
              {idx && (
                <div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "300",
                      marginRight: "15px",
                    }}
                  >
                    <b>{idx.title} </b>({idx.type})
                  </div>

                  <img
                    style={{
                      width: "110px",
                      height: "110px",
                      marginRight: "15px",
                      margin: "25px 0",
                    }}
                    height="100%"
                    src={idx.img}
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className={styles.leftLow}>
              {idx && idx.MP3 && (
                <div className={styles.files}>
                  <button
                    onClick={() => {
                      window.location.href = idx.MP3;
                    }}
                  >
                    Download MP3
                  </button>
                </div>
              )}
              {idx && idx.WAV && (
                <div className={styles.files}>
                  <button
                    onClick={() => {
                      window.location.href = idx.WAV;
                    }}
                  >
                    Download WAV
                  </button>
                </div>
              )}
              {idx && idx.trackouts && (
                <div className={styles.files}>
                  <button
                    onClick={() => {
                      window.location.href = idx.trackouts;
                    }}
                  >
                    Download Trackouts
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.topRight}>
            <div className={styles.high}>
              <div style={{ marginBottom: "10px" }}>
                <b>PURCHASED TRACKS</b> ({idx ? purchases.length : 0})
              </div>
            </div>
            {!idx ? (
              <div className={styles.l}>
                Your purchased beats will appear here after payment.
              </div>
            ) : (
              <div className={styles.low}>
                {Array.isArray(purchases) &&
                  purchases.map((x) => {
                    return <Card idx={idx} setIdx={setIdx} track={x} />;
                  })}
              </div>
            )}
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default Purchases;
