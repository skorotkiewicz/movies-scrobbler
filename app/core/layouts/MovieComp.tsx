/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react"
import { useMutation } from "blitz"
import moment from "moment"
import deleteMovie from "app/movies/mutations/deleteMovie"
import voteMovie from "app/movies/mutations/voteMovie"
import watchedMovie from "app/movies/mutations/watchedMovie"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"

const Vote = ({ movieId, select, user, session }) => {
  const [voteMovieMutation] = useMutation(voteMovie)
  const [voteSelect, setVoteSelect] = useState(select)

  let arr = [
    "🙂 I liked the movie.",
    "😀 I liked the movie a lot.",
    "❤️ I recommend the movie to everyone!",
    "😕 I didn't like this movie.",
  ]

  return (
    <div className="voteBox">
      {user && select >= 0 && <div className="recommendation">{arr[select]}</div>}

      {/* {!user && session && (
        <>
          {arr.map((e, vote) => (
            <div
              onClick={async () => {
                setVoteSelect(await voteMovieMutation({ movieId, vote }))
              }}
              key={vote}
              className={`votes ${voteSelect === vote ? `selected` : ""}`}
            >
              {e}
            </div>
          ))}
        </>
      )} */}

      {!user && session && (
        <>
          {voteSelect === -1 || voteSelect === null ? (
            <>
              {arr.map((e, vote) => (
                <div
                  onClick={async () => {
                    setVoteSelect(await voteMovieMutation({ movieId, vote }))
                  }}
                  key={vote}
                  className={`votes`}
                >
                  {e}
                </div>
              ))}
            </>
          ) : (
            <div
              onClick={async () => {
                setVoteSelect(await voteMovieMutation({ movieId, vote: voteSelect }))
              }}
              className={`votes selected`}
            >
              {arr[voteSelect]}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .voteBox {
          display: flex;
        }
        .votes {
          font-size: 12px;
          border-bottom: 2px solid #444b5d;
          border-right: 0;
          border-top: 0;
          border-left: 0;
          margin: 5px;
          margin-top: 10px;
          padding: 10px;
          cursor: pointer;
          text-align: center;
          /*color: #9baec8;*/
          color: #606984;
        }
        .selected {
          border-bottom: 2px solid #9baec8;
          color: #dbe6fd;
        }
        .recommendation {
          margin: 10px;
          font-size: 14px;
          color: #b2ab8c;
        }
      `}</style>
    </div>
  )
}

const MovieComp = ({ movie, watched, user, session, removeUserMovie }) => {
  let lastDay = 0 // getDate()

  const [deleteMovieMutation] = useMutation(deleteMovie)
  const [watchedMovieMutation] = useMutation(watchedMovie)

  return (
    <>
      {lastDay !== new Date(movie.createdAt).getDate() && watched && (
        <>
          <span style={{ display: "none" }}>{(lastDay = new Date(movie.createdAt).getDate())}</span>

          <div className="separator">{moment(movie.createdAt).format("DD/MM/YYYY")}</div>
        </>
      )}

      <div key={movie.id} className="movieList">
        <div className="movie">
          <div className="poster">
            {movie.Movie?.poster && <img src={movie.Movie?.poster} alt="poster" />}
          </div>

          <div className="desc">
            <div className="title">
              {movie.Movie?.imdbID ? (
                <a href={`https://www.imdb.com/title/${movie.Movie?.imdbID}/`} target="blank">
                  {movie.Movie?.title}
                </a>
              ) : (
                <>{movie.Movie?.title}</>
              )}
              <span className="movieYear">({movie.Movie?.year})</span>
            </div>
            <div className="plot">{movie.Movie?.plot.replace(/&quot;/g, '"')}</div>
            <div className="actions">
              <div className="watchedDate">
                <span title={new Date(movie.createdAt).toUTCString()}>
                  {watched ? "Watched" : "Added"} {moment(new Date(movie.createdAt)).fromNow()}
                </span>
                <span className="runtime">
                  {movie.Movie?.runtime && `(Runtime: ${movie.Movie?.runtime})`}
                </span>
              </div>

              {(!user || !watched) && (
                <button
                  onClick={async () => {
                    confirmAlert({
                      title: `Confirm to remove from ${watched ? "watched list" : "watchlist"}`,
                      message: `Do you really want to remove this movie from your ${
                        watched ? "watched list" : "watchlist"
                      }?`,
                      buttons: [
                        {
                          label: "Yes",
                          onClick: async () => {
                            await deleteMovieMutation({ id: movie.id })
                            removeUserMovie(movie.id)
                          },
                        },
                        {
                          label: "No",
                          onClick: () => {},
                        },
                      ],
                    })
                  }}
                >
                  {watched ? (
                    "Unwatch"
                  ) : (
                    <span style={{ color: "red", fontSize: 14 }}>Remove from watchlist</span>
                  )}
                </button>
              )}

              {!watched && (
                <div>
                  <button
                    onClick={async () => {
                      await watchedMovieMutation({ movieId: movie.id })
                      removeUserMovie(movie.id)
                    }}
                    style={{ color: "green", fontSize: 16 }}
                  >
                    ✔ Watched
                  </button>
                </div>
              )}
            </div>
            <div className="vote">
              <Vote movieId={movie.id} select={movie.vote} user={user} session={session} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .movie {
          display: flex;
          list-style-type: none;
        }
        .poster {
          justify-content: flex-start;
        }
        .desc {
          margin-left: 15px;
          justify-content: flex-end;
        }
        .title {
          font-size: 22px;
        }
        .title a {
          text-decoration: none;
          color: #fff;
        }
        .actions {
          display: flex;
          align-items: flex-end;
          font-size: 14px;
        }
        .actions {
          margin-top: 10px;
        }
        .actions button {
          margin-left: 10px;
          font-size: 10px;
          padding: 2px;
          border-bottom: 1px dotted #777;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          color: #fff;
          outline: none !important;
          cursor: pointer;
          background-color: transparent;
        }
        .watchedDate span,
        .runtime {
          color: #9baec8;
        }
        .movieList,
        .counter {
          background-color: #282c37;
          color: #dbe6fd;
          border-bottom: 4px solid #2f374c;
        }
        .counter {
          padding: 5px;
        }
        .movieList {
          margin: 10px;
          padding: 10px;
        }
        .poster img {
          height: 150px;
          width: 110px;
          border-bottom: 6px solid #2f374c;
        }
        .movieYear {
          color: #888;
          margin-left: 5px;
          font-size: 20px;
        }
        .plot {
          margin-top: 10px;
        }
        .runtime {
          margin-left: 10px;
        }
        .profileDeco {
          margin-left: 10px;
          margin-right: 10px;
        }

        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin-top: 10px;
          margin-bottom: 10px;
          color: #606984;
        }
        .separator::before,
        .separator::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #606984;
        }
        .separator:not(:empty)::before {
          margin-right: 0.25em;
        }
        .separator:not(:empty)::after {
          margin-left: 0.25em;
        }
      `}</style>
    </>
  )
}

// const MemoMovieComp = React.memo(MovieComp)
// export default MemoMovieComp

export default MovieComp
