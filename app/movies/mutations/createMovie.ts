import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import axios from "axios"

const CreateMovie = z.object({
  Title: z.string(),
  imdbID: z.string(),
  watchlist: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(CreateMovie),
  resolver.authorize(),
  async (input, ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
    if (!user) throw new NotFoundError()

    let movie = await db.movie.findFirst({ where: { title: input.Title! } })

    if (!movie) {
      let req = await axios.get(
        `https://www.omdbapi.com/?i=${input.imdbID}&apikey=${process.env.OMDB_API}`
      )
      let src = req.data

      movie = await db.movie.create({
        data: {
          title: src.Title,
          year: src.Year,
          imdbID: src.imdbID,
          poster: src.Poster,
          runtime: src.Runtime,
          plot: src.Plot,
        },
      })
    }

    let userMovie = await db.userMovie.create({
      data: {
        userId: ctx.session.userId,
        movieId: movie.id,
        watched: input.watchlist ? false : true,
      },
    })

    return { Movie: movie, ...userMovie }
  }
)
