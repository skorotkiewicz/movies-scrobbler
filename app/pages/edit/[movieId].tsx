import { Suspense } from "react"
import {
  Head,
  /*Link, useRouter, Routes,*/ useQuery,
  useMutation,
  useParam,
  BlitzPage,
} from "blitz"
import Layout from "app/core/layouts/Layout"
// import getMovie from "app/movies/queries/getMovie"
import getMovie from "app/movies/queries/getMovie"
import updateMovie from "app/movies/mutations/updateMovie"
import { MovieForm, FORM_ERROR } from "app/movies/components/MovieForm"

export const EditMovie = () => {
  //   const router = useRouter()
  const movieId = useParam("movieId", "number")
  const [movie, { setQueryData }] = useQuery(getMovie, { id: movieId })
  const [updateMovieMutation] = useMutation(updateMovie)

  return (
    <>
      <Head>
        <title>Edit Movie {movie?.id}</title>
      </Head>

      <div>
        <h1>Edit Movie {movie?.id}</h1>
        <pre>{JSON.stringify(movie)}</pre>

        <MovieForm
          submitText="Update Movie"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateMovie}
          initialValues={movie}
          onSubmit={async (values) => {
            try {
              const updated = await updateMovieMutation({
                id: movie?.id,
                ...values,
              })
              // const updated = await updateMovieMutation({
              //   id: movie.id,
              //   ...values,
              // })

              await setQueryData(updated)
              // router.push(Routes.ShowMoviePage({ movieId: updated.id }))
            } catch (error) {
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditMoviePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditMovie />
      </Suspense>

      <p>
        {/* <Link href={Routes.MoviesPage()}>
          <a>Movies</a>
        </Link> */}
      </p>
    </div>
  )
}

EditMoviePage.authenticate = true
EditMoviePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditMoviePage
