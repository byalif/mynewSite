import { Layout } from "../components/Layout";
import LoginComp from "../components/Login/LoginComp.js";
import styles from "/styles/Register.module.css";
const Login = () => {
  return (
    <Layout>
      <div className={styles.whole}>
        <LoginComp></LoginComp>
      </div>
    </Layout>
  );
};

export default Login;
