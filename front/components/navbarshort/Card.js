import { GiHamburgerMenu } from "react-icons/gi";
import styles from "/styles/sidebar.module.css";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import sCart from "/styles/cart.module.css";
import { BsCart3 } from "react-icons/bs";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import Cart from "../Cart/Cart.js";
import { fetchUser, getCart } from "/services/services";
import { useGlobalContext } from "../Layout.js";

const Card = ({ navbar }) => {
  const [show, showCart] = useState(false);
  const {
    clicked,
    setTotal,
    total,
    setNavbar,
    setCheckout,
    checkout,
    userObj,
    setUserObj,
  } = useGlobalContext();
  const logoref = useRef();

  //   useEffect(() => {
  //     logoref.current.className = clicked ? styles.toggleA : styles.toggleB;
  //   }, [clicked]);

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
    <div className={`${navbar ? styles.shownav : styles.hidenav}`}>
      <div className={styles.leftside}>
        <li className="nav-item ">
          <div
            onClick={() => {
              setNavbar(false);
              window.location.href = "/";
            }}
          >
            <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none">
              <MdKeyboardArrowRight /> Tracks
            </a>
          </div>
        </li>
        {userObj.username && (
          <li className="nav-item ">
            <div
              onClick={() => {
                setNavbar(false);
                window.location.href = "/";
              }}
            >
              <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none ">
                <MdKeyboardArrowRight /> FEED
              </a>
            </div>
          </li>
        )}
        {userObj.username && (
          <li className="nav-item ">
            <div
              onClick={() => {
                setNavbar(false);
                window.location.href = "/purchases";
              }}
            >
              <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none ">
                <MdKeyboardArrowRight /> PURCHASES
              </a>
            </div>
          </li>
        )}
        {userObj && userObj.role === "Admin" && (
          <li className="nav-item ">
            <div
              onClick={() => {
                setNavbar(false);
                window.location.href = "/upload";
              }}
            >
              <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none ">
                <MdKeyboardArrowRight /> UPLOAD
              </a>
            </div>
          </li>
        )}
        {!userObj.username && (
          <li className="nav-item ">
            <div
              onClick={() => {
                setNavbar(false);
                window.location.href = "/register";
              }}
            >
              <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none ">
                <MdKeyboardArrowRight /> REGISTER
              </a>
            </div>
          </li>
        )}
        {!userObj.username && (
          <li className="nav-item ">
            <div
              onClick={() => {
                setNavbar(false);
                window.location.href = "/login";
              }}
            >
              <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none">
                <MdKeyboardArrowRight />
                LOGIN
              </a>
            </div>
          </li>
        )}
        {userObj.username && (
          <li onClick={logout} className="nav-item ">
            <a className="text-uppercase d-flex px-2 mx-1 text-decoration-none">
              <MdKeyboardArrowRight />
              LOGOUT
            </a>
          </li>
        )}
        <li className="nav-item ">
          <div
            style={{
              position: "relative",
            }}
          >
            <a
              className={styles.cart}
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
              <MdKeyboardArrowRight />
              CART
              <BsCart3 style={{ marginBottom: "7px", marginLeft: "15px" }} />
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
                  right: "37px",
                }}
                ref={logoref}
              >
                {checkout.length}
              </div>
            </a>
            <div className={`${!show ? sCart.cartContHide : sCart.cartCont}`}>
              <Cart hide={true} />
            </div>
          </div>
        </li>
      </div>
    </div>
  );
};

export default Card;
