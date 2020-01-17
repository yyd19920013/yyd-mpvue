const main = require('./main');

const homePath = '/pages/allEntrance/allEntrance'; //开发中可以把首页改成正在开发的页面，再重新npm run dev
let router = [{
        path: '/pages/allEntrance/allEntrance', //所有页面入口
        config: {
            navigationBarTitleText: ' ',
        },
    },
    {
        path: '/pages/home/index', //首页
        config: {
            navigationBarTitleText: '南海人民医院',
            enablePullDownRefresh: true,
        },
    },
    {
        path: '/pages/user/index', //我的
        config: {
            navigationBarTitleText: '我的',
            usingComponents: {
                'van-button': '/static/vant/button/index',
                "van-icon": "/static/vant/icon/index"
            },
        },
    },
    {
        path: '/pages/test/test', //测试
        root: 'pages/test',
        config: {
            navigationBarTitleText: '测试',
            usingComponents: {
                'van-button': '/static/vant/button/index',
            },
        },
    },
    {
        path: '/pages/login/login', //登录
        config: {
            navigationBarTitleText: '登录',
            usingComponents: {
                'van-button': '/static/vant/button/index',
                "van-dialog": "/static/vant/dialog/index"
            },
        },
    },
    {
        path: '/pages/login/register', //注册
        config: {
            navigationBarTitleText: '注册',
            usingComponents: {
                'van-button': '/static/vant/button/index',
            },
        },
    },
    {
        path: '/pages/webView/informedConsent', //知情同意书
        config: {
            navigationBarTitleText: '知情同意书',
        },
    },
    ...main,
];
const setHomePath = () => {
    if (homePath) {
        for (let i = 0; i < router.length; i++) {
            let item = router[i];
            let { path } = item;

            if (homePath == path) {
                let homeItem = router.splice(i, 1);

                router = [].concat(homeItem, router);
                break;
            }
        }
    }
    return JSON.parse(JSON.stringify(router));
};
const resultPages = setHomePath();

module.exports = router;
