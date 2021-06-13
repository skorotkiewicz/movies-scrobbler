import { useMutation, Link, Routes, useRouter, useSession, useParam } from "@blitzjs/core"
import setViewProfile from "app/movies/mutations/setViewProfile"
import logout from "app/auth/mutations/logout"

const Header = () => {
  const session = useSession()
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  return (
    <div className="headerTop">
      <div className="header">
        <div className="logo">
          {/* <Link href="/dashboard">Movies Scrobbler</Link> */}

          <span className="logo___1">Movies</span>
          <span className="logo___2">
            <Link href="/dashboard">Scrobbler</Link>
          </span>
        </div>
        <div className="user">
          {session.userId ? (
            <HeaderLinks />
          ) : (
            <div style={{ color: "#fff" }}>the easiest way to scrobble movies</div>
          )}
        </div>
        <div className="links">
          {session.userId ? (
            <>
              <Link href="/change-password">CP</Link>
              <a
                href="#"
                onClick={async () => {
                  await logoutMutation()
                  router.push("/")
                }}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <Link href={Routes.SignupPage()}>
                <a>
                  <strong>Sign Up</strong>
                </a>
              </Link>
              <Link href={Routes.LoginPage()}>
                <a>
                  <strong>Login</strong>
                </a>
              </Link>
            </>
          )}
        </div>
      </div>

      <style global jsx>{`
        body {
          background-color: #191b22;
          font-family: Helvetica, sans-serif;
        }
        .profileDesc {
          color: #9baec8 !important;
          border: 0 !important;
          background-color: #282c37 !important;
          border-top: 4px solid #2f374c !important;
        }
        main h1 {
          width: 200px;
        }
        @media only screen and (max-width: 450px) {
          .poster,
          main h1 {
            display: none;
          }
        }
        .react-confirm-alert-overlay {
          background-color: transparent !important;
        }
        .header {
          align-items: center;
          padding: 5px;
          display: flex;
          background-color: #2f374c;
          /*border-bottom: 4px solid orange;*/
          max-width: 800px;
          margin: 0 auto;
        }
        .headerTop {
          background-color: #2f374c;
          border-bottom: 1px solid #606984;
        }
        .header a,
        .header button {
          color: #fff;
          text-decoration: none;
          padding: 5px;
          background-color: #1d8fe7;
        }
        .header button {
          border-top: 0;
          border-left: 0;
          border-right: 0;
          outline: none !important;
        }
        .logo {
          color: #fff;
          padding: 10px;
          margin-right: 20px;
          font-weight: 100;
          text-decoration: none !important;
        }
        .logo___1 {
          display: flex;
          background-color: #1d8fe7;
          transform: rotate(-7deg) !important;
          border-bottom: 2px solid red;
        }
        .logo___2 {
          display: flex;
          background-color: #1d8fe7;
          transform: rotate(-3deg) !important;
        }
        .links a {
          margin-right: 10px;
        }
        .user {
          display: flex;
          flex: 1;
          justify-content: flex-start;
        }
        .links {
          justify-content: flex-end;
        }

        .submitForm {
          background-color: #282c37;
          padding: 10px;
          margin: 10px;
          color: #dbe6fd;
        }
        .submitForm button,
        .submitForm input {
          padding: 5px;
          background-color: #444b5d;
          color: #fff;
          border: 0;
        }
        .submitForm a {
          color: #fff;
        }
        .submitForm button {
          margin-left: 20px;
          padding: 10px;
        }

        ::-webkit-input-placeholder {
          color: #9baec8;
        }
        :-ms-input-placeholder {
          color: #9baec8;
        }
        ::placeholder {
          color: #9baec8;
        }
        input:focus {
          outline: none;
          border-bottom: 4px solid #606984;
        }
      `}</style>
    </div>
  )
}

export default Header

export const HeaderLinks = () => {
  const [setViewProfileMutation] = useMutation(setViewProfile)

  const session = useSession()
  const userName = useParam("userName", "string")

  return (
    <div style={{ transform: "rotate(-1deg)" }}>
      {userName ? (
        <Link href={`/dashboard`}>
          <a>Dashboard</a>
        </Link>
      ) : (
        <div className="usersHeaderLinks">
          <div className="publicProfile">
            <Link href={`/@/${session.name}`}>
              <a style={{ marginRight: 10 }}>Public Profile</a>
            </Link>
            <button
              style={{
                marginLeft: -10,
                cursor: "pointer",
                borderBottom: `2px solid ${session.isPublic ? "orange" : "red"}`,
              }}
              onClick={async () => await setViewProfileMutation({ current: session.isPublic })}
            >
              {session.isPublic?.toString()}
            </button>
          </div>
          <div className="watchlist">
            <Link href={`/watchlist`}>
              <a style={{ marginRight: 10 }}>Watchlist</a>
            </Link>
          </div>
        </div>
      )}

      <style global jsx>{`
        .usersHeaderLinks {
          display: flex;
        }
        .watchlist {
          margin-left: 15px;
          transform: rotate(3deg);
        }
      `}</style>
    </div>
  )
}
