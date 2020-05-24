import { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { selectUserState } from '../../../redux/user/selector'
import { selectAuthState } from '../../../redux/auth/selector'
import { User } from '../../../interfaces/User'
import { Button } from '@material-ui/core'
import UserItem from './UserItem'
import { Relationship } from '../../../interfaces/Relationship'
import { Dispatch, bindActionCreators } from 'redux'
import { getUserRelationship } from '../../../redux/user/service'
import NextLink from 'next/link'
import './style.scss'

const mapStateToProps = (state: any) => {
  return {
    userState: selectUserState(state),
    authState: selectAuthState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getUserRelationship: bindActionCreators(getUserRelationship, dispatch)
})

interface Props {
  userState: any
  authState: any
  getUserRelationship: typeof getUserRelationship
}

const MyFriends = (props: Props) => {
  const { userState, authState, getUserRelationship } = props
  const initialState = {
    userId: undefined,
    updateNeeded: false
  }

  const [state, setState] = useState(initialState)

  const relationship = userState.get('relationship') as Relationship
  const friends = relationship.friend
  const requested = relationship.requested
  const friendsCount = friends?.length + requested?.length

  const loadUserRelationship = (userId: string, forceUpdate: boolean) => {
    if (userId && (forceUpdate || (userId !== state.userId && userId && userId !== ''))
    ) {
      getUserRelationship(userId)
      setState({ ...state, userId })
    }
  }

  useEffect(() => {
    const user = authState.get('user') as User
    loadUserRelationship(user.id, false)
  }, [])

  useEffect(() => {
    const user = authState.get('user') as User
    const updateNeeded = userState.get('updateNeeded')
    loadUserRelationship(user.id, updateNeeded)
  }, [authState, userState])

  return (
    <div className="root">
      <div className="section1">
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h4">Friends</Typography>
          </Grid>
        </Grid>

        { friends && friends.length > 0 &&
          friends.map((friend) => {
            return <UserItem key={'friend_' + friend.id} data={friend}/>
          })
        }
        { requested && requested.length > 0 &&
          requested.map((friend) => {
            return <UserItem key={'requested_' + friend.id} data={friend}/>
          })
        }

        { (friendsCount === 0) &&
         <Grid container alignItems="center">
           <Grid item xs>
             <Typography variant="body2">
              Add some friends!
             </Typography>
           </Grid>
         </Grid>
        }
      </div>

      <Divider variant="middle" />
      <Grid container>
        <Grid item xs>
          <NextLink href={'/friends/find'}>
            <Button variant="contained" color="primary">
              + Add a Friend
            </Button>
          </NextLink>
        </Grid>
      </Grid>

      {friends &&
        friends.length > 0 &&
        friends.map((friend) => {
          return <UserItem key={'frend_' + friend.id} data={friend} />
        })}
      {requested &&
        requested.length > 0 &&
        requested.map((friend) => {
          return <UserItem key={'requested_' + friend.id} data={friend} />
        })}

      {friendsCount === 0 && (
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="body2">
              There is no friends. Please add the friends.
            </Typography>
          </Grid>
        </Grid>
      )}
    </div>
  )
}

const MyFriendsWrapper = (props: any) => <MyFriends {...props} />

export default connect(mapStateToProps, mapDispatchToProps)(MyFriendsWrapper)
