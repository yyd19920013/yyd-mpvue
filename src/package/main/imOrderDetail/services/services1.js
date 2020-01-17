import { 
    APPID,
    ProductCode,
    TenantId,
    RoleId,
    IHURL,
    IHRequest,
    WexinRequest,
    WexinUpload,
    getAccessToken
} from './index';
import { wxToast } from 'js/yydjs';

// 首页
const residentIndex = ()=> {
    return IHRequest({
        url: '/cas_ih_foshan.wx_indexService/residentIndex',
        method: 'post',
        data:[]
    });
}

//微信授权登录
const decodeUserInfo = ({
    encryptedData,
    iv,
    code
}, success) => {
    var params = {
        encryptedData,
        iv,
        code,
        appId:APPID,
        tenantId:TenantId,
        roleId:RoleId,
        productCode:ProductCode
    };
    return WexinRequest({
        url: '/cas.wxLogonService/decodeUserInfoIh',
        method: 'post',
        data:[params],
        success,
    });
};

// 获取微信手机号
const getWxPhoneNumber = ({
    encryptedData,
    iv,
    openId
}, success) => {
    var params = {
        encryptedData,
        iv,
        openId,
    };
    return WexinRequest({
        url: '/cas.wxLogonService/getWxPhoneNumber',
        method: 'post',
        data:[params],
        success,
    });
};

// 微信页面注册,不校验验证码
const registerWX = ({
    loginName,
    unionId,
    openId
}, success) => {
    var params = {
        loginName,
        // unionId,
        openId,
        roleId:RoleId,
        appId:APPID,
        isFwh:true,
        productCode:ProductCode
    };
    return WexinRequest({
        url: '/cas.wxLogonService/registerNoCode',
        method: 'post',
        data:[params],
        success,
    });
};


// 手机号注册登录
const registerPhone = ({
    loginName,
    identifyingCode,
    openId,
    unionId
  }, success) => {
    var params = {
        loginName,
        identifyingCode,
        openId,
        // unionId,
        isFwh:true,
        appId:APPID,
        roleId:RoleId,
        productCode:ProductCode
    }
    return WexinRequest({
        url: '/cas.wxLogonService/loginByLoginName',
        method: 'post',
        data:[params],
        success,
    });
};

// 注册获取验证码
const registerSmsCode = (phoneNo, success) => {
    var params = [ProductCode,phoneNo]
    return WexinRequest({
        url: '/cas.wxregisterService/registerSmsCodeNew',
        method: 'post',
        data:params,
        success,
    });
};


// 退出登录
const logout = (openId,success) => {
    return WexinRequest({
        url: '/cas.wxLogonService/logout',
        method: 'post',
        data:[
            APPID,
            openId,
            TenantId,
            RoleId
        ],
        success,
    });
};

// 完善个人信息
const saveSelfInfo = ({
    sex,
    dob,
    personName,
    certificateNo
}, success) => {
    var params = {
        sex,
        dob,
        personName,
        certificate:{
            certificateNo:certificateNo,
            certificateType:'01',
            source:'01'
        }
    };
    return IHRequest({
        url: '/cas_ih_foshan.wx_personService/saveSelfInfo',
        method: 'post',
        data:[params],
        success,
    });
};

const verifyPersonByMobile = (mpiId,{success,fail}) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_personService/verifyPersonByMobile',
        method: 'post',
        data:[mpiId],
        success,
        fail
    });
}

const requestRealNameAuth = (mpiId)=> {
    return new Promise((resolve,reject)=>{
        verifyPersonByMobile(mpiId,{
            success:(res)=>{
                resolve();
            },
            fail:(res)=>{
                reject();
            }
        });
    })
}

const getVerifyResultByMpiId =  (mpiId,flowId,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_personService/getVerifyResultByMpiId',
        method: 'post',
        data:[mpiId,flowId],
        success,
    });
}

// 获取个人信息
const getSelfInfo = (success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_personService/getSelfInfo',
        method: 'post',
        data:[],
        success,
    });
};

// 上传头像
const uploadHeader = (filePath)=> {
    return WexinUpload({
        requestPath:'/file/header',
        filePath:filePath,
        name:'file'
    });
}

// 获取已注册手机验证码
const smsCodeProductRoleRegister = (phoneNo,success) => {
    return WexinRequest({
        url: '/cas.wxsmsService/smsCodeProductRoleRegister',
        method: 'post',
        data:[
            ProductCode,
            phoneNo
        ],
        success,
    });
}

