import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const VoteMovie = z.object({
  movieId: z.number(),
  vote: z.number(),
})

export default resolver.pipe(
  resolver.zod(VoteMovie),
  resolver.authorize(),
  async ({ movieId, vote }, ctx) => {
    const movie = await db.userMovie.findFirst({
      where: { id: movieId, userId: ctx.session.userId },
      select: { id: true, vote: true },
    })

    if (!movie) throw new NotFoundError()

    if (movie.vote === vote) {
      vote = -1
    }

    await db.userMovie.update({
      where: { id: movieId },
      data: { vote },
    })

    return vote
  }
)
