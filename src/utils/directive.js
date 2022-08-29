// 封装中间件函数插件
const directiveObj = {
  install (Vue) {
    // 创建全局自定义指令
    Vue.directive('fofo', {
      inserted (el) {
        // 指令所在van-search组件
        // 组件根标签是div，input在内部
        // 以上都是原生标签对象
        // 先判断标签是什么，DOM.nodeName可以拿到标签名字（大写的字符串）
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          // 如果直接是input标签/textarea标签
          el.focus()
        } else {
          // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
          const inp = el.querySelector('input')
          const textArea = el.querySelector('textarea')
          // 如果找到了
          if (inp || textArea) {
            inp && inp.focus()
            textArea && textArea.focus()
          } else {
            // 本身也不是, 子标签里也没有
            console.error('请把v-fofo用在输入框标签上')
          }
        }
      }
      // updated (el) { // 指令所在标签被更新时触发
      //   if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
      //     // 如果直接是input标签/textarea标签
      //     el.focus()
      //   } else {
      //     // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
      //     const inp = el.querySelector('input')
      //     const textArea = el.querySelector('textarea')
      //     // 如果找到了
      //     if (inp || textArea) {
      //       inp && inp.focus()
      //       textArea && textArea.focus()
      //     } else {
      //       // 本身也不是, 子标签里也没有
      //       console.error('请把v-fofo用在输入框标签上')
      //     }
      //   }
      // }
    })
  }
}

export default directiveObj
