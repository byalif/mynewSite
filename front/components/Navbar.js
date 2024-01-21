import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import sCart from "/styles/cart.module.css";
import { BsCart3 } from "react-icons/bs";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import Cart from "./Cart/Cart.js";
import { fetchUser, getCart } from "../services/services";
import { useGlobalContext } from "./Layout.js";

const Navbar = () => {
  const [show, showCart] = useState(false);
  const {
    clicked,
    setTotal,
    total,
    setCheckout,
    checkout,
    userObj,
    setUserObj,
  } = useGlobalContext();
  const logoref = useRef();

  useEffect(() => {
    logoref.current.className = clicked ? styles.toggleA : styles.toggleB;
  }, [clicked]);

  useEffect(() => {
    fetchUser()
      .then((x) => {
        console.log(x);
        setUserObj(x);
        if (x.status && x.status === "NOT_AUTHORIZED") {
          console.log("log in ");
        } else {
          getCart(x.id)
            .then((y) => {
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

  const logout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/";
    }, 50);
  };

  return (
    <>
      <div className={styles.cont}>
        <ul className={styles.navbar}>
          <div className={styles.leftSide}>
            <li className="nav-item ">
              <Link href="/">
                <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none text-dark">
                  Tracks
                </a>
              </Link>
            </li>
            {userObj.username && (
              <li className="nav-item ">
                <Link href="/">
                  <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none text-dark">
                    FEED
                  </a>
                </Link>
              </li>
            )}
            {userObj.username && (
              <li className="nav-item ">
                <Link href="/purchases">
                  <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none text-dark">
                    PURCHASES
                  </a>
                </Link>
              </li>
            )}
            {!userObj && userObj.role === "Admin" && (
              <li className="nav-item ">
                <Link href="/upload">
                  <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none text-dark">
                    UPLOAD
                  </a>
                </Link>
              </li>
            )}
            {!userObj.username && (
              <li className="nav-item ">
                <Link href="/register">
                  <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none text-dark">
                    REGISTER
                  </a>
                </Link>
              </li>
            )}
            {!userObj.username && (
              <li className="nav-item ">
                <Link href="/login">
                  <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none text-dark">
                    LOGIN
                  </a>
                </Link>
              </li>
            )}
          </div>
          <div className={styles.rightSide}>
            <div onClick={logout} className={styles.logout}>
              {userObj.username ? `LOGOUT` : ""}
            </div>
            <div className={styles.welcome}>
              {userObj.username ? `Hi, ${userObj.username}` : ""}
            </div>
            <li className="nav-item ">
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    zIndex: "100",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    showCart((prev) => !prev);
                  }}
                >
                  <BsCart3 />
                  <BiChevronDown
                    className={`${show ? styles.arrowup : styles.arrowdown}`}
                  />
                  <div
                    style={{
                      backgroundColor: "#404040",
                      padding: "0 6px",
                      fontSize: "15px",
                      borderRadius: "50%",
                      color: "white",
                      position: "absolute",
                      top: "5px",
                      right: "25px",
                    }}
                    ref={logoref}
                  >
                    {checkout.length}
                  </div>
                </div>

                <div
                  className={`${!show ? sCart.cartContHide : sCart.cartCont}`}
                >
                  <Cart />
                </div>
              </div>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
