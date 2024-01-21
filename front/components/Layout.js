import Navbar from "./Navbar";
import Navbar2 from "./navbarshort/Navbar.js";
import React, { createContext, useContext, useState, useRef } from "react";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import Script from "next/script";
const AppContext = createContext();

export const Layout = ({ children }) => {
  const [defaultSong, setDefaultSong] = useState({});
  const [img, setImages] = useState([]);
  const [userObj, setUserObj] = useState({});
  const [err, setErr] = useState(false);
  const [checkout, setCheckout] = useState([]);
  const [plays, setPlays] = useState(0);
  const [error, setError] = useState({
    p: false, //popular
    t: false, //tags
    i: false, //images
    f: false, //followers
  });
  const [allBeats, setAllBeats] = useState([]);
  const [tags, setTags] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [total, setTotal] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [typeBeat, setTypeBeat] = useState([]);
  const [loading, setLoading] = useState({
    p: true, //popular
    t: true, //tags
    i: true, //images
    f: true, // followers
  });
  const [song, setSong] = useState("");
  const [prev, setPrev] = useState("/0");
  const [navbar, setNavbar] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadNew, setLoadNew] = useState(false);
  const setTheSong = (x) => {
    setSong(x);
  };
  const setPrevSong = (x) => {
    setPrev(x);
  };

  return (
    <AppContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        loadNew,
        setLoadNew,
        prev,
        total,
        setTotal,
        setPrevSong,
        song,
        setTheSong,
        img,
        setImages,
        setUserObj,
        clicked,
        setClicked,
        userObj,
        checkout,
        setCheckout,
        err,
        setErr,
        error,
        setError,
        allBeats,
        setAllBeats,
        plays,
        setPlays,
        defaultSong,
        setDefaultSong,
        tags,
        navbar,
        setNavbar,
        setTags,
        followers,
        setFollowers,
        typeBeat,
        setTypeBeat,
        loading,
        setLoading,
      }}
    >
      <NextNProgress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ showSpinner: false }}
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossorigin="anonymous"
        />
      </Head>

      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossorigin="anonymous"
      />

      <Navbar />
      <Navbar2 />
      <div>{children}</div>
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
