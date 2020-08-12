import axios from 'axios';

const myAxios = axios.create()
export default class UserService {


    refreshToken(token) {
        return myAxios.post("/user/refresh/", {token: token})
    }

    verifyToken(token) {
        return myAxios.post("/user/api-token-verify/", {token: token})
    }
}