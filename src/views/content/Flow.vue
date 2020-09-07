<template>
  <div class="container">
    <div class="title">最新期刊列表</div>
    <div class="add-button">
      <el-button type="primary" @click="handleAdd" v-permission="新增最新期刊">新增期刊</el-button>
    </div>
    <div class="table">
      <el-table :data="flowList" border highlight-current-row :cell-style="{ 'text-align': 'center' }">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template slot-scope="scope">{{ contentType[scope.row.type] }}</template>
        </el-table-column>
        <el-table-column prop="detail.title" label="标题" width="140" align="center" />
        <el-table-column prop="detail.content" label="内容介绍" align="center" />
        <el-table-column prop="index" label="排序" align="center" width="120" />
        <el-table-column prop="status" label="是否展示" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success">展示中</el-tag>
            <el-tag v-else type="info">未展示</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" v-permission="'编辑期刊列表内容'">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" v-permission="'删除期刊列表内容'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="resetForm"
    >
      <el-form ref="form" :model="listForm" label-width="90px" :rules="rules">
        <el-form-item label="内容类型" prop="type">
          <el-radio v-model="listForm.type" :label="100" :disabled="isEdit">电影</el-radio>
          <el-radio v-model="listForm.type" :label="200" :disabled="isEdit">音乐</el-radio>
          <el-radio v-model="listForm.type" :label="300" :disabled="isEdit">句子</el-radio>
        </el-form-item>
        <el-form-item label="内容标题" prop="title">
          <el-col :span="11">
            <el-input v-model="listForm.title"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="内容介绍" prop="content">
          <el-col :span="11">
            <el-input type="textarea" v-model="listForm.content"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="音乐外链" prop="url">
          <el-col :span="11">
            <el-input v-model="listForm.url"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="发布时间" prop="pubdate">
          <el-date-picker v-model="listForm.pubdate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="有效状态" prop="status">
          <el-switch v-model="listForm.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="isEdit ? submitEdit() : submitAdd()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { FlowModel } from '@/models/flow'

export default {
  name: 'Flow',
  components: {},
  data() {
    return {
      isEdit: false,
      flowList: [],
      contentType: {
        100: '电影',
        200: '音乐',
        300: '句子',
      },
      listForm: {
        id: null,
        image: null,
        type: null,
        title: null,
        content: null,
        url: null,
        pubdate: '',
        status: '',
      },
      dialogTitle: '',
      showDialog: false,
      rules: {
        image: [{ required: true, message: '内容封面不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '请指定内容类型', trigger: 'blur' }],
        title: [{ required: true, message: '内容标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容介绍不能为空', trigger: 'blur' }],
        url: [{ type: 'url', message: 'url格式不正确', trigger: 'blur' }],
        pubdate: [{ required: true, message: '发布时间不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.getFlowList()
  },
  methods: {
    async getFlowList() {
      const res = await FlowModel.getFlowList()
      this.flowList = res
    },

    /**
     * 打开添加弹窗
     */
    handleAdd() {
      this.dialogTitle = '添加期刊'
      this.showDialog = true
    },

    /**
     * 编辑
     */
    handleEdit(row) {
      console.log(row)
      this.dialogTitle = '编辑内容'
      this.showDialog = true
      this.isEdit = true

      this.listForm.id = row.id
      this.listForm.type = row.type
      this.listForm.image = row.image
      this.listForm.title = row.title
      this.listForm.content = row.content
      this.listForm.url = row.url
      this.listForm.pubdate = row.pubdate
      this.listForm.status = row.status
    },

    /**
     * 删除
     */
    handleDelete(row) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await FlowModel.delContent(row.id, row.type)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          await this.getContentList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    /**
     * 提交添加
     */
    async submitAdd() {
      const images = await this.$refs.uploadEle.getValue()
      this.listForm.image = images.length < 1 ? '' : images[0].src

      this.$refs.form.validate(async valid => {
        if (valid) {
          delete this.listForm.id

          const res = await FlowModel.addContent(this.listForm)
          this.showDialog = false
          this.$message.success(res.message)

          await this.getContentList()
        }
      })
    },

    /**
     * 提交编辑
     */
    async submitEdit() {
      const images = await this.$refs.uploadEle.getValue()
      this.listForm.image = images.length < 1 ? '' : images[0].display

      this.$refs.form.validate(async valid => {
        if (valid) {
          const { id } = this.listForm
          delete this.listForm.id

          const res = await FlowModel.editContent(id, this.listForm)
          this.showDialog = false
          this.$message.success(res.message)

          await this.getContentList()
        }
      })
    },

    /**
     * reset form
     */
    resetForm() {
      this.isEdit = false
      this.$refs.form.resetFields()
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  .title {
    height: 59px;
    line-height: 59px;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }
  .add-button {
    padding: 20px 40px;
  }
  .table {
    padding: 0 40px 20px 40px;
  }
}
</style>
