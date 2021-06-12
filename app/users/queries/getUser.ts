import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetUser = z.object({
  //   id: z.number().refine(Boolean, "Required"),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(GetUser),
  /*resolver.authorize(),*/ async ({ name }) => {
    const user = await db.user.findFirst({
      where: { name },
      select: { id: true, name: true, email: false, role: true, isPublic: true },
    })

    if (!user) throw new NotFoundError()

    return user
  }
)
