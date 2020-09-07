/* eslint-disable class-methods-use-this */
import { get, post, put, _delete } from '@/lin/plugins/axios'

class Flow {
  // 类中的方法可以代表一个用户行为
  static async getFlowList() {
    return get('/v1/flow')
  }

  static async addFlow(data) {
    const res = await post('/v1/flow', { ...data })
    return res
  }

  static async editFlow(id, data) {
    const res = await put(`/v1/flow/${id}`, { ...data })
    return res
  }

  static async delFlow(id, type) {
    return _delete(`/v1/flow/${id}`, { type })
  }
}

export { Flow as FlowModel }
