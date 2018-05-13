import { InitParams, LoginOptions } from 'ngx-facebook';

// Name of token in local storage
export const LOCALSTORAGE_TOKEN_KEY = 'beton:token';

// API paths
export const API_SERVER = 'http://localhost:3000/';
export const API_PATH = 'v1/api/';

// Facebook App Params
export const FB_PARAMS: InitParams = {
  appId: '109487589751084',
  xfbml: true,
  version: 'v3.0'
};

// Facebook login options
export const FB_OPTIONS: LoginOptions = {
  enable_profile_selector: true,
  return_scopes: true,
  scope: 'public_profile, email'
};
