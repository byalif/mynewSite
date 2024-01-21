import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../Layout.js";
import styles from "/styles/cart.module.css";
import {
  checkoutItems,
  fetchUser,
  getCart,
  deleteItem,
  postCart,
} from "/services/services.js";
import { TbShoppingCartOff } from "react-icons/tb";

const Cart = ({ hide }) => {
  const [loading, setLoading] = useState();
  const { setTotal, total, checkout, setCheckout, userObj, setUserObj } =
    useGlobalContext();

  const deleteItems = (id, price) => {
    if (id && price) {
      setLoading(true);
      deleteItem(id)
        .then((x) => {
          setLoading(false);
          setTotal((prev) => {
            return prev - price;
          });
          setCheckout((prev) => {
            let temp = prev.filter((x) => x.id != id);
            return temp;
          });
          console.log("deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const checkoutCart = () => {
    fetchUser()
      .then((x) => {
        if (x.status && x.status === "NOT_AUTHORIZED") {
          window.location.href = "/login";
        } else if (total != 0) {
          checkoutItems()
            .then((x) => {
              console.log(x);
              if (x.url) {
                window.location.href = x.url;
              }
            })
            .catch((x) => {
              console.log(x);
            });
        } else {
          window.location.href = "/";
        }
      })
      .catch((x) => {
        console.log("no users");
      });
  };

  return (
    <>
      <div className={styles.cont}>
        <div className={styles.ttle}>
          Your Cart ({checkout.length}) <hr />
        </div>
        {loading ? (
          <div
            style={{
              fontSize: "16px",
              fontWeight: "300",
              letterSpacing: "1px",
            }}
          >
            Removing from cart...
          </div>
        ) : (
          <div>
            <div style={{ position: "relative" }}>
              {checkout.map((x) => {
                return (
                  <div className={styles.item} key={x.id}>
                    <div className={styles.leftSide}>
                      <img
                        width="100%"
                        height="100%"
                        style={{ height: "50px", width: "70px" }}
                        src={x.img}
                        alt=""
                      />
                      <div
                        style={{
                          marginLeft: "5px",
                          fontSize: "12px",
                          fontWeight: "300",
                        }}
                      >
                        <div>{`${x.title} byalif`}</div>
                        <div style={{ color: "#d1d1d1" }}>Track</div>
                      </div>
                    </div>

                    <div className={styles.rightSide}>
                      ${x.price}.00
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "right",
                        }}
                      >
                        <div
                          onClick={() => {
                            deleteItems(x.id, x.price);
                          }}
                          className={styles.toggleA}
                          style={{
                            cursor: "pointer",
                            fontSize: "10px",
                            display: "flex",
                          }}
                        >
                          (Delete)
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "8px" }}>TOTAL: ${total}.00</div>
            <button
              onClick={checkoutCart}
              className={`${total == 0 ? styles.btn : styles.btn}`}
            >
              Checkout
            </button>
          </div>
        )}
      </div>{" "}
    </>
  );
};

export default Cart;
