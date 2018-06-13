import { InitParams, LoginOptions } from 'ngx-facebook';
import { environment } from '../environments/environment';

// Name of token in local storage
export const LOCALSTORAGE_TOKEN_KEY = 'beton:token';

// API paths
const SERVER_PATH = environment.serverPath;
const API_PATH = SERVER_PATH + environment.apiPath;
export { SERVER_PATH, API_PATH };

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
