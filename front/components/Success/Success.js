import React from "react";
import { useRouter } from "next/router";
import styles from "/styles/Home.module.css";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { fetchUser, isValid } from "/services/services.js";
const Success = () => {
  const router = useRouter();
  const [header, setHeader] = useState("");
  const { session } = router.query;

  useEffect(() => {
    fetchUser()
      .then((x) => {
        if (x.status && x.status === "NOT_AUTHORIZED") {
          window.location.href = "/login";
        } else {
          if (session) {
            isValid(session)
              .then((x) => {
                window.location.href = "/purchases";
              })
              .catch((x) => {
                console.log(x);
              });
          }
        }
      })
      .catch((x) => {
        console.log(x);
      });
  }, [session]);

  //   useEffect(() => {
  //     if (session) {
  //       isValid(session)
  //         .then((x) => {
  //           window.location.href = "/purchases";
  //         })
  //         .catch((x) => {
  //           console.log(x);
  //         });
  //     }
  //   }, [session]);
  return (
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
      Loading...
    </div>
  );
};

export default Success;
