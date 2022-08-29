<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userObj.photo"
            @click="imageClickFn"
          />
          <!-- file选择框 -->
          <!-- 用v-show原因：视觉隐藏，标签还在DOM树上，可以触发功能 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userObj.name"
        @click="nameClickFn"
      />
      <van-cell title="生日" is-link :value="userObj.birthday" @click="birthdayClickFn"/>
    </van-cell-group>
    <!-- 姓名修改的弹窗 -->
    <van-dialog
      v-model="show"
      title="标题"
      show-cancel-button
      :before-close="beforeCloseFn"
    >
      <input type="text" ref="input" v-model="inputUserName" />
    </van-dialog>

    <!-- 时间选择器 -->
    <van-popup round v-model="dateTimePickershow" position="bottom" :style="{ height: '50%' }" >
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="dateCancelFn"
      @confirm="confirmFn"
    />
    </van-popup>
  </div>
</template>

<script>
import {
  userProfileAPI,
  updateUserPhotoAPI,
  updateUserProfileAPI
} from '@/api'
import { Notify } from 'vant'
import { formatDate } from '@/utils/date'
export default {
  name: 'UserEdit',
  data () {
    return {
      userObj: {},
      show: false,
      inputUserName: '',
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      dateTimePickershow: false
    }
  },
  async created () {
    const res = await userProfileAPI()
    console.log(res)
    this.userObj = res.data.data
  },
  methods: {
    //   文件选择
    async onFileChange (e) {
      if (e.target.files.length === 0) {
        return
      }
      // 创建FromData对象
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0]) // 请求体里加入一对参数名和值

      const res = await updateUserPhotoAPI(theFd)
      //   console.log(res)
      this.userObj.photo = res.data.data.photo
    },
    // 图片点击事件
    imageClickFn () {
      this.$refs.iptFile.click() // JS模拟标签的事件触发
    },
    // 姓名点击事件
    nameClickFn () {
      this.show = true
      this.inputUserName = this.userObj.name
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.input.focus()
        }, 500)
      })
    },
    // 姓名——确认框——关闭前的回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        // 点确定
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          // 通过了校验
          await updateUserProfileAPI({
            name: this.inputUserName
          })
          this.userObj.name = this.inputUserName
          done()
        } else {
          // 未通过校验，给用户提示
          Notify({ type: 'warning', message: '用户名只能是1-7位中英文组合' })
          done(false)
        }
      } else {
        //   点击取消
        done()
      }
    },
    birthdayClickFn () {
      this.dateTimePickershow = true
      this.currentDate = new Date(this.userObj.birthday)
    },
    // 日期选择器
    dateCancelFn () {
      this.dateTimePickershow = false
    },
    // 日期选择器：确认时间
    async confirmFn () {
      await updateUserProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.dateTimePickershow = false
      this.userObj.birthday = formatDate(this.currentDate)
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
::v-deep .van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
