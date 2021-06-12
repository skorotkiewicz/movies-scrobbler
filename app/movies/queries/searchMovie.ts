import axios from "axios"
import { resolver } from "blitz"
import { z } from "zod"

const SearchMovie = z.object({
  title: z.string(),
})

export default resolver.pipe(resolver.zod(SearchMovie), resolver.authorize(), async ({ title }) => {
  if (title.length > 0) {
    let req = await axios.get(`https://www.omdbapi.com/?s=${title}&apikey=${process.env.OMDB_API}`)

    if (req.data.Response === "True") {
      return req.data.Search
    } else {
      return [{ error: "Movie not found!" }]
    }
  } else {
    return [{}]
  }
})
