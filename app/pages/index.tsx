import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <h2>Movies Scrobbler with beautiful Timelime</h2>
        <h4>Nothing more, just a nice timeline with watched movies</h4>
      </main>

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
        }
        main h2 {
          font-weight: 100;
          color: #333;
        }
      `}</style>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
