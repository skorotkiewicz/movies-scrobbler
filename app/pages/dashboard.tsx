import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import MoviesListComp from "app/core/layouts/MoviesListComp"

// const ITEMS_PER_PAGE = 20

const Dashboard: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Movies</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <MoviesListComp user={null} />
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

Dashboard.authenticate = true
Dashboard.getLayout = (page) => <Layout>{page}</Layout>

export default Dashboard
