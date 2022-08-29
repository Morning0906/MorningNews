// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面，导入这个接口方法，就能发请求
// 好处：请求URL路径，可以在这里统一管理
import axios from '@/utils/request.js'
import { getStorage } from '@/utils/storage'

// 登录接口
// axios内部会把参数对象转换成json字符串格式发给后台
// axios内部会自动携带请求参数（headers）里
// Content-Type：帮你添加好
export const loginAPI = ({ mobile, code }) =>
  axios({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })

// 用户——关注
export const userFollowedAPI = ({ userId }) => axios({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userId
  }
})

// 用户——取关
export const userUnFollowedAPI = ({ userId }) => axios({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE'
})

// 用户——获取个人资料(编辑页面)
export const userProfileAPI = () => axios({
  url: '/v1_0/user/profile'
})

// 用户——获取基本信息
export const getUserInfoAPI = () => axios({
  url: '/v1_0/user'
})

// 用户——更新头像
export const updateUserPhotoAPI = (fd) => axios({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd // new FromData()表单对象
  // Content-Type:application/json;axios携带的
  // 前提：data请求体是对象->json字符串->发给后台
  // Content-Type:multipart/form-data;浏览器携带的
  // 前提：data请求体是FromData类型对象
})

// 用户——刷新Token
export const getNewTokenAPI = () => axios({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorizations: 'Bearer' + getStorage('refresh_token')
  }
})

// 用户——更新基本资料
export const updateUserProfileAPI = (dataObj) => {
  // 判断：有值才带参数名给后台，无值参数名不携带
// 写法1：解构赋值，4个判断，往空对象上添加有值的
// 写法2：外面想传几个对象key+value，就直接传入交给后台
// 写法3：上面写法不够语义化，看不出obj里有什么
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }

  for (const prop in obj) { // 遍历参数对象里每个key
    if (dataObj[prop] === undefined) { // 用key去外面传入的参数对象匹配
      delete obj[prop] // 从obj身上移除这对属性和值
    } else {
      obj[prop] = dataObj[prop] // 如果使用了，就从外面对象取出相应key值，保存到obj上
    }
  }

  return axios({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}

// 频道——获取所有频道
export const getAllChannelsAPI = () => axios({
  url: '/v1_0/channels',
  method: 'GET'
})

// 频道——获取用户频道
// 注意：用户没有登录，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => axios({
  url: '/v1_0/user/channels'
})

// 频道——更新覆盖频道
export const updateChannelAPI = ({ channels }) => axios({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels // 用户已选整个频道数组
  }
})

// 频道——删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) => axios({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 文章——获取文章列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => axios({
  url: '/v1_0/articles',
  method: 'GET',
  params: { // 这里的参数，axios会帮你拼接在URL?后面（查询字符串）
    channel_id,
    timestamp
  }
})

// 文章——不喜欢该文章
export const dislikeArticleAPI = ({ artId }) => axios({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章——反馈垃圾内容
export const reportArticleAPI = ({ artId, type }) => axios({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type,
    remark: '暂未设置'
  }
})

// 文章——获取详情
export const detailAPI = ({ artId }) => axios({
  url: `/v1_0/articles/${artId}`
})

// 文章——点赞
export const LikeArticleAPI = ({ artId }) => axios({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章——取消点赞
export const unLikeArticleAPI = ({ artId }) => axios({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 文章——获取评论列表
export const commentsListAPI = ({ id, offset = null, limit = 10 }) => axios({
  url: '/v1_0/comments',
  method: 'GET',
  params: { // axios只针对params参数，如果发现键值对，值为null，会忽略此参数值和名，不携带在?后面
    type: 'a', // 什么时候需要向外面传：此值会变化
    source: id,
    offset,
    limit
  }
})

// 文章——评论——喜欢
export const commentLikingAPI = ({ comId }) => axios({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: comId
  }
})

// 文章——评论——取消喜欢
export const commentDisLikingAPI = ({ comId }) => axios({
  url: `/v1_0/comment/likings/${comId}`,
  method: 'DELETE'
})

// 文章——发表评论
export const commmentSendAPI = ({ id, content, art_id = null }) => {
  // data请求体对象需要自己处理
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) { // 如果本次有第三个参数，则证明是对评论进行恢复
    obj.art_id = art_id
  }
  return axios({
  // 1.axios中，data请求体传参，如果值为null是不会忽略此参数的
  // 也会把参数名和值携带给后台（只有params遇到null才会忽略）
  // 2.形参art_id可选参数，如果逻辑页面是对文章评论，则不需要传递art_id
  // 所以这时，内部art_id的值为null就证明此次调用是针对文章评论
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 搜索——联想菜单列表
export const suggestListAPI = ({ keywords }) => axios({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})

// 搜索——搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => axios({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})

//
