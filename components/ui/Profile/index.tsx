import { Fragment, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { Tabs, Tab } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
import UserProfile from './UserIcon'
import UserSettings from './userSettings'
import './style.scss'

interface Props {
  open: boolean
  handleClose: any
  avatarUrl: string,
  auth: any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    },
    subscriptionTitle: {
      display: 'flex',
      'justify-content': 'center',
      'font-size': '2em',
      'font-weight': 'bold'
    },
    subscriptionBody: {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center'
    }
  })
)

const TabPanel = (props: any) => <Fragment>{props.value === props.index && props.children}</Fragment>

const ProfileModal = (props: Props) => {
  const classes = useStyles()
  const [tabIndex, setTabIndex] = useState(0)
  const authUser = props.auth.get('user')

  const handleChange = (event: any, newValue: number) => {
    event.preventDefault()
    setTabIndex(newValue)
  }
  const avatar = (
    <TabPanel value={tabIndex} index={0}>
      <UserProfile avatarUrl={props.avatarUrl} auth={props.auth} />
    </TabPanel>
  )
  const settings = (
    <TabPanel value={tabIndex} index={1}>
      <UserSettings />
    </TabPanel>
  )
  const account = (
    <TabPanel value={tabIndex} index={2}>
      Accounts
    </TabPanel>
  )
  const subscription = (
    <TabPanel value={tabIndex} className="subscription-profile" index={3}>
      <div className={classes.subscriptionTitle}>Your Subscription</div>
      {authUser.subscription == null && <div className={classes.subscriptionBody}>Free Tier</div>}
      {authUser.subscription != null &&
        <div className={classes.subscriptionBody}>
          <div>Plan: {authUser.subscription.subscriptionType.name}</div>
          <div>Seats: {authUser.subscription.subscriptionType.seats}</div>
        </div>
      }
    </TabPanel>
  )
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="modal"
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={props.open}>
          <div className="paper">
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="secondary"
              aria-label="Login Configure"
            >
              <Tab
                icon={<AccountCircleIcon style={{ fontSize: 15 }} />}
                label="Profile"
              />
              <Tab
                icon={<SettingsIcon style={{ fontSize: 15 }} />}
                label="Settings"
              />
              <Tab
                icon={<AccountBoxIcon style={{ fontSize: 15 }} />}
                label="Accounts"
              />
              <Tab
                icon={<SupervisedUserCircleIcon style={{ fontSize: 15 }} />}
                label="Subscription"
              />
            </Tabs>
            {avatar}
            {settings}
            {account}
            {subscription}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default ProfileModal
