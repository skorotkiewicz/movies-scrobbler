import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const SetViewProfile = z.object({
  current: z.any(), // FIXME
  // current: z.boolean() ,
})

export default resolver.pipe(
  resolver.zod(SetViewProfile),
  resolver.authorize(),
  async ({ current }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const isPublic = await db.user.update({
      where: { id: ctx.session.userId! },
      data: { isPublic: !current },
    })

    await ctx.session.$setPublicData({ isPublic: !current })

    return isPublic
  }
)
