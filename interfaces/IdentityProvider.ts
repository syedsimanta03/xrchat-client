export type IdentityProvider = {
  id: number
  token: string
  identityProviderType: string
  isVerified: boolean
  userId: string
}

export const IdentityProviderSeed: IdentityProvider = {
  id: 0,
  token: '',
  identityProviderType: '',
  isVerified: false,
  userId: ''
}
