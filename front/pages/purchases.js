import { Layout } from "../components/Layout";
import Purchases from "../components/Purchases/Purchases.js";
import styles from "/styles/Register.module.css";
const Login = () => {
  return (
    <Layout>
      <div className={styles.whole}>
        <Purchases></Purchases>
      </div>
    </Layout>
  );
};

export default Login;
