import React, { useEffect, useState, useRef } from "react";
import Check from "../Register/Check.js";
import axios from "axios";
import Link from "next/link";
import styles from "/styles/Register.module.css";
import { logIn } from "/services/services.js";
import { useGlobalContext } from "../Layout.js";
const Login = () => {
  const [submit, setSubmit] = useState(false);
  const { navbar, setNavbar, setUserObj, userObj } = useGlobalContext();
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [check, setCheck] = useState({
    email: "VALID",
    password: "VALID",
  });
  const psw = useRef();
  const eml = useRef();
  const success = useRef();
  const [user, setUser] = useState({
    password: "",
    email: "",
  });

  useEffect(() => {
    setCheck(Check({ user }));
  }, [user, submit]);

  useEffect(() => {
    if (touched.email && check.email != "VALID") {
      eml.current.innerText = check.email;

      eml.current.style.display = "flex";
    } else {
      eml.current.style.display = "none";
    }
    if (touched.password && check.password != "VALID") {
      psw.current.innerText = check.password;
      psw.current.style.display = "flex";
    } else {
      psw.current.style.display = "none";
    }
  }, [check]);

  const createUser = async () => {
    setCheck(Check({ user }));
    setTouched({
      password: true,
      email: true,
    });
    let valid = true;
    if (check.email != "VALID" || check.password != "VALID") valid = false;
    if (valid) {
      logIn(user)
        .then((prom) => {
          console.log(prom);
          if (prom.data.status == "VALID") {
            setTimeout(() => {
              localStorage.setItem("token", prom.data.token);
              setUserObj(prom.data.user);
              setCheck({
                email: "VALID",
                password: "VALID",
              });
              success.current.style.margin = "auto";
              success.current.innerText = `Logging in..`;
              success.current.style.display = "flex";
              setTimeout(() => {
                window.location.href = "/";
              }, 200);
            }, 200);
          } else if (prom.data.status == "ERROR") {
            setTimeout(() => {
              setCheck({
                ...check,
                email: prom.data.message,
              });
              success.current.style.display = "none";
            });
          }

          if (Array.isArray(prom.data)) {
            prom.data.forEach((x) => {
              setCheck({
                ...check,
                [x.path]: x.status,
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const changeValue = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setTouched({
      ...touched,
      [e.target.name]: true,
    });
  };

  return (
    <div className={styles.form}>
      <div className="mb-2">
        <h1>Login</h1>
      </div>
      <hr></hr>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUser();
        }}
      >
        <p
          ref={success}
          className={styles.regErr}
          style={{
            backgroundColor: "#82bd85",
            borderRadius: "4px",
            color: "#00470b",
            textAlign: "center",
            fontWeight: "400",
            padding: "3px",
            margin: "0",
          }}
          name="username"
        />
        <label>Email</label>
        <p
          ref={eml}
          className={styles.regErr}
          style={{
            fontWeight: "200",
            margin: "0",
          }}
          name="email"
        />
        <input
          style={{ boxShadow: "none", backgroundColor: "transparent" }}
          onChange={changeValue}
          className={`form-control  mb-3 ${
            touched.password
              ? check.email != "VALID"
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          type="text"
          name="email"
        ></input>
        <label>Password</label>
        <p
          ref={psw}
          className={styles.regErr}
          style={{ fontWeight: "200", margin: "0" }}
          name="password"
        ></p>
        <input
          style={{ boxShadow: "none", backgroundColor: "transparent" }}
          onChange={changeValue}
          className={`form-control  mb-3 ${
            touched.password
              ? check.password != "VALID"
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          type="password"
          name="password"
        ></input>
        <Link href="/">Forgot password?</Link>
        <button
          onClick={() => {
            setSubmit((prev) => !prev);
          }}
          className={styles.loginbtn}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
