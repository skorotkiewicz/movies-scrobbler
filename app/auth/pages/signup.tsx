import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      {/* <SignupForm onSuccess={() => router.push(Routes.Home())} /> */}
      <SignupForm onSuccess={() => router.push("/dashboard")} />
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/dashboard"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
