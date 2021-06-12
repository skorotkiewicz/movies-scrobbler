import { BlitzPage, Link, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ChangePassword } from "app/auth/validations"
import changePassword from "app/auth/mutations/changePassword"

const ChangePasswordPage: BlitzPage = () => {
  const [changePasswordMutation, { isSuccess }] = useMutation(changePassword)

  return (
    <div>
      <h1>Change Your Password</h1>

      {isSuccess ? (
        <div>
          <h2>Password Change Successfully</h2>
          <p>
            Go to the <Link href={`/dashboard`}>dashboard</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Change Password"
          schema={ChangePassword}
          initialValues={{ currentPassword: "", newPassword: "", passwordConfirmation: "" }}
          onSubmit={async (values) => {
            try {
              await changePasswordMutation(values)
            } catch (error) {
              if (error.name === "ChangePasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }
          }}
        >
          <LabeledTextField name="currentPassword" label="Current Password" type="password" />
          <LabeledTextField name="newPassword" label="New Password" type="password" />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
          />
        </Form>
      )}

      <style global jsx>{`
        label {
          margin: 20px;
        }
      `}</style>
    </div>
  )
}

ChangePasswordPage.authenticate = true
ChangePasswordPage.getLayout = (page) => <Layout title="Change Your Password">{page}</Layout>

export default ChangePasswordPage
