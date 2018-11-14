import httpService from './httpervice'

const ApiEndpoint = `${process.env.REACT_APP_APIENDPOINT}/forcepassword`; 

export function forcePasswordUpdate(data)
{
    return httpService.patch(ApiEndpoint, data);

}