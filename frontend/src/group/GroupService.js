import axios from 'axios';
//const API_URL = 'http://localhost:8080';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true

export default class GroupService {
    constructor() {}

    getGroups() {
        //const url = '${API_URL}/group/';
        const url = '/group';
        return axios.get(url).then(response => response.data);
    }

    getGroupDetail(groupId) {
        const url = `/group/${groupId}/`;
        return axios.get(url).then(response => response.data);
    }

    createGroup(group) {
        const url = '/group/create/';
        return axios.post(url, group)
    }

    addFriend(groupId, friend) {
        const url = `/group/${groupId}/add_friend`;
        //const url = '/group/${groupId}/addFriend';
        return axios.post(url, friend);
    }

    deleteGroup(groupId) {
        const url = `/group/${groupId}/delete`;
        return axios.delete(url);
    }

    // getGroups() {
    //     return axios.get("/group").then(res => res.data)
    // }
}