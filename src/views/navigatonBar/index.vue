<template>
  <el-card shadow="always" class="card">
    <el-card class="box-card">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="dialogFormVisible = true"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-input
            size="mini"
            v-model="queryParams.navigationName"
            placeholder="请输入模块名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-col>
        <el-col :span="1.5"><el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button></el-col>
      </el-row>
      <template #header>
        <div class="card-header">
          <span>
            <el-icon class="el-icon-menu" style="font-size: 20px"></el-icon>
            <span style="font-size: 15px;font-weight: 500;position: relative;left:10px;bottom:3px">导航栏列表</span>
          </span>
        </div>
      </template>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="navigationName"
          label="导航栏名称"
          >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          label="是否展示"
          >
          <template slot-scope="scope">
            <el-tag :type="scope.row.isApprove === 0 ? 'danger' : 'success'">{{scope.row.isApprove === 0 ? "不展示" : "展示"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="navigationId"
          label="导航栏顺序"
          width="180">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.navigationId}}</el-tag>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="params"-->
<!--          label="参数"-->
<!--          width="180">-->
<!--        </el-table-column>-->
        <el-table-column
          prop="updateBy"
          label="更新人员"
          >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        style="justify-content:center;padding-top: 10px"
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getNavData"
      />
    </el-card>
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="导航栏名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="dialogEditVisible">
      <el-form :model="editform">
        <el-form-item label="导航栏名称" :label-width="formLabelWidth">
          <el-input v-model="editform.navigationName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="删除"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>是否确认删除这一条信息？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="DeleteVanigation">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { addNavigation, delNavigation, getNavigation, updateNavigation } from '@/api/navigation'

export default {
  name: 'index',
  data(){
      return {
        searchData:'',
        delId:0,
        tableData:[],
        total:0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          navigationName:undefined
        },
        form: {
          name: '',
          region: '',
        },
        editform: {
          navigationId:0,
          navigationName: '',
          // isApprove: 0,
        },
        formLabelWidth: '120px',
        dialogFormVisible: false,
        dialogVisible:false,
        dialogEditVisible:false,
      }
  },
  created() {
    this.getNavData()
  },
  methods:{
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getNavData();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.navigationName = undefined
      this.handleQuery();
    },

    getNavData(){
      getNavigation(this.queryParams).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    handleEdit(index, row) {
      this.dialogEditVisible  = true
      this.editform = row
    },
    handleDelete(index, row) {
      this.delId = row.navigationId
      this.dialogVisible = true
    },
    DeleteVanigation(){
      delNavigation(this.delId).then((res) => {
        // console.log(res)
        this.$message({
          message:"删除成功",
          type:'success'
        })
        this.dialogVisible = false
        this.getNavData()
      })
    },
    addData(){
      // let time = new Date()
      var data = {
        "navigationName": this.form.name,
      }
      addNavigation(data).then((res) => {
        this.dialogFormVisible = false
        this.getNavData()
        this.$message({
          message:"新增成功",
          type:"success"
        })
        console.log(res)
      })
    },
    updateData(){
      let data = {
        navigationId:this.editform.navigationId,
        navigationName:this.editform.navigationName
      }
      // console.log(data)
      updateNavigation(data).then((res) => {
        this.dialogEditVisible  = false
        this.$message({
          message:"修改成功！",
          type:"success"
        })
        // console.log(res)
        this.getNavData()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>

<style scoped>

</style>
