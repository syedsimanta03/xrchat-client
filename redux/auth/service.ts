import { Dispatch } from 'redux'
import {
  EmailLoginForm,
  EmailRegistrationForm,
  didLogout,
  loginUserSuccess,
  loginUserError,
  registerUserByEmailSuccess,
  registerUserByEmailError,
  didVerifyEmail,
  actionProcessing,
  didResendVerificationEmail,
  didForgotPassword,
  didResetPassword,
  didCreateMagicLink,
  updateSettings,
  loadedUserData,
  avatarUpdated,
  usernameUpdated
} from './actions'
import { client } from '../feathers'
import { dispatchAlertError, dispatchAlertSuccess } from '../alert/service'
import { validateEmail, validatePhoneNumber } from '../helper'
import { axiosRequest, apiUrl } from '../service.common'

import { resolveUser } from '../../interfaces/User'
import { resolveAuthUser } from '../../interfaces/AuthUser'
import { IdentityProvider } from '../../interfaces/IdentityProvider'
import getConfig from 'next/config'
import { getStoredState } from '../persisted.store'
import axios from 'axios'

const { publicRuntimeConfig } = getConfig()
const apiServer: string = publicRuntimeConfig.apiServer
const authConfig = publicRuntimeConfig.auth

export async function doLoginAuto (dispatch: Dispatch) {
  const authData = getStoredState('auth')
  const accessToken = authData && authData.authUser ? authData.authUser.accessToken : undefined

  if (!accessToken) {
    return
  }

  await (client as any).authentication.setAccessToken(accessToken as string);
  (client as any).reAuthenticate()
    .then((res: any) => {
      if (res) {
        const authUser = resolveAuthUser(res)
        dispatch(loginUserSuccess(authUser))
        loadUserData(dispatch, authUser.identityProvider.userId)
      } else {
        console.log('****************')
      }
    })
    .catch((e) => {
      dispatch(didLogout())

      console.log(e)
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    })
}

export function loadUserData (dispatch: Dispatch, userId: string) {
  client.service('user').get(userId)
    .then((res: any) => {
      const user = resolveUser(res)
      dispatch(loadedUserData(user))
    })
    .catch((err: any) => {
      console.log(err)
      dispatchAlertError(dispatch, 'Failed to loading user data')
    })
}

export function loginUserByPassword (form: EmailLoginForm) {
  return (dispatch: Dispatch) => {
    // check email validation.
    if (!validateEmail(form.email)) {
      dispatchAlertError(dispatch, 'Please input valid email address')

      return
    }

    dispatch(actionProcessing(true));

    (client as any).authenticate({
      strategy: 'local',
      email: form.email,
      password: form.password
    })
      .then((res: any) => {
        const authUser = resolveAuthUser(res)

        if (!authUser.identityProvider.isVerified) {
          (client as any).logout()

          window.location.href = '/auth/confirm'
          dispatch(registerUserByEmailSuccess(authUser.identityProvider))
          return
        }

        window.location.href = '/'
        dispatch(loginUserSuccess(authUser))

        loadUserData(dispatch, authUser.identityProvider.userId)
      })
      .catch((err: any) => {
        console.log(err)

        dispatch(loginUserError('Failed to login'))
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function loginUserByGithub () {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))
    window.location.href = `${apiServer}/oauth/github`
  }
}

export function loginUserByGoogle () {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))
    window.location.href = `${apiServer}/oauth/google`
  }
}

export function loginUserByFacebook () {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    window.location.href = `${apiServer}/oauth/facebook`
  }
}

