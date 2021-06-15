import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import MoviesListComp from "app/core/layouts/MoviesListComp"
import Loading from "app/core/components/Loading"

const Watchlist: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Watchlist | Movie-Scrobbler</title>
      </Head>

      <div>
        <Suspense fallback={<Loading />}>
          <MoviesListComp user={{ watchlist: true }} />
        </Suspense>
      </div>
    </>
  )
}

Watchlist.authenticate = true
Watchlist.getLayout = (page) => <Layout>{page}</Layout>

export default Watchlist
