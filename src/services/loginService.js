import httpService from './httpervice'
import config from "../config.json"
import jwtDecode from 'jwt-decode'



const loginApiEndpoint = `${config.apiEndpoint}/login`;
const tokenKey = config.tokenKey;

httpService.setjwt(getjwt())

export async function login(credentials)
{
  let {data} = await httpService.post(loginApiEndpoint, credentials)
  console.log(process.env.REACT_APP_APIENDPOINT)
  console.log(process.env);
  console.log(REACT_APP_APIENDPOINT)
  localStorage.setItem(tokenKey, data.token)
  
  return;
}

export function logout ()
{
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser()
{
  try{
    let token = localStorage.getItem(tokenKey)
    return jwtDecode(token)
  }
  catch(ex)
  {
    return null
  }
}

  export function loginWithJWT (jwt)
  {
    localStorage.setItem(tokenKey,jwt)
  }

  export function getjwt()
  {
    console.log( localStorage.getItem(tokenKey))
  }
  