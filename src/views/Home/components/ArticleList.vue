<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="obj in list"
          :key="obj.art_id"
          :artObj="obj"
          @disLikeEV="disLikeFn"
          @reportEV="reportFn"
          @click.native="itemClickFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import {
  getAllArticleListAPI,
  dislikeArticleAPI,
  reportArticleAPI
} from '@/api/index.js'
import { Notify } from 'vant'

// 问题：网页刚打开时，create和onload请求同时发送，请求的都是最新数据
// onload中，2次一样的数据合并，数据重复，key重复了
// 原因：van-list组件，组件挂载时，默认值就会判定一次是否触底
// 第一页数据也是网络请求回来的，标签先挂载了，数据回来更新DOM，所以标签没有高度
// list的load事件上来就触发

export default {
  props: {
    // list: Array // 文章列表数组
    channelId: Number
  },
  data () {
    return {
      list: [],
      loading: false, // 底部加载状态
      finished: false, // 底部完成状态
      theTime: new Date().getTime(), // 用于分页
      isLoading: false
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    this.getArticleListFn()
  },
  methods: {
    // 专门负责发送请求
    async getArticleListFn () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      })
      // created()上来第一次list是空数组，合并没问题
      // onload触底加载更多，2个数组合并也没问题
      this.list = [...this.list, ...res.data.data.results]
      // pre_timestamp— 下一段开头那篇文章的时间戳
      // 第一次：系统时间（timestamp）->后台 返回0-9条数据 ->携带第10条pre_timestamp值返回
      // 第二次 （timestamp）-上一次pre_timestamp（代表告诉后，从指定的时间戳再往后找10个）10-19条展示，携带20条
      this.theTime = res.data.data.pre_timestamp
      // 把加载关闭,否则底部一直是加载中状态，下次触底会再触发onload
      this.loading = false
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }

      // 顶部加载状态改为false
      this.isLoading = false
    },
    async onLoad () {
      if (this.list.length === 0) {
        this.loading = false
        return
      }
      this.getArticleListFn()
    },
    async onRefresh () {
      // 目标：list数据情况，来一份新的数据
      this.list = []
      this.theTime = new Date().getTime()
      this.getArticleListFn()
    },
    // 反馈不喜欢的文章
    async disLikeFn (id) {
      // 用trycatch自己处理错误,内部throw就不会向控制台抛出打印错误
      // 而是交给catch来自定义错误
      // try+catch捕获同步代码的异常
      try {
        await dislikeArticleAPI({
          artId: id
        })
        // res里没有什么有用信息，所以await往下放行
        Notify({ type: 'success', message: '反馈成功' })
        console.log('成功了')
      } catch (error) {
        console.log('失败了')
      }
    },
    // 反馈：垃圾内容
    async reportFn (id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      })
      Notify({ type: 'success', message: '举报成功' })
    },
    // 跳转到详情
    itemClickFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
</script>

<style>
</style>
