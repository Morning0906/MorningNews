<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-fofo
        v-model="kw"
        placeholder="请输入搜索关键词"
        shape="round"
        @input="inputFn"
        @search="searchFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length!==0">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="suggestClickFn(str)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item"
        v-for="(str,index) in history" :key="index" @click="historyClickFn(str)"
        >{{str}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api'
import { setStorage, getStorage } from '@/utils/storage'
export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestList: [],
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
    }
  },
  methods: {
    //   输入框——内容实时改变触发事件方法
    inputFn () {
      // 防抖：延时执行逻辑代码，事件再次触发时，清除上一个定时器
      clearInterval(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          const res = await suggestListAPI({
            keywords: this.kw
          })
          console.log(res)
          this.suggestList = res.data.data.options
        }, 300)
      }
    },
    // 处理字符串关键字高亮
    lightFn (originStr, target) {
      // originStr:原来的字符串
      // target：关键字
      //   返回替换后的完整字符串

      //   解决忽略大小写问题：正则
      const reg = new RegExp(target, 'ig') // i忽略大小写，g全局都匹配
      return originStr.replace(reg, (match) => {
        // match 就是匹配中时，原字符串那个字符
        return `<span style="color:red;">${match}</span>`
      })
    },
    // 封装路由跳转函数
    // 注意：路由跳转，在watch之前执行，所以要让路由跳转用一个定时器包裹，让跳转最后执行
    moveFn (theKw) {
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${theKw}`
        })
      }, 0)
    },
    // 输入框——搜索事件
    searchFn () {
      if (this.kw.length > 0) {
        // 搜索关键字——保存到数组
        this.history.push(this.kw)
        this.moveFn(this.kw)
      }
    },
    // 联想菜单的点击事件
    suggestClickFn (str) {
      this.history.push(str)
      this.moveFn(str)
    },
    // 搜索历史——点击跳转
    historyClickFn (str) {
      this.moveFn(str)
    },
    clearFn () {
      this.history = []
    }
  },
  watch: {
    history: { // 历史记录数组的改变
      deep: true,
      handler () {
        // 立刻覆盖式的保存到本地
        // ES6新增了两种引用类型（以前有Array，Object），新增了Set和Map
        // Set：无序不重复的value集合体（无下角标）
        // 特点：传入的数组类型如果有重复元素，会自动去重，返回无重复的Set对象
        // 如果值是对象，比较的是对象的内存地址
        const theSet = new Set(this.history)
        // Set类型对象——>转回Array数组类型
        const arr = Array.from(theSet)
        setStorage('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #a9bbdc;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
    background-color: #a9bbdc;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
