import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteMovie = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteMovie),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const isUserMovie = await db.userMovie.findFirst({ where: { id }, include: { Movie: true } })
    if (!isUserMovie) throw new NotFoundError()

    if (isUserMovie.userId === ctx.session.userId) {
      const movie = await db.userMovie.deleteMany({ where: { id } })

      if (isUserMovie.watched) {
        // Remove WatchTime from User Account
        if (isUserMovie.Movie?.runtime !== "N/A") {
          await db.user.update({
            where: { id: ctx.session.userId! },
            data: {
              watchTime: {
                decrement: Number(isUserMovie.Movie?.runtime?.replace(/ min/, "")),
              },
            },
          })
        }
      }

      return movie
    }
  }
)
