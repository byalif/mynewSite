import React from "react";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../Layout.js";
import styles from "/styles/Home.module.css";

export const errorFunc = ({ error, setErr }) => {
  if (error.i || error.p || error.t) {
    setErr(true);
  } else {
    setErr(false);
  }
};

export const beatError = ({ loading, setLoading }) => {
  setLoading({
    ...loading,
    ["p"]: false,
  });
};

export const tagError = ({ error, setError, loading, setLoading }) => {
  setLoading({
    ...loading,
    ["t"]: false,
  });
  setError({
    ...error,
    ["t"]: false,
  });
};

export const imgError = ({ error, setError, loading, setLoading }) => {
  setLoading({
    ...loading,
    ["i"]: false,
  });
  setError({
    ...error,
    ["i"]: false,
  });
};
