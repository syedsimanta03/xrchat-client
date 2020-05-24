import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { resendVerificationEmail } from '../../../redux/auth/service'
import { selectAuthState } from '../../../redux/auth/selector'
import EmptyLayout from '../Layout/EmptyLayout'
import { IdentityProvider } from '../../../interfaces/IdentityProvider'
import './style.scss'

const mapStateToProps = (state: any) => {
  return {
    auth: selectAuthState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resendVerificationEmail: bindActionCreators(resendVerificationEmail, dispatch)
})

interface Props {
  auth: any
  resendVerificationEmail: typeof resendVerificationEmail
}

const ConfirmEmail = ({ auth, resendVerificationEmail }: Props) => {
  const handleResendEmail = (e: any) => {
    e.preventDefault()

    const identityProvider = auth.get('identityProvider') as IdentityProvider
    console.log('---------', identityProvider)
    resendVerificationEmail(identityProvider.token)
  }

  return (
    <EmptyLayout>
      <Container component="main" maxWidth="md">
        <div className={'paper'}>
          <Typography component="h1" variant="h5">
            Confirmation Email
          </Typography>
          <Box mt={3}>
            <Typography variant="body2" color="textSecondary" align="center">
                Please check your email to verify your account.
                If you didn&apos;t get an email, please click
              <Button onClick={(e) => handleResendEmail(e)}>here</Button> to resend the verification email.
            </Typography>
          </Box>
        </div>
      </Container>
    </EmptyLayout>
  )
}

const ConfirmEmailWrapper = (props) => <ConfirmEmail {...props}/>

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmEmailWrapper)
