import axios from "axios";

// const baseUrl = 'https://www.easy-mock.com/mock/5b2b5d5615c3bc6ee52cfd1b/role-list/';
// const baseUrl = "http://172.22.200.75:8081/commonModule/"; //角色接口 齐升
// const baseUrl = "http://172.22.200.63:8081/commonModule/"; //员工接口 刘靖宇
const baseUrl = "http://192.168.9.82:8081/commonModule/"; //服务器

const Api = {
  get(url, params) {
    return axios.get(baseUrl + url);
  },
  post(url, params) {
    return axios.post(baseUrl + url, params);
  }
};

export default Api;
