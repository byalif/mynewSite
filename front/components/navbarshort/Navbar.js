import { GiHamburgerMenu } from "react-icons/gi";
import styles from "/styles/Home.module.css";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import sCart from "/styles/cart.module.css";
import { BsCart3 } from "react-icons/bs";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import Cart from "../Cart/Cart.js";
import { RiCloseCircleLine } from "react-icons/ri";
import Card from "./Card";
import { fetchUser, getCart } from "/services/services";
import { useGlobalContext } from "../Layout.js";

const Navbar = () => {
  const [show, showCart] = useState(false);
  const {
    clicked,
    setTotal,
    navbar,
    setNavbar,
    total,
    setCheckout,
    checkout,
    userObj,
    setUserObj,
  } = useGlobalContext();

  //   useEffect(() => {
  //     logoref.current.className = clicked ? styles.toggleA : styles.toggleB;
  //   }, [clicked]);

  return (
    <div className={styles.cont}>
      <div className={styles.navbar2}>
        <div className={styles.ham}>
          {navbar ? (
            <RiCloseCircleLine
              onClick={() => {
                setNavbar((prev) => !prev);
              }}
              className={styles.xLogo}
            />
          ) : (
            <GiHamburgerMenu
              className={styles.hamLogo}
              onClick={() => {
                setNavbar((prev) => !prev);
              }}
            />
          )}
          <Card navbar={navbar} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