// 验证校验码
const validateCode = ({phoneNo,code},success) => {
    return WexinRequest({
        url: '/cas.wxsmsService/validateCode',
        method: 'post',
        data:[
            ProductCode,
            phoneNo,
            code
        ],
        success,
    });
}

// 要更换手机的验证码
const smsCodeProductRoleUnRegister = (phoneNo,success) => {
    return WexinRequest({
        url: '/cas.wxsmsService/smsCodeProductRoleUnRegister',
        method: 'post',
        data:[
            ProductCode,
            phoneNo
        ],
        success,
    });
}

// 绑定新手机号
const changeBindPhone = ({phoneNo,code},success) => {
    return WexinRequest({
        url: '/cas.wxpersonService/changePhoneNo',
        method: 'post',
        data:[
            ProductCode,
            phoneNo,
            code
        ],
        success,
    });
}

// 获取就诊人列表
// [{
//     "personName": "赵子龙", // 姓名
//     "mpiId": "24ab0aee0ab9484e91cbc4aaec4eff88", // 个人唯一识别号
//     "relation": "1", // 与户主关系
//     "sex": "1",
//     "dob": "1990-01-01 00:00:00",
//     "certificate": { 
//       "source": "01",
//       "certificateType": "01",
//       "certificateNo": "331093129208331968"
//     }
// }]
const getFamilyMemberList = (success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_familyService/getFamilyMemberList',
        method: 'post',
        data:[true],
        success,
    });
}

// 获取居民信息
// {
//     "mpiId": "dd9322d7b9264e6180f8ee53211ea646",
//     "personName": "JoJo",
//     "sex": "1",
//     "dob": "1992-09-14 00:00:00",
//     "phoneNo": "15869151745",
//     "avatar": 7617,
//     "nationality": "01",
//     "relation": "1",
//     "province": "330000000000",
//     "city": "330100000000",
//     "district": "330103000000",
//     "street": "330103005000",
//     "address": "?",
//     "createDt": "2017-12-18 16:17:00",
//     "provinceText": "浙江省",
//     "cityText": "杭州市",
//     "districtText": "下城区",
//     "streetText": "潮鸣街道",
//     "sexText": "男性",
//     "nationalityText": "中国"
//     "certificate": {
//         "source": "01",
//         "certificateType": "01",
//         "certificateNo": "332522199209144211",
//         "addTime": "2018-04-17 13:46:08",
//         "sourceText": "中国",
//         "certificateTypeText": "居民身份证"
//     },
// }
const getFamilyMember = (mpiId,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_familyService/getFamilyMember',
        method: 'post',
        data:[mpiId],
        success,
    });
}

// 新增就诊人时校验身份信息,如果信息已经存在则修改信息
const checkFamilyMember = (certificateNo,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_familyService/checkFamilyMember',
        method: 'post',
        data:[{
            "certificateNo": certificateNo, // 证件号，必须
            "certificateType": "01", // 证件类别代码，必须
            "source": "01" // 发证机构代码，可选，默认中国
        }],
        success,
    });
}

// 保存就诊人信息
// 请求参数示例：
// [
//   {
//     "personName": "赵子龙", // 姓名，可选
//     "mpiId": "24ab0aee0ab9484e91cbc4aaec4eff88", // 有此项时视为更新资料，逻辑同接口「007.06」
//     "sex": "1", // 性别代码，可选 base_gender.dic
//     "dob": "1990-01-01", // 出生日期，可选
//     "phoneNo": "12476876890", // 手机号，可选
//     "avatar": 1, // 头像记录号，可选
//     "nation": "01",// 民族代码，可选 base_nation.dic
//     "nationality": "01",// 国籍代码，可选 base_nationality.dic
//     "education": "20", // 文化水平，可选  base_education.dic
//     "income": 190990, // 收入水平，可选
//     "bloodType": "1", // 血型代码，可选 base_bloodType.dic
//     "rhBloodType": "1", // RH血型代码，可选  base_rhBloodType.dic
//     "maritalStatus": "10", // 婚姻状况代码，可选 base_maritalStatus.dic
//     "insuranceType": "01", // 医保类别代码，可选 base_insuranceType.dic
//     "houseHold": "1", // 户籍类别代码，可选 base_houseHold.dic
//     "province": "330000", // 地址：省，可选 base_region.dic
//     "city": "330100", // 地址：市，可选 base_region.dic
//     "district": "330101", // 地址：区（县），可选 base_region.dic
//     "street": "330101001", // 地址：街道，可选 base_region.dic
//     "address": "浙江省杭州市文三路199号", // 地址，可选
//     "certificate": { // 证件，必须
//        "certificateNo": "331098189248331928", // 证件号，必须
//        "certificateType": "01", // 证件类别代码，必须 base_certificateType.dic
//        "source": "01" // 发证机构代码，可选，默认中国 base_nationality.dic
//     }
//   }, "1" // 与户主关系代码。
// ]
const saveFamilyMember = (params,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_familyService/saveFamilyMember',
        method: 'post',
        data:params,
        success,
    });
}

