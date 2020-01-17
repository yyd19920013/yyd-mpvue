<template>
    <div class="nimLogin">
        <nimHeader :controlPageName="'nimLogin'" :title="'登录'" />
        <section class="content">
            <ul class="loginInfo">
                <li>
                    <span>账号：</span>
                    <div class="right">
                        <picker @change="pickerChange" :value="accountIndex" :range="accountArr">
                            {{accountArr[accountIndex]}}
                        </picker>
                    </div>
                </li>
                <li>
                    <span>令牌：</span>
                    <div class="right">
                        <input :value="tokenArr[accountIndex]" readonly="true" type="text" />
                    </div>
                </li>
            </ul>
            <button class="login" type="button" @click="login">
                登录
            </button>
        </section>
    </div>
</template>
<script>
import nimHeader from './nimHeader';
import nimInit from './nimInit';
import { resetData, lStore } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {
            accountIndex: 0,
            accountArr: [
                'yyd1',
                'yyd2',
                'yyd3',
                'yyd4',
                'yyd5',
                //测试
                '42034dfbd1cf43ec89bc643e04804e28', //杨凯，深圳慢病1
                '92cce3dc3ee648908840a0d7f3315cc2', //李军，深圳慢病2
                'defea7a58f73424b9b438b4b75e05ad4', //张静，中山1
                '0f1f7d0baa8d41fc9b6bb47c0f6cbebf', //医生张佑轩，佛山
                '59c1e6832199421c8945c27f68146dd2', //居民岩，佛山
            ],
            tokenArr: [
                'a7a1145cc852fd504e4e16d33d45323b',
                'bc671970b28ed82b408acf473944b572',
                'fd6733a5c421c5700e20e8af115f1744',
                'ee0ddfda5d81fb7b1f8e7cc67aefb418',
                'ae5bf35afeb0b1dba808bd68a2e700b5',
                //测试
                'ebadfeb6b600576e237ed74b52db2a51',
                '69bd0860c40b3b9260a01c321296c8f6',
                'c8d73c4f8802ce95498dc7900c631801',
                'e2dad236ed6cf50dbd3e4f49a5c2b01f',
                '5729b91d92736c6bae024476367441f5',
            ],
        });
    },

    /*

    */

    props: {

    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        pickerChange(ev) {
            let { value } = ev.mp.detail;

            this.accountIndex = value;
        },
        login() {
            lStore.set('nimAccount', this.accountArr[this.accountIndex]);
            lStore.set('nimToken', this.tokenArr[this.accountIndex]);

            wx.controlPage('nimLogin', false);

            nimInit();
        },
    },

    components: {
        nimHeader,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.nimLogin {
    .content {
        .loginInfo {
            padding-top: 100px;
            li {
                height: 40px;
                line-height: 40px;
                margin-bottom: 20px;
                >span {
                    float: left;
                    width: 50px;
                }
                .right {
                    overflow: hidden;
                    height: 100%;
                    select, input {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        .login {
            width: 100%;
            margin-top: 50px;
            height: 40px;
        }
    }
}

</style>
