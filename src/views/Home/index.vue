<template>
  <div>
    <!-- 头部导航 -->
    <div class="head-bar">
      <van-nav-bar fixed>
        <template #left>
          <span class="big-title">早间头条</span>
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" color="#fff"
          @click="moveSearchPageFn"/>
        </template>
      </van-nav-bar>
    </div>
    <!-- tab栏导航 -->
    <div class="main">
      <van-tabs v-model="channelId"
      @change="channelChangeFn"
      animate
      sticky
      offset-top="1.226667rem">
        <van-tab
          :title="obj.name"
          v-for="obj in userChannelList"
          :key="obj.id"
          :name="obj.id"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>

      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels"
      @click="plusClickFn"/>
    </div>
    <!-- 频道管理弹出层 -->
    <van-popup class="channel_popup"
    v-model="show" get-container="body">
    <ChannelEdit
    :userList="userChannelList"
    :unCheckList="unCheckChannelList"
    @addChannelEV="addChannelFn"
    @removeChannelEV="removeChannelFn"
    @closeEV="closeFn"
    v-model="channelId"
    ></ChannelEdit>
    </van-popup>
  </div>
</template>

// 点击tab标签页@change触发，重新发送请求，拿到新的数据
// 问题：每次切换tab拿到的数据都是新的
// 即使用keep-alive也没用（防止组件被销毁，而我们的组件没有被销毁，只是在点击切换数据）
// 文章列表数据，请求，数组，分别放入到ArticleList内部（自己请求自己的数据）
// 外面只负责传入当前激活的频道ID

<script>
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelAPI, removeTheChannelAPI } from '@/api/index.js'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      channelId: 0, // 索引,默认为推荐频道索引
      userChannelList: [], // 用户选择频道列表
      allChannelList: [], // 获取所有频道列表
      //   articleList: [] // 文章列表
      show: false,
      channelScrollTObj: {} // 保存每个栏目的滚动条位置
    }
  },
  async created () {
    //   频道列表
    const res = await getUserChannelsAPI()
    console.log(res)
    this.userChannelList = res.data.data.channels

    // 所有列表
    const res2 = await getAllChannelsAPI()
    console.log(res2)
    this.allChannelList = res2.data.data.channels

    // 文章列表
    // this.channelChangeFn()
  },
  methods: {
    plusClickFn () {
      this.show = true
    },
    // 添加频道
    async addChannelFn (channelObj) {
      // 只需要push，因为计算属性检测到数据变化会自动更新
      this.userChannelList.push(channelObj)
      // 把最新的数组，发送给后台
      // 数组里对象字段——转换
      // 推荐频道不能传递-筛选出不是推荐列表下的频道对象
      const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj } // 拷贝（浅拷贝）
        // delete对象、属性 可以删除键值对
        delete newObj.name
        newObj.seq = index

        // 让map方法把新对象收集起来形成一个新数组
        return newObj
      })
      const res = await updateChannelAPI({
        channels: theNewArr
      })
      console.log(res)
    },
    // 删除频道
    async removeChannelFn (channelObj) {
      const index = this.userChannelList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelList.splice(index, 1)

      // 调用删除的接口
      await removeTheChannelAPI({
        channelId: channelObj.id
      })
    },
    // 关闭弹出层
    closeFn () {
      this.show = false
    },
    // 首页-右上角放大镜点击事件->跳转搜索页面
    moveSearchPageFn () {
      this.$router.push('/search')
    },
    // 绑定滚动事件
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop
      // 同时保存当前频道的滚动距离
      this.channelScrollTObj[this.channelId] = document.documentElement.scrollTop
    },
    async channelChangeFn () {
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollTObj[this.channelId]
      })
    }
  },
  computed: {
    unCheckChannelList () {
      // 目标：把所有频道数组每个对象取出，去用户已选频道里查找
      // 如果找不到，则让filter方法收集到新数组里
      const newArr = this.allChannelList.filter(bigObj => {
        const index = this.userChannelList.findIndex(smallObj => {
          return smallObj.id === bigObj.id
        })

        // 如果找到了
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
    // 简化写法
  //   return this.allChannelList.filter(bigObj =>
  //   (this.userChannelList.findIndex(smallObj => smallObj.id===bigObj.id)===-1))
  },
  activated () {
    console.log(this.$route)
    window.addEventListener('scroll', this.scrollFn)
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.big-title {
  color: #fff;
}
.main {
  padding-top: 44px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}

.channel_popup{
  // 如果想给100%，要先给html和body设置100%
  // vw和vh是css3新出的单位，参考浏览器窗口的百分比
  width: 100vw;
  height: 100vh;
}
</style>
