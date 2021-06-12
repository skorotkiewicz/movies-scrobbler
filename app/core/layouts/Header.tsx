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
        <Link href="/dashboard">Movies Scrobbler</Link>
      </div>
      <div className="user">{session.userId ? <HeaderLinks /> : <>Welcome!</>}</div>
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
        .header {
          align-items: center;
          padding: 5px;
          display: flex;
          background-color: orange;
          border-bottom: 2px solid red;
        }
        .header a,
        .header button {
          color: #777;
          text-decoration: none;
          padding: 5px;
          border-bottom: 1px solid #777;
          background-color: #feb724;
        }
        .header button {
          border-top: 0;
          border-left: 0;
          border-right: 0;
          border-bottom: 1px solid #777;
          background-color: #fff5d7;
          outline: none !important;
        }

        .logo a {
          color: #333;
          font-family: "Tahoma", "Geneva", sans-serif;
          border-bottom: 0;
          padding: 0;
          /*font-family: "lucida sans unicode", "lucida grande", sans-serif;*/
          /*font-family: "palatino linotype", palatino, serif;*/
          /*font-family: impact, sans-serif;*/
        }
        .logo {
          width: 65px;
          padding: 10px;
          margin-right: 20px;
          font-weight: 100;
          text-align: center;
          border: 1px solid red;
          background-color: #feb724;
          text-decoration: none !important;
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
    <div>
      {userName ? (
        <Link href={`/dashboard`}>
          <a>Dashboard</a>
        </Link>
      ) : (
        <>
          <Link href={`/@/${session.name}`}>
            <a style={{ marginRight: 10 }}>Public Profile</a>
          </Link>
          <button onClick={async () => await setViewProfileMutation({ current: session.isPublic })}>
            {session.isPublic?.toString()}
          </button>
        </>
      )}
    </div>
  )
}
