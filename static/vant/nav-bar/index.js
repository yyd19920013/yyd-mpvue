import { VantComponent } from '../common/component';
VantComponent({
    classes: ['title-class'],
    props: {
        title: String,
        fixed: Boolean,
        leftText: String,
        rightText: String,
        leftArrow: Boolean,
        border: {
            type: Boolean,
            value: true
        },
        zIndex: {
            type: Number,
            value: 1
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: true
        },
    },
    data: {
        statusBarHeight: 0
    },
    created() {
        const { statusBarHeight } = wx.getSystemInfoSync();
        this.setData({ statusBarHeight });
    },
    methods: {
        onClickLeft() {
            this.$emit('clickLeft');
        },
        onClickRight() {
            this.$emit('clickRight');
        }
    }
});
