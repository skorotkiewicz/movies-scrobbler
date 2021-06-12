import { useMutation, BlitzPage, invoke } from "blitz"
import React, { useState } from "react"
import Autosuggest from "react-autosuggest"
import Layout from "app/core/layouts/Layout"
import createMovie from "app/movies/mutations/createMovie"
import searchMovie from "app/movies/queries/searchMovie"

// const escapeRegexCharacters = (str) => {
//   return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
// }

const getSuggestions = async (value) => {
  // const escapedValue = escapeRegexCharacters(value.trim())
  const escapedValue = value.trim()
  if (escapedValue === "") return []

  const movies = await invoke(searchMovie, { title: escapedValue })
  //   const regex = new RegExp("\\b" + escapedValue, "i")

  if (movies) {
    return movies.filter((movie: string) => getSuggestionValue(movie))
    // return movies.filter((movie: string) => regex.test(getSuggestionValue(movie)))
  } else {
    if (movies.error) {
      return movies.error
    } else {
      return []
    }
  }
}

const getSuggestionValue = (suggestion) => {
  if (suggestion.error) {
    return `${suggestion.error}`
  } else {
    return `${suggestion.Title}`
  }
}

const renderSuggestion = (suggestion, { query }) => {
  let suggestionText: string = ""

  if (suggestion.error) {
    suggestionText = `${suggestion.error}`
  } else {
    suggestionText = `${suggestion.Title} (${suggestion.Year})`
  }

  return (
    <>
      {suggestionText && (
        <span className={"suggestion-content"}>
          {(suggestion.Poster !== "N/A" || suggestion.Poster !== undefined) && (
            <img height="100" width="60" src={suggestion.Poster} alt="Poster" />
          )}

          <span className="name">{suggestionText}</span>
        </span>
      )}
    </>
  )
}

const NewMoviePage: BlitzPage | any = ({ refetch }) => {
  const [createMovieMutation] = useMutation(createMovie)
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [searchTimeout, setSearchTimeout] = useState(0)

  const onChange = (event, { newValue }) => {
    setValue(newValue)
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const onSuggestionsFetchRequested = async ({ value }) => {
    const now = Math.floor(Date.now() / 1000)

    if (searchTimeout < now) {
      setSearchTimeout(now + 4)
      // setTimeout(async () => {
      //   setSuggestions(await getSuggestions(value))
      // }, 5000)
      setSuggestions(await getSuggestions(value))
    }
  }

  const onSuggestionSelected = async (event, { suggestion }) => {
    try {
      await createMovieMutation(suggestion)
      refetch()
      setValue("")
    } catch (error) {}
  }

  const inputProps = {
    placeholder: "Type Movie Title",
    value,
    onChange: onChange,
  }

  return (
    <div>
      <main>
        <h1>Add Movie</h1>

        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected}
          inputProps={inputProps}
        />
      </main>
      <style global jsx>{`
        main {
          align-items: center;
          margin: 20px;
          display: flex;
          background-color: #eee;
          border: 1px solid #ccc;
          border-radius: 10px;
        }

        .react-autosuggest__input {
          /*border: 0 !important;*/
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-top: 0 !important;
          border-bottom: 0 !important;
          border-radius: 0 !important;
        }

        main h1 {
          font-weight: 100;
          font-size: 20px;
          margin: 10px;
        }

        .react-autosuggest__container {
          position: relative;
        }

        .react-autosuggest__input {
          width: 50vw;
          /*width: 240px;*/
          height: 30px;
          padding: 10px 20px;
          font-family: Helvetica, sans-serif;
          font-weight: 300;
          font-size: 16px;
          border: 1px solid #aaa;
          border-radius: 4px;
        }

        .react-autosuggest__input:focus {
          outline: none;
        }

        .react-autosuggest__container--open .react-autosuggest__input {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .react-autosuggest__suggestions-container {
          display: none;
        }

        .react-autosuggest__container--open .react-autosuggest__suggestions-container {
          display: block;
          position: absolute;
          top: 51px;
          width: 280px;
          border: 1px solid #aaa;
          background-color: #fff;
          font-family: Helvetica, sans-serif;
          font-weight: 300;
          font-size: 16px;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          z-index: 2;
        }

        .react-autosuggest__suggestions-list {
          margin: 0;
          padding: 0;
          list-style-type: none;
        }

        .react-autosuggest__suggestion {
          cursor: pointer;
          padding: 10px 20px;
        }

        .react-autosuggest__suggestion:not(:first-child) {
          border-top: 1px solid #ddd;
        }

        .react-autosuggest__suggestion--focused {
          background-color: #0c7eaf;
          color: #fff;
        }

        .suggestion-content {
          display: flex;
          align-items: center;
          background-repeat: no-repeat;
        }

        .name {
          margin-left: 68px;
          line-height: 45px;
        }

        .highlight {
          color: #ee0000;
          font-weight: bold;
        }

        .react-autosuggest__suggestion--focused .highlight {
          color: #120000;
        }
      `}</style>
    </div>
  )
}

NewMoviePage.authenticate = true
NewMoviePage.getLayout = (page) => <Layout title={"Add Movie"}>{page}</Layout>

export default NewMoviePage
