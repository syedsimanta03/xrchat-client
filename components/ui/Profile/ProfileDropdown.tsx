import { KeyboardEvent, MouseEvent, useRef, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ProfileModal from './index'
import Router from 'next/router'

import Avatar from '@material-ui/core/Avatar'

interface Props {
  avatar: any,
  logoutUser: any,
  auth: any
}

const MenuListComposition = (props: Props) => {
  const { avatar, logoutUser, auth } = props
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }
  const handleModal = () => {
    setModalOpen(true)
    setOpen(false)
  }
  const handleClose = (event: MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }
  const handleLogout = () => {
    logoutUser()
    setOpen(false)
  }

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  const handleContacts = () => {
    Router.push('/friends/friends')
  }
  const handleAdminConsole = () => {
    Router.push('/admin')
  }
  const modalClose = () => {
    setModalOpen(false)
  }
  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div className="root">
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {avatar ? (
            <Avatar alt="User Avatar Icon" src={avatar} />
          ) : (
            <Avatar alt="User Avatar">X</Avatar>
          )}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleModal}>Profile</MenuItem>
                    <MenuItem onClick={handleContacts}>Contacts</MenuItem>
                    {auth.get('user').userRole === 'admin' && <MenuItem onClick={handleAdminConsole}>Admin Console</MenuItem> }
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <ProfileModal
        open={modalOpen}
        handleClose={modalClose}
        avatar={avatar}
      />
    </div>
  )
}

export default MenuListComposition