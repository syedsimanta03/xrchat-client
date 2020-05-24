import { useEffect } from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { selectDialogState } from '../../../redux/dialog/selector'
import { closeDialog } from '../../../redux/dialog/service'
import { bindActionCreators, Dispatch } from 'redux'
import Router from 'next/router'
import './style.scss'

interface Props {
  dialog: any
  closeDialog: typeof closeDialog
}

const mapStateToProps = (state: any) => {
  return {
    dialog: selectDialogState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeDialog: bindActionCreators(closeDialog, dispatch)
})

const UIDialog = (props: Props) => {
  const { dialog, closeDialog } = props
  const isOpened = dialog.get('isOpened')
  const content = dialog.get('content')

  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      closeDialog()
    })
  }, [])

  const handleClose = (e: any) => {
    e.preventDefault()
    closeDialog()
  }

  return (
    <Dialog open={isOpened} onClose={handleClose} aria-labelledby="xr-dialog">
      <DialogTitle disableTypography className="dialogTitle">
        <Typography variant="h6">{(content && content.title) ?? ''}</Typography>
        <IconButton
          aria-label="close"
          className="dialogCloseButton"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="dialogContent">
        {content && content.children}
      </DialogContent>
    </Dialog>
  )
}

const DialogWrapper = (props: any) => <UIDialog {...props } />

export default connect(mapStateToProps, mapDispatchToProps)(DialogWrapper)
