/* eslint-disable class-methods-use-this */
import _axios, { get, post, put, _delete } from '@/lin/plugins/axios'

class Content {
  // 类中的方法可以代表一个用户行为
  static async getContentList() {
    return get('/v1/content')
  }

  static async addContent(data) {
    const res = await post('/v1/content', { ...data })
    return res
  }

  static async editContent(id, data) {
    const res = await put(`/v1/content/${id}`, { ...data })
    return res
  }

  static async delContent(id, type) {
    return _delete(`/v1/content/${id}`, { type })
  }
}

export { Content as ContentModel }