export function loginUserByJwt (accessToken: string, redirectSuccess: string, redirectError: string): any {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true));

    (client as any).authenticate({
      strategy: 'jwt',
      accessToken
    })
      .then((res: any) => {
        const authUser = resolveAuthUser(res)

        window.location.href = redirectSuccess
        dispatch(loginUserSuccess(authUser))
        loadUserData(dispatch, authUser.identityProvider.userId)
      })
      .catch((err: any) => {
        console.log(err)
        window.location.href = redirectError
        dispatch(loginUserError('Failed to login'))
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function logoutUser () {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true));
    (client as any).logout()
      .then(() => dispatch(didLogout()))
      .catch(() => dispatch(didLogout()))
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function registerUserByEmail (form: EmailRegistrationForm) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('identity-provider').create({
      token: form.email,
      password: form.password,
      type: 'password'
    })
      .then((identityProvider: any) => {
        window.location.href = '/auth/confirm'
        dispatch(registerUserByEmailSuccess(identityProvider))
      })
      .catch((err: any) => {
        console.log(err)
        dispatch(registerUserByEmailError(err.message))
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function verifyEmail (token: string) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('authManagement').create({
      action: 'verifySignupLong',
      value: token
    })
      .then((res: any) => {
        dispatch(didVerifyEmail(true))
        loginUserByJwt(res.accessToken, '/', '/')(dispatch)
      })
      .catch((err: any) => {
        console.log(err)
        dispatch(didVerifyEmail(false))
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function resendVerificationEmail (email: string) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('authManagement').create({
      action: 'resendVerifySignup',
      value: {
        token: email,
        type: 'password'
      }
    })
      .then(() => dispatch(didResendVerificationEmail(true)))
      .catch(() => dispatch(didResendVerificationEmail(false)))
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function forgotPassword (email: string) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('authManagement').create({
      action: 'sendResetPwd',
      value: {
        token: email,
        type: 'password'
      }
    })
      .then(() => dispatch(didForgotPassword(true)))
      .catch(() => dispatch(didForgotPassword(false)))
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function resetPassword (token: string, password: string) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('authManagement').create({
      action: 'resetPwdLong',
      value: { token, password }
    })
      .then((res: any) => {
        console.log(res)
        window.location.href = '/'
        dispatch(didResetPassword(true))
      })
      .catch((err: any) => {
        console.log(err)
        window.location.href = '/'
        dispatch(didResetPassword(false))
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function createMagicLink (emailPhone: string, linkType?: 'email' | 'sms') {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    let type = 'email'
    let paramName = 'email'
    const enableEmailMagicLink = (authConfig && authConfig.enableEmailMagicLink) ?? true
    const enableSmsMagicLink = (authConfig && authConfig.enableSmsMagicLink) ?? false

    if (linkType === 'email') {
      type = 'email'
      paramName = 'email'
    } else if (linkType === 'sms') {
      type = 'sms'
      paramName = 'mobile'
    } else {
      if (validatePhoneNumber(emailPhone)) {
        if (!enableSmsMagicLink) {
          dispatchAlertError(dispatch, 'Please input valid email address')

          return
        }
        type = 'sms'
        paramName = 'mobile'
      } else if (validateEmail(emailPhone)) {
        if (!enableEmailMagicLink) {
          dispatchAlertError(dispatch, 'Please input valid phone number')

          return
        }
        type = 'email'
      } else {
        dispatchAlertError(dispatch, 'Please input valid email or phone number')

        return
      }
    }

    client.service('magiclink').create({
      type,
      [paramName]: emailPhone
    })
      .then((res: any) => {
        console.log(res)
        dispatch(didCreateMagicLink(true))
        dispatchAlertSuccess(dispatch, 'Login Magic Link was sent. Please check your Email or SMS.')
      })
      .catch((err: any) => {
        console.log(err)
        dispatch(didCreateMagicLink(false))
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function addConnectionByPassword (form: EmailLoginForm, userId: string) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('identity-provider').create({
      token: form.email,
      password: form.password,
      type: 'password',
      userId
    })
      .then((res: any) => {
        const identityProvider = res as IdentityProvider
        loadUserData(dispatch, identityProvider.userId)
      })
      .catch((err: any) => {
        console.log(err)
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function addConnectionByEmail (email: string, userId: string) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('magiclink').create({
      email,
      type: 'email',
      userId
    })
      .then((res: any) => {
        const identityProvider = res as IdentityProvider
        loadUserData(dispatch, identityProvider.userId)
      })
      .catch((err: any) => {
        console.log(err)
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function addConnectionBySms (phone: string, userId: string) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('magiclink').create({
      mobile: phone,
      type: 'sms',
      userId
    })
      .then((res: any) => {
        const identityProvider = res as IdentityProvider
        loadUserData(dispatch, identityProvider.userId)
      })
      .catch((err: any) => {
        console.log(err)
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function addConnectionByOauth (oauth: 'facebook' | 'google' | 'github', userId: string) {
  return (/* dispatch: Dispatch */) => {
    window.open(`${apiServer}/oauth/${oauth}?userId=${userId}`, '_blank')
  }
}

export function removeConnection (identityProviderId: number, userId: string) {
  return (dispatch: Dispatch) => {
    dispatch(actionProcessing(true))

    client.service('identity-provider').remove(identityProviderId)
      .then(() => {
        loadUserData(dispatch, userId)
      })
      .catch((err: any) => {
        console.log(err)
        dispatchAlertError(dispatch, err.message)
      })
      .finally(() => dispatch(actionProcessing(false)))
  }
}

export function refreshConnections (userId: string) { (dispatch: Dispatch) => loadUserData(dispatch, userId) }

export const updateUserSettings = (id: any, data: any) => async (dispatch: any) => {
  const res = await axiosRequest('PATCH', `${apiUrl}/user-settings/${id}`, data)
  dispatch(updateSettings(res.data))
}

export function uploadAvatar (data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const token = getState().get('auth').get('authUser').accessToken
    const res = await axios.post(`${apiUrl}/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token
      }
    })
    const result = res.data
    dispatchAlertSuccess(dispatch, 'Avatar updated')
    dispatch(avatarUpdated(result))
  }
}

export function updateUsername (userId: string, name: string) {
  return (dispatch: Dispatch) => {
    client.service('user').patch(userId, {
      name: name
    })
      .then((res: any) => {
        dispatchAlertSuccess(dispatch, 'Username updated')
        dispatch(usernameUpdated(res))
      })
  }
}
