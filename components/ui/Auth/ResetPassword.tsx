import { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import EmptyLayout from '../Layout/EmptyLayout'
import { resetPassword } from '../../../redux/auth/service'

interface Props {
  resetPassword: typeof resetPassword,
  token: string
}

const ResetPassword = (props: Props) => {
  const { resetPassword, token } = props
  const initialState = { password: '' }
  const [state, setState] = useState(initialState)

  const handleInput = (e: any) => {
    e.preventDefault()
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleReset = (e: any) => {
    e.preventDefault()
    resetPassword(token, state.password)
  }

  return (
    <EmptyLayout>
      <Container component="main" maxWidth="xs">
        <div className={'paper'}>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            Please enter your password for your email address
          </Typography>
          <form className={'form'} noValidate onSubmit={(e) => handleReset(e)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              autoComplete="password"
              autoFocus
              onChange={(e) => handleInput(e)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={'submit'}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    </EmptyLayout>
  )
}

export default ResetPassword
