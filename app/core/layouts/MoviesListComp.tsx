import React, { useEffect, useState } from "react"
import { usePaginatedQuery, useRouter, useSession, Link } from "blitz"
import getMovies from "app/movies/queries/getMovies"
import AddMovie from "app/movies/components/AddMovie"
import MovieComp from "./MovieComp"
import moment from "moment"

const ITEMS_PER_PAGE = 40

const MoviesListComp = ({ user }) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const session = useSession()
  let watched: boolean = user?.watchlist ? false : true

  let where = {}
  if (user) {
    where = { userId: watched ? user.id : session.userId, watched }
  } else {
    where = { userId: session.userId, watched }
  }

  const [{ movies, hasMore, count }] = usePaginatedQuery(getMovies, {
    orderBy: { createdAt: "desc" },
    where,
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  useEffect(() => {
    setMoviesList(movies)
  }, [movies])

  const [moviesList, setMoviesList] = useState(movies)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const removeUserMovie = (id) => {
    const newList = moviesList.filter((item: any) => item.id !== id)
    setMoviesList(newList)
  }

  let lastDay = 0 // getDate()

  return (
    <>
      {(!user || !watched) && (
        <AddMovie moviesList={moviesList} setMoviesList={setMoviesList} watchlist={!watched} />
      )}
      <div className="moviesList">
        <div className={`counter ${user?.id ? "profileDeco" : ""}`}>
          <span>{watched ? <>Watched movies: {count}</> : <>Movies on watchlist: {count}</>}</span>
        </div>
        {moviesList.map((movie, key) => (
          <>
            {lastDay !== new Date(movie.createdAt).getDate() && watched && (
              <>
                <span style={{ display: "none" }}>
                  {(lastDay = new Date(movie.createdAt).getDate())}
                </span>
                <div className="separator">
                  <Link
                    href={`/u/${user?.name ? user.name : session.name}/archive/${moment(
                      movie.createdAt
                    ).format("YYYY-MM-DD")}`}
                  >
                    <a>{moment(movie.createdAt).format("YYYY/MM/DD")}</a>
                  </Link>
                </div>
              </>
            )}

            <MovieComp
              key={key}
              watched={watched}
              movie={movie}
              user={user}
              session={session}
              removeUserMovie={removeUserMovie}
            />
          </>
        ))}
      </div>

      <div className="pagination">
        <button
          className={`prev ${page !== 0 ? "more" : ""}`}
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button
          className={`next ${hasMore ? "more" : ""}`}
          disabled={!hasMore}
          onClick={goToNextPage}
        >
          Next
        </button>
      </div>

      <style jsx>{`
        .movieComp,
        .counter {
          color: #dbe6fd;
          border-bottom: 2px solid #2f374c;
        }
        .counter span {
          margin-left: 10px;
          color: #9baec8;
        }
        .counter {
          padding: 5px;
          margin-left: 20px;
          margin-top: -10px;
          margin-right: 20px;
        }
        .profileDeco {
          padding-top: 10px;
          margin-left: 10px;
          margin-right: 10px;
          background-color: #282c37;
          border-bottom: 4px solid #2f374c;
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

        .separator a {
          cursor: pointer;
          text-decoration: none;
          color: #9baec8;
          /*border-bottom: 1px solid #606984;*/
          border-radius: 30px;
          padding: 5px;
          font-size: 14px;
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
