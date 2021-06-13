import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const WatchedMovie = z.object({
  movieId: z.number(),
})

export default resolver.pipe(
  resolver.zod(WatchedMovie),
  resolver.authorize(),
  async ({ movieId }, ctx) => {
    const movie = await db.userMovie.findFirst({
      where: { id: movieId, userId: ctx.session.userId },
      select: { id: true, watched: true },
    })

    if (!movie) throw new NotFoundError()

    await db.userMovie.update({
      where: { id: movieId },
      data: { watched: true },
      // data: { watched: !movie.watched },
    })

    return true
  }
)
