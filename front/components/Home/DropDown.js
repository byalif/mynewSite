import React from "react";
import styles from "/styles/Home.module.css";
import { fetchPopularTracks, allTags } from "./fetchingData.js";
class DropDown extends React.PureComponent {
  render() {
    const {
      setPlays,
      loading,
      setLoading,
      plays,
      error,
      setError,
      allBeats,
      setAllBeats,
      isOpen,
      setDef,
    } = this.props;

    return (
      <div className={`${isOpen ? styles.open : styles.closed}`}>
        <p
          onClick={() => {
            setDef("Most recent");
            let newData = allBeats.sort(
              (a, b) =>
                new Date().getTime() -
                new Date(a.createdAt).getTime() -
                (new Date().getTime() - new Date(b.createdAt).getTime())
            );
            setAllBeats(newData);
          }}
          href=""
        >
          Most recent
        </p>
        <hr />
        <p
          onClick={() => {
            setDef("Most popular");
            fetchPopularTracks({
              error,
              setError,
              allBeats,
              setAllBeats,
              setPlays,
              loading,
              setLoading,
              plays,
            });
          }}
          href=""
        >
          Most popular
        </p>
        <hr />
        <p
          onClick={() => {
            setDef("Most liked");
            let newData = allBeats.sort(
              (a, b) => b.Likes.length - a.Likes.length
            );
            setAllBeats(newData);
          }}
          href=""
        >
          Most liked
        </p>
      </div>
    );
  }
}

export default DropDown;
