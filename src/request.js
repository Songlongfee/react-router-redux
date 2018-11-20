import axios from "axios";

// const baseUrl = 'https://www.easy-mock.com/mock/5b2b5d5615c3bc6ee52cfd1b/role-list/';

const Api = {
  get(url, params) {
    return axios.get(baseUrl + url);
  },
  post(url, params) {
    return axios.post(baseUrl + url, params);
  }
};

export default Api;
