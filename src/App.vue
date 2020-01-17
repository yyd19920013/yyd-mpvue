<script>
import { decodeUserInfo } from 'services';

export default {
    created() {
       this.checkLoginState();
    },
    methods:{
        // 检查微信登录是否过期
        checkLoginState() {
            const self = this;
            wx.checkSession({
                success: res => {},
                fail: () => {
                        console.log('会话已过期,重新登录');
                        wx.login({
                            success: res => {
                                
                            },
                            fail: () => {}
                        });
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
