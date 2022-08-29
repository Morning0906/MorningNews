// 此文件封装三个方法：专门操作token的
// 目的：代码分层，方便清晰，便于修改
const key = 'geek-morning' // 保存时的key值

// 设置
export const setToken = (token) => {
  localStorage.setItem(key, token)
}

// 获取
export const getToken = () => localStorage.getItem(key)

// 删除
export const removeToken = () => {
  localStorage.removeItem(key)
}
