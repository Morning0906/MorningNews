<template>
  <div>
    <van-nav-bar title="早间头条-登录" />
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          name="mobile"
          required
          label="手机号"
          placeholder="请输入11位手机号"
          :rules="[
            {
              required: true,
              message: '请填写手机号',
              pattern: /^1[3-9]\d{9}$/,
            },
          ]"
        />
        <van-field
          v-model="user.code"
          type="code"
          required
          name="密码"
          label="密码"
          placeholder="请输入密码"
          :rules="[
            { required: true, message: '请填写密码', pattern: /^\d{6}$/ },
          ]"
        />
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            :disabled="isLoading"
            :loading="isLoading"
            loading-text="正在登录..."
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { Notify } from 'vant'
import { setToken } from '@/utils/token.js'
import { setStorage } from '@/utils/storage'

export default {
  data () {
    return {
      user: {
        mobile: '19997978665', // 手机号
        code: '246810' // 验证码（密码，此处必须是246810）
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      console.log('submit', values)
      this.isLoading = true
      // trycatch来捕获await同步代码错误
      try {
        const res = await loginAPI(this.user)
        console.log(res)
        // 成功通知
        Notify({ type: 'success', message: '登录成功！' })
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        // 跳转一定要写在最后->尽量最后执行
        // location.href->当前浏览器地址和要跳转的地址一样（不包含#后面锚点信息），不会刷新网页
        // 地址改变会导致网页刷新
        // this.$router.push() 压栈，可以回退 this.$router.replace 替换，不产生历史记录
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (error) {
        // error参数拿到的就是错误对象
        // 给用户一个弹窗提示：程序出错了
        // console.dir() 详细打印
        // Promise内ajax抛出错误，进入这里
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="less">
// .van-nav-bar{
//   background-color: #a9bbdc;
// }
// 要修改组件内样式，如果用了scoped，就需要在选择器前加上/deep/
/* /deep/会把属性选择器加到前面，用后代选择器的方式找匹配的类名 */
// /deep/ .van-nav-bar__title{
//   color: white;
// }
</style>
