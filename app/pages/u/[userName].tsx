import { Suspense } from "react"
import { Head, useQuery, useParam, BlitzPage, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUser from "app/users/queries/getUser"
import MoviesListComp from "app/core/layouts/MoviesListComp"
import Loading from "app/core/components/Loading"

export const MoviesList = () => {
  const userName: any = useParam("userName", "string")
  const [user] = useQuery(getUser, { name: userName })
  const session = useSession()

  return (
    <div>
      {user.isPublic || session.name === userName ? (
        <>
          <h2 className="profileDesc">
            <span className="author">{userName}'s</span> watched movies{" "}
            {!user.isPublic && "[PRIVATE]"}
          </h2>

          <MoviesListComp user={user} />
        </>
      ) : (
        <h2 className="profileDesc">Private profile</h2>
      )}

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
      `}</style>
    </div>
  )
}

const MoviesPage: BlitzPage = () => {
  const userName: any = useParam("userName", "string")

  return (
    <>
      <Head>
        <title>{userName}'s watched movies | Movie-Scrobbler</title>
      </Head>

      <div>
        <Suspense fallback={<Loading />}>
          <MoviesList />
        </Suspense>
      </div>
    </>
  )
}

MoviesPage.authenticate = false
MoviesPage.getLayout = (page) => <Layout>{page}</Layout>

export default MoviesPage
