const main = [{
        name: 'Main',
        root: 'package/main',
        path: '/package/main/findDoctor/findDoctor', //找医生列表
        config: {
            navigationBarTitleText: '找医生',
            enablePullDownRefresh: true,
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/deptList/deptList', //科室列表
        config: {
            navigationBarTitleText: '科室列表',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/doctorHome/doctorHome', //医生主页
        config: {
            navigationBarTitleText: '医生主页',
            usingComponents: {
                'van-dialog': '/static/vant/dialog/index',
            },
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/doctorHome/doctorDetail', //医生详情
        config: {
            navigationBarTitleText: '医生详情',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/doctorHome/patientEvaluation', //患者评价列表
        config: {
            navigationBarTitleText: '患者评价',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/doctorHome/addInfo', //在线咨询表单
        config: {
            navigationBarTitleText: '在线咨询',
            usingComponents: {
                'van-popup': '/static/vant/popup/index',
            },
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/doctorHome/addInfoVisit', //复诊配药表单
        config: {
            navigationBarTitleText: '复诊配药',
            usingComponents: {
                'van-uploader': '/static/vant/uploader/index',
                'van-checkbox': '/static/vant/checkbox/index',
                'van-checkbox-group': '/static/vant/checkbox-group/index',
            },
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/doctorHome/selectPatient', //选择就诊人
        config: {
            navigationBarTitleText: '选择就诊人',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/doctorHome/basicHealthInfo', //基本健康信息
        config: {
            navigationBarTitleText: '基本健康信息',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/myCaseHistory/myCaseHistory', //我的病历
        config: {
            navigationBarTitleText: '我的病历',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/myCaseHistory/newCaseHistory', //新建病历
        config: {
            navigationBarTitleText: '新建病历',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/myCaseHistory/addMedicaRecords', //添加就诊记录
        config: {
            navigationBarTitleText: '添加就诊记录',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/myCaseHistory/selectVisitRecord', //诊断列表
        config: {
            navigationBarTitleText: '诊断列表',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/payment/payment', //支付方式
        config: {
            navigationStyle: 'custom',
            navigationBarTitleText: '支付方式',
            usingComponents: {
                'van-nav-bar': '/static/vant/nav-bar/index',
                'van-icon': '/static/vant/icon/index'
            },
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        path: '/package/main/evaluation/evaluation', //服务评价
        config: {
            navigationBarTitleText: ' ',
        }
    },
    {
        name: 'Main',
        root: 'package/main',
        independent: true,
        path: '/package/main/imOrderDetail/imOrderDetail', //订单详情
        config: {
            navigationBarTitleText: ' ',
            usingComponents: {
                'van-uploader': '/static/vant/uploader/index',
            },
        }
    },
];

module.exports = main;
