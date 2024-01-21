import { Layout } from "/components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "/styles/accCreated.module.css";
import { confirm } from "/services/services.js";
const Token = () => {
  const router = useRouter();
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");
  const { token } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      confirm(token)
        .then((x) => {
          console.log(x);
          if (x.data.status == "VALID") {
            setHeader("Account successfully created!");
            setLoading(false);
          } else if (x.data.status == "TOKEN_EXPIRED") {
            setHeader("Oops..");
            setText("Expired link. Try again");
            setLoading(false);
          } else if (x.data.status == "FAILED") {
            setHeader("Oops..");
            setText("Your account is already verified!");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);
  return (
    <Layout>
      {loading ? (
        <div className={styles.created}>Loading...</div>
      ) : (
        <div className={styles.created}>
          <h4>{header}</h4>
          {text ? (
            <p>{text}</p>
          ) : (
            <p>
              click <Link href="/login">here</Link> to login!
            </p>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Token;
