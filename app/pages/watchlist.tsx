import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import MoviesListComp from "app/core/layouts/MoviesListComp"

const Watchlist: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Movies</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <MoviesListComp user={{ watchlist: true }} />
        </Suspense>
      </div>

      <style global jsx>{`
        .addMovieForm {
          display: flex;
          background-color: #eee;
          padding: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .addMovieForm input,
        .addMovieForm button {
          margin: 5px;
        }
      `}</style>
    </>
  )
}

Watchlist.authenticate = true
Watchlist.getLayout = (page) => <Layout>{page}</Layout>

export default Watchlist
