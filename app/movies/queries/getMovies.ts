import { paginate, resolver, NotFoundError } from "blitz"
import db, { Prisma } from "db"

interface GetMoviesInput
  extends Pick<Prisma.MovieFindManyArgs, any | "orderBy" | "skip" | "take"> {}
// extends Pick<Prisma.MovieFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}
// FIXME

export default resolver.pipe(
  // resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetMoviesInput, ctx) => {
    let whereUser = where?.name ? { name: where.name } : { id: where.userId }

    // let user = await db.user.findFirst({ where: { id: where?.userId } })
    let user = await db.user.findFirst({ where: whereUser })
    if (!user) throw new NotFoundError()

    if (ctx.session.userId !== user.id && !user.isPublic) {
      // throw new AuthenticationError() // this logout active users!
      throw new NotFoundError() // better info FIXME
    }

    if (where?.archive) {
      // Show archive by Year, Month or Day
      // http://localhost:3000/u/test/archive/2021-06-15
      // http://localhost:3000/u/test/archive/2021-06
      // http://localhost:3000/u/test/archive/2021

      const a = where.archive
      let from: Date = new Date(where.archive)
      let to: Date = new Date()

      if (a.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
        to = new Date(from.setDate(from.getDate() + 1))
      } else if (a.match(/^(\d{4})-(\d{2})$/)) {
        to = new Date(from.setMonth(from.getMonth() + 1))
      } else if (a.match(/^(\d{4})$/)) {
        to = new Date(from.setFullYear(from.getFullYear() + 1))
      } else {
        throw new NotFoundError()
      }

      where = {
        userId: user.id,
        watched: true,
        createdAt: {
          gte: new Date(where.archive),
          lt: to,
        },
      }

      //
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
