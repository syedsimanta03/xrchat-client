import React, { useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import './auth.scss'
import PropTypes, { InferProps } from 'prop-types'
import EmptyLayout from '../Layout/EmptyLayout'

const VerifyEmail = (props: InferProps<typeof VerifyEmail.propTypes>) => {
  const { verifyEmail, token } = props

  useEffect(() => {
    verifyEmail(token)
  })

  return (
    <EmptyLayout>
      <Container component="main" maxWidth="md">
        <div className={'paper'}>
          <Typography component="h1" variant="h5">
            Verify Email
          </Typography>

          <Box mt={3}>
            <Typography variant="body2" color="textSecondary" align="center">
              Please wait a moment while processing...
            </Typography>
          </Box>
        </div>
      </Container>
    </EmptyLayout>
  )
}

VerifyEmail.propTypes = {
  token: PropTypes.string.isRequired,
  verifyEmail: PropTypes.func.isRequired
}

export default VerifyEmail
