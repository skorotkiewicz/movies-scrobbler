import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetMovie = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetMovie),
  /*resolver.authorize(),*/ async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const movie = await db.movie.findFirst({ where: { id } })

    if (!movie) throw new NotFoundError()

    return movie
  }
)
