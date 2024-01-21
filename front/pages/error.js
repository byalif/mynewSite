import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import styles from "/styles/accCreated.module.css";
const error = () => {
  return (
    <Layout>
      <div className={styles.created}>Loading...</div>

      <div className={styles.created}>
        <h4>401</h4>
        <p>
          Were very sorry, it looks like something went wrong.. click{" "}
          <span>here</span> to register.
        </p>
      </div>
    </Layout>
  );
};

export default error;
