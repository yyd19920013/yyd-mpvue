import md5 from 'md5';
import {wxRequest} from 'js/yydjs.js';

const URL='https://www.muyouche.com';//域名

const API=(config)=>{
    // let arr=config.url.split('/');
    // let testToken=['68c476b0-aeb4-4f08-a8a4-86ae82863eaf'];

    // //lStore.set('token',testToken[0]);

    // delete config.url;
    // config.url=URL+'/*.jsonRequest';
    // config.header={
    //     'X-Access-Token':wx.getStorageSync('token')||testToken[0],
    //     'X-Service-Id':'cas.wxregistrationService',
    //     'X-Service-Method':'findAreaOrg',

    // };

    wxRequest(config);
};

//axios请求示例
const testAxios=(data,endFn)=>{
    API({
        url:URL+'/action2/AllProvince.ashx',
        method:'post',
        data:data,
        success:(res)=>{
            endFn&&endFn(res);
        },
    });
};

export{
        URL,//域名
        API,//api请求函数
        testAxios,//axios请求示例
    };