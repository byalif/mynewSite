import { Layout } from "../components/Layout";
import Upload from "../components/Upload/Upload.js";
import styles from "/styles/Register.module.css";
const UploadComp = () => {
  return (
    <Layout>
      <div className={styles.whole}>
        <Upload></Upload>
      </div>
    </Layout>
  );
};

export default UploadComp;
