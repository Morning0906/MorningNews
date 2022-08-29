<template>
  <div>
    <keep-alive exclude="Search,SearchResult,Detail,UserEdit">
    <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// import { getAllChannelsAPI } from '@/api'
// trycatch来捕获await同步代码错误
export default {
  // async created () {
  //   try {
  //     const res = await getAllChannelsAPI()
  //     console.log(res)
  //   } catch (error) {
  //     // error参数拿到的就是错误对象
  //     // 给用户一个弹窗提示：程序出错了
  //     // console.dir() 详细打印
  //     console.dir(error)
  //   }
  // }
}
</script>

<style lang="less">

</style>