// 删除家庭成员
const deleteFamilyMember = (mpiId,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_familyService/deleteFamilyMember',
        method: 'post',
        data:[mpiId],
        success,
    });
}

// 就诊卡列表
// {
//     source:'',
//     sourceText:'',
//     cardType:'',
//     cardTypeText:'',
//     cardNo:''
// }
const getCardList = (mpiId,success) => {
    return WexinRequest({
        url: '/cas.wxcardService/getCards',
        method: 'post',
        data:[mpiId],
        success,
    });
}

// 删除就诊卡
const deleteCard = (mpiId,card,success) => {
    return WexinRequest({
        url: '/cas.wxcardService/deleteCard',
        method: 'post',
        data:[mpiId,card],
        success,
    });
}

// 添加就诊卡
const addCard = (mpiId,card,success) => {
    return WexinRequest({
        url: '/cas.wxcardService/addCard',
        method: 'post',
        data:[mpiId,card],
        success,
    });
}

// 获取租户的机构
const queryOrgInfoByTenantId = (success) => {
    return WexinRequest({
        url: '/cas.wxorgService/queryOrgInfoByTenantId',
        method: 'post',
        data:[],
        success,
    });
}

// 咨询订单列表
const consultOrderList = ({pageNo,pageSize,conStatus},success) => {
    var params = {
        tenantId:TenantId,
        conStatus,
        pageNo,
        pageSize
    };
    if (conStatus == '53') {
        params.commentStatus = 0;
    }
    return IHRequest({
        url: '/cas_ih_foshan.wx_askOrderService/askListPage',
        method: 'post',
        data:[params],
        success,
    });
}

// 取消咨询订单
const cancelConsult = ({orderDetailId,itemCode},success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_consultService/cancelConsult',
        method: 'post',
        data:[{
            orderDetailId,
            itemCode,
            userType:11,
            reason:''
        }],
        success,
    });
}

// 删除咨询订单
const deleteConsult = ({orderDetailId,itemCode},success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_consultService/delConsult',
        method: 'post',
        data:[{
            orderDetailId,
            itemCode,
            userType:11,
            reason:''
        }],
        success,
    });
}

// 复诊订单列表
const revisitOrderList = ({pageNo,pageSize,orderStatus},success) => {
    var params = {
        tenantId:TenantId,
        orderStatus,
        pageNo,
        pageSize
    };
    if (orderStatus == '05') {
        params.commentStatus = 0;
    }
    return IHRequest({
        url: '/cas_ih_foshan.wx_revisitService/listPage',
        method: 'post',
        data:[params],
        success,
    });
}

// 取消复诊订单
const cancelRevisit = (revisitId,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_revisitService/cancelRevisit',
        method: 'post',
        data:[{
            revisitId,
            userType:11,
            reason:''
        }],
        success,
    });
}

// 删除复诊订订单
const deleteRevisit = (revisitId,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_revisitService/delRevisit',
        method: 'post',
        data:[{
            revisitId,
            userType:11,
            reason:''
        }],
        success,
    });
}

// 药品订单列表
const drugOrderList = ({pageNo,pageSize,orderStatus},success) => {
    var params = {
        tenantId:TenantId,
        orderStatus,
        pageNo,
        pageSize
    };

    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeOrderService/listPage',
        method: 'post',
        data:[params],
        success,
    });
}

// 药品订单详情
const drugOrderDetail = (orderNo,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeOrderService/detail',
        method: 'post',
        data:[orderNo],
        success,
    });
};

// 取消药品订单
const cancelDrugOrder = ({orderNo,cancelReason},success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeOrderService/cancelRecipeOrder',
        method: 'post',
        data:[orderNo,cancelReason],
        success,
    });
}

// 删除药品订订单
const deleteDrugOrder = (orderNo,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeOrderService/removeRecipeOrder',
        method: 'post',
        data:[orderNo],
        success,
    });
}

// 药品订单确认收货
const confirmReceiptDrug = (orderNo,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeOrderService/confirmReceipt',
        method: 'post',
        data:[{orderNo}],
        success,
    });
}

// 收货地址列表
const shipAdressListRequest = (success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_baseUserDeliveryAddrService/findDeliveryAddrByUserId',
        method: 'post',
        data:[''],
        success,
    });
};

