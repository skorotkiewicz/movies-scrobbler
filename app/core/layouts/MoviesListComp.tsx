import { usePaginatedQuery, useRouter, useMutation, useSession } from "blitz"
import deleteMovie from "app/movies/mutations/deleteMovie"
import getMovies from "app/movies/queries/getMovies"
import AddMovie from "app/movies/components/AddMovie"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import moment from "moment"

// type MoviesProps = {
//   movies: []
// }
const ITEMS_PER_PAGE = 20

const MoviesListComp = ({ user }) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const session = useSession()
  const [deleteMovieMutation] = useMutation(deleteMovie)

  let where = {}
  if (user) {
    where = { userId: user.id }
  } else {
    where = { userId: session.userId }
  }

  const [{ movies, hasMore, count }, { refetch }] = usePaginatedQuery(getMovies, {
    orderBy: { id: "desc" },
    where,
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  let lastDay = 0 // getDate()

  return (
    <>
      {!user && <AddMovie refetch={refetch} />}
      <div className="moviesList">
        <div className={`counter ${user && "profileDeco"}`}>Watched movies: {count}</div>
        {movies.map((movie) => (
          <>
            {lastDay !== new Date(movie.createdAt).getDate() && (
              <>
                <span style={{ display: "none" }}>
                  {(lastDay = new Date(movie.createdAt).getDate())}
                </span>

                <h4 className="dayLine">{moment(movie.createdAt).format("DD/MM/YYYY")}</h4>
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
                  <div className="plot">{movie.Movie?.plot}</div>

                  <div className="actions">
                    <div className="watchedDate">
                      <span title={new Date(movie.createdAt).toUTCString()}>
                        Watched {moment(new Date(movie.createdAt)).fromNow()}
                      </span>
                      <span className="runtime">
                        {movie.Movie?.runtime && `(Runtime: ${movie.Movie?.runtime})`}
                      </span>
                    </div>

                    {!user && (
                      <button
                        onClick={async () => {
                          confirmAlert({
                            title: "Confirm to remove from watch list",
                            message:
                              "Do you really want to remove this movie from your watch list?",
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
                        Unwatch
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>

      <style jsx>{`
        /*.moviesList {*/
        .movie {
          display: flex;
          list-style-type: none;
        }
        .poster {
          /*display: flex;*/
          justify-content: flex-start;
        }
        .desc {
          /*display: flex;*/
          margin-left: 15px;
          justify-content: flex-end;
        }
        .title {
          font-size: 22px;
        }
        .title a {
          text-decoration: none;
          color: #000;
        }
        .counter {
          padding: 5px;
          background-color: #eee;
          /*margin-top: 10px;*/
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          color: #555;
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
          color: #333;
          outline: none !important;
          cursor: pointer;
        }
        .watchedDate span,
        .runtime {
          color: #aaa;
        }
        .movieList {
          background-color: #eee;
          margin: 10px;
          padding: 10px;
          border-bottom: 2px solid #ccc;
        }
        .poster img {
          height: 150px;
          width: 110px;
        }
        .dayLine {
          text-align: center;
          font-weight: 100;
          background-color: #eee;
          padding: 10px;
          margin-left: 50px;
          margin-right: 50px;
          color: #222;
          border-radius: 30px;
          font-size: 14px;
          border-bottom: 1px solid #ccc;
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
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
      `}</style>
    </>
  )
}

export default MoviesListComp
