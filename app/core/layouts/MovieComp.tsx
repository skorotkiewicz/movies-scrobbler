/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react"
import { useMutation } from "blitz"
import deleteMovie from "app/movies/mutations/deleteMovie"
import voteMovie from "app/movies/mutations/voteMovie"
import watchedMovie from "app/movies/mutations/watchedMovie"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import moment from "moment"

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
  const [deleteMovieMutation] = useMutation(deleteMovie)
  const [watchedMovieMutation] = useMutation(watchedMovie)

  // const timeConvert = (num) => {
  //   let hours = Math.floor(num / 60)
  //   let minutes = num % 60
  //   return hours + ":" + minutes
  // }

  return (
    <>
      <div key={movie.id} className="movieComp">
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
                  {/* {`Runtime: (` +
                    timeConvert(Number(movie.Movie?.runtime.replace(/ min/, ""))) +
                    `h)`} */}
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
        .movieComp,
        .counter {
          background-color: #282c37;
          color: #dbe6fd;
          border-bottom: 4px solid #2f374c;
        }
        .counter {
          padding: 5px;
        }
        .movieComp {
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
      `}</style>
    </>
  )
}

// const MemoMovieComp = React.memo(MovieComp)
// export default MemoMovieComp

export default MovieComp