// 删除收货地址
const deleteAddress = (dataId,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_baseUserDeliveryAddrService/deleteById',
        method: 'post',
        data:[dataId],
        success,
    });
}

// 收货地址-查找街道
const findStreetByRegionCode = (regionCode,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_baseUserDeliveryAddrService/findStreetByRegionCode',
        method: 'post',
        data:[regionCode],
        success,
    });
}

// 保存收货地址
// {
//     dataId:'',
//     userId:'',
//     receiverName:'',
//     receiverPhone:'',
//     postCode:'',
//     province:'',
//     city:'',
//     district:'',
//     street:'',
//     address:'',
//     defaultFlag:0
// }
const saveShipAddress = (address,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_baseUserDeliveryAddrService/addOrUpdateBaseUserDeliveryAddr',
        method: 'post',
        data:[address],
        success,
    });
}

// 订单个数
const myOrderCountAll = (success)=>{
    return IHRequest({
        url: '/cas_ih_foshan.wx_askOrderService/myOrderCountAll',
        method: 'post',
        data:[{}],
        success,
    });
}

// 查询物流信息
const queryExpressInfoByOrderNo = (orderNo,success)=>{
    return IHRequest({
        url: '/cas_ih_foshan.wx_expressService/queryExpressInfoByOrderNo',
        method: 'post',
        data:[orderNo],
        success,
    });
};


/**
 * 电子处方列表
 * 
 * @param orderNo 订单信息,必要参数 
 * @param recipeId 选参数, 获取单个处方的信息
 */
const findRecipeInfoByOrderNo = ({orderNo,recipeId},success)=> {
    var data = [];
    var method = 'findRecipeInfoByOrderNo';

    data.push(orderNo);
    if (recipeId) {
        data.push(recipeId);
        method = 'getRecipeInfo';
    }
    
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeService/'+method,
        method: 'post',
        data:data,
        success,
    });
};

// 药店列表
const searchSuppliers = ({recipeId,longitude,latitude},success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeService/searchSuppliers',
        method: 'post',
        data:[{
            recipeId,
            longitude,
            latitude
        }],
        success,
    });
};

// 药店库存查询(单价医院)
const searchSupplier = (store,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeService/searchSupplier',
        method: 'post',
        data:[store],
        success,
    });
}

// 获取药品订单预结算信息
const getRecipePrecalculatedFee = (revisitId,recipeId,success)=> {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeService/getRecipePrecalculatedFee',
        method: 'post',
        data:[revisitId,[recipeId]],
        success,
    });
};

// 获取默认收货地址
const getDefaultAddByUserId = (userId = '',success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_baseUserDeliveryAddrService/getDefaultAddByUserId',
        method: 'post',
        data:[userId],
        success,
    });
}

// 创建药品订单
const createRecipeOrder = (order,success)=> {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeOrderService/createRecipeOrder',
        method: 'post',
        data:[order],
        success,
    });
}

// 获取处方预览
const findRecipeInfoByDrugOrderNo = (orderNo,success) => {
    return IHRequest({
        url: '/cas_ih_foshan.wx_recipeService/findRecipeInfoByDrugOrderNo',
        method: 'post',
        data:[orderNo],
        success,
    });
}

export {
    residentIndex,
    decodeUserInfo,
    getWxPhoneNumber,
    registerPhone,
    registerWX,
    registerSmsCode,
    logout,
    saveSelfInfo,
    getSelfInfo,
    requestRealNameAuth,
    getVerifyResultByMpiId,
    uploadHeader,
    smsCodeProductRoleRegister,
    validateCode,
    smsCodeProductRoleUnRegister,
    changeBindPhone,
    getFamilyMemberList,
    getFamilyMember,
    checkFamilyMember,
    saveFamilyMember,
    deleteFamilyMember,
    getCardList,
    deleteCard,
    addCard,
    queryOrgInfoByTenantId,
    consultOrderList,
    cancelConsult,
    deleteConsult,
    revisitOrderList,
    cancelRevisit,
    deleteRevisit,
    drugOrderList,
    drugOrderDetail,
    cancelDrugOrder,
    deleteDrugOrder,
    confirmReceiptDrug,
    shipAdressListRequest,
    deleteAddress,
    findStreetByRegionCode,
    saveShipAddress,
    myOrderCountAll,
    queryExpressInfoByOrderNo,
    findRecipeInfoByOrderNo,
    findRecipeInfoByDrugOrderNo,
    searchSuppliers,
    searchSupplier,
    getRecipePrecalculatedFee,
    getDefaultAddByUserId,
    createRecipeOrder
};
