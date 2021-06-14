/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { usePaginatedQuery, useRouter, useMutation, useSession } from "blitz"
import deleteMovie from "app/movies/mutations/deleteMovie"
import voteMovie from "app/movies/mutations/voteMovie"
import watchedMovie from "app/movies/mutations/watchedMovie"
import getMovies from "app/movies/queries/getMovies"
import AddMovie from "app/movies/components/AddMovie"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import moment from "moment"

const ITEMS_PER_PAGE = 40

const Vote = ({ movieId, select, user, session, refetch }) => {
  const [voteMovieMutation] = useMutation(voteMovie)

  let arr = [
    "🙂 I liked the movie.",
    "😀 I liked the movie a lot.",
    "❤️ I recommend the movie to everyone!",
    "😕 I didn't like this movie.",
  ]

  return (
    <div className="voteBox">
      {user && select >= 0 && <div className="recommendation">{arr[select]}</div>}

      {!user && session && (
        <>
          {arr.map((e, vote) => (
            <div
              onClick={async () => {
                await voteMovieMutation({ movieId, vote })
                refetch() // FIXME to not rerender all movies
              }}
              key={vote}
              className={`votes ${select === vote && `selected`}`}
            >
              {e}
            </div>
          ))}
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

const MoviesListComp = ({ user }) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const session = useSession()
  const [deleteMovieMutation] = useMutation(deleteMovie)
  const [watchedMovieMutation] = useMutation(watchedMovie)
  let watched: boolean = user?.watchlist ? false : true

  let where = {}
  if (user) {
    where = { userId: watched ? user.id : session.userId, watched }
  } else {
    where = { userId: session.userId, watched }
  }

  const [{ movies, hasMore, count }, { refetch }] = usePaginatedQuery(getMovies, {
    orderBy: { createdAt: "desc" },
    where,
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  let lastDay = 0 // getDate()

  return (
    <>
      {(!user || !watched) && <AddMovie refetch={refetch} watchlist={!watched} />}
      <div className="moviesList">
        <div className={`counter${user ? " profileDeco" : ""}`}>
          {watched ? <>Watched movies: {count}</> : <>Movies on watchlist: {count}</>}
        </div>
        {movies.map((movie) => (
          <>
            {lastDay !== new Date(movie.createdAt).getDate() && watched && (
              <>
                <span style={{ display: "none" }}>
                  {(lastDay = new Date(movie.createdAt).getDate())}
                </span>

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
                        {watched ? "Watched" : "Added"}{" "}
                        {moment(new Date(movie.createdAt)).fromNow()}
                      </span>
                      <span className="runtime">
                        {movie.Movie?.runtime && `(Runtime: ${movie.Movie?.runtime})`}
                      </span>
                    </div>

                    {(!user || !watched) && (
                      <button
                        onClick={async () => {
                          confirmAlert({
                            title: `Confirm to remove from ${
                              watched ? "watched list" : "watchlist"
                            }`,
                            message: `Do you really want to remove this movie from your ${
                              watched ? "watched list" : "watchlist"
                            }?`,
                            buttons: [
                              {
                                label: "Yes",
                                onClick: async () => {
                                  await deleteMovieMutation({ id: movie.id })
                                  refetch()
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
                            refetch()
                          }}
                          style={{ color: "green", fontSize: 16 }}
                        >
                          ✔ Watched
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="vote">
                    <Vote
                      movieId={movie.id}
                      select={movie.vote}
                      user={user}
                      session={session}
                      refetch={refetch}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>

      <div className="pagination">
        <button
          className={`prev ${page !== 0 && "more"}`}
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className={`next ${hasMore && "more"}`} disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
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
        .pagination {
          display: flex;
          background-color: #282c37;
          border-bottom: 2px solid #2f374c;
          margin: 10px;
        }
        .pagination .next {
          flex: 1;
        }
        .pagination button {
          margin: 10px;
          padding: 5px;
        }
        .pagination .next,
        .pagination .prev {
          background-color: #444b5d !important;
          border: 0;
          color: #9baec8;
          outline: none !important;
        }
        .pagination .more {
          color: #fff;
          font-weight: bold;
          border-bottom: 4px solid #606984 !important;
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

export default MoviesListComp
