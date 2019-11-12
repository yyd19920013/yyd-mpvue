import md5 from 'md5';
import { wxRequest } from 'js/yydjs.js';

const URL = 'https://www.muyouche.com'; //域名
const APPID = 'wx3e537ff35bec6691'; //小程序ID

const API = (config) => {
    wxRequest(config);
};

//axios请求示例
const testWxRequest = (data, endFn) => {
    API({
        url: URL + '/action2/AllProvince.ashx',
        method: 'post',
        data: data,
        success: (res) => {
            endFn && endFn(res);
        },
    });
};

export {
    URL, //域名
    APPID, //小程序ID
    API, //api请求函数
    testWxRequest, //wxRequest请求示例
};
