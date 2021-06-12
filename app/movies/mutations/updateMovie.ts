import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateMovie = z.object({
  id: z.number(),
  title: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateMovie),
  resolver.authorize("ADMIN"),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const movie = await db.movie.update({ where: { id }, data })
    return movie

    // const isUserMovie = await db.movie.findFirst({ where: { id, userId: ctx.session.userId! } })

    // if (isUserMovie) {
    //   const movie = await db.movie.update({ where: { id }, data })
    //   return movie
    // }
  }
)

/*

export default resolver.pipe(
  resolver.zod(CreateMovie),
  resolver.authorize(),
  async (input, ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
    if (!user) throw new NotFoundError()

    // const movie = await db.movie.create({ data: input })

    return movie
  }
)
*/
