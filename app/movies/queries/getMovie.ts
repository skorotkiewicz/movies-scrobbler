import { resolver, NotFoundError } from "blitz"
// import db from "db"
import { z } from "zod"

const GetMovie = z.object({
  // This accepts type of undefined, but is required at runtime
  // id: z.number().optional().refine(Boolean, "Required"),
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetMovie),
  /*resolver.authorize(),*/ async ({ id }) => {
    // const movie = await db.userMovie.findFirst({
    //   where: { id },
    //   include: {
    //     Movie: true,
    //   },
    // })

    // if (!movie) throw new NotFoundError()

    // return movie

    throw new NotFoundError()
  }
)
