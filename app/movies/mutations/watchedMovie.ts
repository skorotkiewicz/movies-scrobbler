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
      include: { Movie: true },
    })

    if (!movie) throw new NotFoundError()

    await db.userMovie.update({
      where: { id: movieId },
      data: { watched: true, createdAt: new Date() },
    })

    // Add WatchTime to User Account
    if (movie.Movie?.runtime !== "N/A") {
      await db.user.update({
        where: { id: ctx.session.userId! },
        data: {
          watchTime: {
            increment: Number(movie.Movie?.runtime?.replace(/ min/, "")),
          },
        },
      })
    }

    return true
  }
)
