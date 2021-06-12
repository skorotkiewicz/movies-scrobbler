import { useMutation, Link, Routes, useRouter, useSession, useParam } from "@blitzjs/core"
import setViewProfile from "app/movies/mutations/setViewProfile"
import logout from "app/auth/mutations/logout"

const Header = () => {
  const session = useSession()
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  return (
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
      <style global jsx>{`
        body {
          /*background-color: #f6f8fa;*/
          font-family: Helvetica, sans-serif;
        }
        .header {
          align-items: center;
          padding: 5px;
          display: flex;
          /*background-color: orange;*/
          background-color: #2f374c;
          /*border-bottom: 2px solid red;*/
        }
        .header a,
        .header button {
          /*color: #777;*/
          color: #fff;
          text-decoration: none;
          padding: 5px;
          /*border-bottom: 1px solid #777;*/
          /*background-color: #feb724;*/
          background-color: #1d8fe7;
        }
        .header button {
          border-top: 0;
          border-left: 0;
          border-right: 0;
          /*border-bottom: 2px solid red;*/
          /*background-color: #fff5d7;*/
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
        <div>
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
      )}
    </div>
  )
}
