import { paginate, resolver, NotFoundError, AuthenticationError } from "blitz"
import db, { Prisma } from "db"

interface GetMoviesInput
  extends Pick<Prisma.MovieFindManyArgs, any | "orderBy" | "skip" | "take"> {}
// extends Pick<Prisma.MovieFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}
// FIXME

export default resolver.pipe(
  // resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetMoviesInput, ctx) => {
    let user = await db.user.findFirst({ where: { id: where?.userId } })
    if (!user) throw new NotFoundError()

    if (ctx.session.userId !== user.id && !user.isPublic) {
      throw new AuthenticationError()
    }

    const {
      items: movies,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.userMovie.count({ where }),
      // query: (paginateArgs) => db.userMovie.findMany({ ...paginateArgs, where, orderBy }),
      query: (paginateArgs) =>
        db.userMovie.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            Movie: true,
          },
        }),
    })

    return {
      movies,
      nextPage,
      hasMore,
      count,
    }
  }
)
