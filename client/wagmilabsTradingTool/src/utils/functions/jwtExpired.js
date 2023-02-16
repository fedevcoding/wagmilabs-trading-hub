import * as jwt_decode from 'jwt-decode';

export const jwtExpired = async (token) => {
    const decoded = await jwt_decode(token);
    return decoded.exp * 1000 > new Date().getTime();
}