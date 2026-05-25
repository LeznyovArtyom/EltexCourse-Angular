export interface ApiRegisterResponse {
  message: string,
  user: ApiUserResponse
}

export interface ApiUserResponse {
  id: string,
  username: string,
  password?: string,
  email: string,
  createdAt: string,
  lastActiveTime: string,
  isBlocked: boolean,
  role: string
}

export interface ApiLoginResponse {
  access_token: string,
  token_type: string,
  expires_in: string,
  user: {
      id: string,
      username: string,
      email: string,
      role: string
  }
}

export interface ApiUserInfoResponse {
  id: string,
  username: string,
  email: string,
  role: string
}

export interface ApiLogoutResponse {
  message: string
}