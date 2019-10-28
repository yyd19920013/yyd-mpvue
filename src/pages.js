module.exports = [{
        path: 'pages/home/home', //首页
        config: {
            navigationBarTitleText: '首页',
        },
    },
    {
        path: 'pages/test/test', //测试
        config: {
            navigationBarTitleText: '测试',
            usingComponents: {
                'van-button': '/static/vant/button/index',
            },
        },
    },
    {
        path: 'pages/user/user', //我的
        config: {
            navigationBarTitleText: '我的',
        },
    },
];
