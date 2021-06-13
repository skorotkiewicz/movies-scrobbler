import axios from "axios"
import { resolver } from "blitz"
import { z } from "zod"

const SearchMovie = z.object({
  title: z.string(),
})

export default resolver.pipe(resolver.zod(SearchMovie), resolver.authorize(), async ({ title }) => {
  if (title.length > 0) {
    // // regex: https://stackoverflow.com/a/45046649/2922741
    let type: string = /ev\d{7}\/\d{4}(-\d)?|(ch|co|ev|nm|tt)\d{7}/.test(title) ? "i" : "s"

    let req = await axios.get(
      `https://www.omdbapi.com/?${type}=${title}&apikey=${process.env.OMDB_API}`
    )

    if (req.data.Response === "True") {
      return type === "i" ? [req.data] : req.data.Search
    } else {
      return [{ error: "Movie not found!" }]
    }
  } else {
    return [{}]
  }
})
