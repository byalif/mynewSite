import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import styles from "/styles/accCreated.module.css";

const Redirect = () => {
  const [data, setData] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (!router.query.text) {
      router.push("/404");
    }
    setData(router.query.text);
  }, [router.query]);
  return (
    <Layout>
      {!data ? (
        <div className={styles.created}>Loading...</div>
      ) : (
        <div className={styles.created}>
          <h4>Thank you for registering!</h4>
          <p>{data}</p>
        </div>
      )}
    </Layout>
  );
};

export default Redirect;
