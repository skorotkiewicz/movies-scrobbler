import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import axios from "axios"

const CreateMovie = z.object({
  Title: z.string(),
  imdbID: z.string(),
  // Year: z.string(),
  // Poster: z.string() || undefined,
})

export default resolver.pipe(
  resolver.zod(CreateMovie),
  resolver.authorize(),
  async (input, ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
    if (!user) throw new NotFoundError()

    let movie = await db.movie.findFirst({ where: { title: input.Title! } })

    if (!movie) {
      let req = await axios.get(`https://www.omdbapi.com/?i=${input.imdbID}&apikey=4a3b711b`)
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
      // movie = await db.movie.create({
      //   data: { title: input.Title, year: input.Year, imdbID: input.imdbID, poster: input.Poster },
      // })
    }

    await db.userMovie.create({
      data: { userId: ctx.session.userId, movieId: movie.id },
    })

    return movie
  }
)
