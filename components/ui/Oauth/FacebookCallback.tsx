import { useRouter, NextRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { loginUserByJwt, refreshConnections } from '../../../redux/auth/service'
import { Container } from '@material-ui/core'
import { selectAuthState } from '../../../redux/auth/selector'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

type Props = {
  auth: any
  router: NextRouter
  loginUserByJwt: typeof loginUserByJwt,
  refreshConnections: typeof refreshConnections
}

const mapStateToProps = (state: any) => {
  return {
    auth: selectAuthState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginUserByJwt: bindActionCreators(loginUserByJwt, dispatch),
  refreshConnections: bindActionCreators(refreshConnections, dispatch)
})

const FacebookCallback = (props: Props) => {
  const { auth, loginUserByJwt, refreshConnections, router } = props

  const initialState = { error: '', token: '' }
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const error = router.query.errror as string
    const token = router.query.token as string
    const type = router.query.type as string

    if (!error) {
      if (type === 'connection') {
        const user = auth.get('user')
        refreshConnections(user.id)
      } else {
        loginUserByJwt(token, '/', '/')
      }
    }

    setState({ ...state, error, token })
  }, [])

  return state.error && state.error !== '' ? (
    <Container>
      Facebook authentication failed.
      <br />
      {state.error}
    </Container>
  ) : (
    <Container>Authenticating...</Container>
  )
}

const FacebookHomeWrapper = (props: any) => <FacebookCallback {...props} router={ useRouter() } />

export default connect(mapStateToProps, mapDispatchToProps)(FacebookHomeWrapper)
