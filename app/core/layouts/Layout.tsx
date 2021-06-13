import { ReactNode } from "react"
import { Head } from "blitz"
import Header from "./Header"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "WatchedMovies"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="app">{children}</div>

      <style global jsx>{`
        html,
        body {
          margin: 0;
        }
        .app {
          margin: 0 auto;
          max-width: 760px;
        }
      `}</style>
    </>
  )
}

export default Layout
