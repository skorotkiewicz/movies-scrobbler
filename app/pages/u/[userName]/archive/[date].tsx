import React, { Suspense } from "react"
import { Head, BlitzPage, usePaginatedQuery, useRouter, useSession, useParam } from "blitz"
import getMovies from "app/movies/queries/getMovies"
import MovieComp from "app/core/layouts/MovieComp"
import Layout from "app/core/layouts/Layout"
import Loading from "app/core/components/Loading"

const ITEMS_PER_PAGE = 40

const ArchiveComp = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const session = useSession()

  const userName: String | undefined = useParam("userName", "string")
  const date: String | undefined = useParam("date", "string")

  const [{ movies, hasMore, count }] = usePaginatedQuery(getMovies, {
    orderBy: { createdAt: "desc" },
    where: { name: userName, archive: date },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <h2 className="profileDesc">
        <span className="author">{userName}'s</span> archive of viewed movies from {date}
      </h2>

      <div className="moviesList">
        <div className={`counter profileDeco`}>
          <span>Watched movies: {count}</span>
        </div>
        {movies.map((movie, key) => (
          <>
            <MovieComp
              key={key}
              watched={true}
              movie={movie}
              user={true}
              session={session}
              removeUserMovie={null}
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
        .author {
          font-size: 32px;
          font-variant: small-caps;
        }
        .profileDesc {
          font-weight: 100;
          margin-bottom: -1px;
          border: 1px solid #ccc;
          border-radius: 10px 10px 0 0;
          background-color: #eee;
          padding: 10px;
          color: #333;
          margin-left: 10px;
          margin-right: 10px;
        }

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
      `}</style>
    </>
  )
}

const Archive: BlitzPage = () => {
  const userName: any = useParam("userName", "string")

  return (
    <>
      <Head>
        <title>{userName}'s archive of viewed movies | Movie-Scrobbler</title>
      </Head>

      <div>
        <Suspense fallback={<Loading />}>
          <ArchiveComp />
        </Suspense>
      </div>
    </>
  )
}

Archive.authenticate = false
Archive.getLayout = (page) => <Layout>{page}</Layout>

export default Archive
