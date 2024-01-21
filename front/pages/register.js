import { Layout } from "../components/Layout";
import Form from "../components/Register/FormComp";
import styles from "/styles/Register.module.css";

const Register = () => {
  return (
    <Layout>
      <div className={styles.whole}>
        <Form></Form>
      </div>
    </Layout>
  );
};

export default Register;
