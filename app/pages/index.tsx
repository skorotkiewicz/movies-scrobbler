import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <h2>Movies Scrobbler with beautiful Timelime</h2>
        <h4>Nothing more, just a nice simple timeline with watched movies and your watchlist</h4>
      </main>

      <footer>
        build with{" "}
        <span role="img" aria-labelledby="heart">
          ❤️
        </span>{" "}
        by{" "}
        <a href="https://github.com/skorotkiewicz" target="_blank" rel="noopener noreferrer">
          skorotkiewicz
        </a>
        , using blitzjs.com
      </footer>

      <style jsx>{`
        .container {
          min-height: 30vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #dbe6fd;
        }
        main h2 {
          font-weight: 100;
        }
        footer {
          position: absolute;
          bottom: 0;
          border-top: 2px solid #2f374c;
          width: 100vw;
          text-align: center;
          font-size: 12px;
          padding: 5px;
          background-color: #282c37;
          color: #dbe6fd;
        }
        footer a {
          color: #dbe6fd;
        }
      `}</style>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
