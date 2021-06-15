import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import MoviesListComp from "app/core/layouts/MoviesListComp"
import Loading from "app/core/components/Loading"

const Dashboard: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Movie-Scrobbler</title>
      </Head>

      <div>
        <Suspense fallback={<Loading />}>
          <MoviesListComp user={null} />
        </Suspense>
      </div>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.getLayout = (page) => <Layout>{page}</Layout>

export default Dashboard
