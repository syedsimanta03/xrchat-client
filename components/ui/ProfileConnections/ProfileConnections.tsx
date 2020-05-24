import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { selectAuthState } from '../../../redux/auth/selector'
import SingleConnection from './SingleConnection'
import { User } from '../../../interfaces/User'
import './style.scss'

interface Props {
  auth: any
  classes: any
}

const mapStateToProps = (state: any) => {
  return {
    auth: selectAuthState(state)
  }
}

const mapDispatchToProps = () => ({})

const ProfileConnections = (props: Props) => {
  const { classes } = props
  const user = props.auth.get('user') as User

  if (!user) {
    // window.location.href = '/'
    return <div />
  }

  return (
    <div className={classes.root}>
      <div className={classes.section1}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h4">Connections</Typography>
          </Grid>
        </Grid>
      </div>

      <Divider variant="middle" />
      <SingleConnection connectionType="email" />
      <Divider variant="middle" />
      <SingleConnection connectionType="sms" />
      <Divider variant="middle" />
      <SingleConnection connectionType="password" />
      <Divider variant="middle" />
      <SingleConnection connectionType="facebook" />
      <Divider variant="middle" />
      <SingleConnection connectionType="github" />
      <Divider variant="middle" />
      <SingleConnection connectionType="google" />
    </div>
  )
}

const ProfileConnectionsWrapper = (props: any) => <ProfileConnections {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileConnectionsWrapper)
