<template>
  <el-card shadow="always" class="card">
<!--    <el-card class="box-card">-->
<!--      <template #header>-->
<!--        <div class="card-header">-->
<!--          <span>-->
<!--            <el-icon class="el-icon-menu" style="font-size: 20px"></el-icon>-->
<!--            <span style="font-size: 15px;font-weight: 500;position: relative;left:10px;bottom:3px">导航栏列表</span>-->
<!--          </span>-->
<!--        </div>-->
<!--      </template>-->
<!--      <el-row :gutter="10" class="mb8">-->
<!--        <el-col :span="1.5">-->
<!--          <el-input-->
<!--            placeholder="请输入内容"-->
<!--            size="mini"-->
<!--            style="width:20%;position: absolute;right: 0"-->
<!--            v-model="searchData">-->
<!--            <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
<!--          </el-input>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-table-->
<!--        :data="tableData"-->
<!--        style="width: 100%">-->
<!--        <el-table-column-->
<!--          prop="navigationName"-->
<!--          label="导航栏名称"-->
<!--        >-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="createTime"-->
<!--          label="创建时间"-->
<!--        >-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="是否展示"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <el-tag :type="scope.row.isApprove === 0 ? 'danger' : 'success'">{{scope.row.isApprove === 0 ? "不展示" : "展示"}}</el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="navigationId"-->
<!--          label="导航栏顺序"-->
<!--          width="180">-->
<!--          <template slot-scope="scope">-->
<!--            <el-tag type="success">{{scope.row.navigationId}}</el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="updateBy"-->
<!--          label="更新人员"-->
<!--        >-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="updateTime"-->
<!--          label="更新时间"-->
<!--        >-->
<!--        </el-table-column>-->
<!--        <el-table-column label="操作">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="danger"-->
<!--              @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      <pagination-->
<!--        style="justify-content:center;padding-top: 10px"-->
<!--        v-show="total>0"-->
<!--        :total="total"-->
<!--        :page.sync="queryParams.pageNum"-->
<!--        :limit.sync="queryParams.pageSize"-->
<!--        @pagination="getNavData"-->
<!--      />-->
<!--    </el-card>-->
  </el-card>
</template>

<script>
import { addNavigation, delNavigation, getNavigation, updateNavigation } from '@/api/navigation'

export default {
  name: 'index',
  data(){
    return {
      searchData:'',
      delId:'',
      tableData:[],
      total:0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      form: {
        name: '',
        region: '',
      },
      editform: {
        navigationName: '',
        isApprove: 0,
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
    getNavData(){
      console.log(this.queryParams.pageNum) // 页码
      getNavigation(this.queryParams).then((res) => {
        console.log(res)
        this.tableData = res.data
        this.total = res.total
      })
    },
    handleEdit(index, row) {
      this.dialogEditVisible  = true
      this.editform = row
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.delId = row.navigationId
      this.dialogVisible = true
    },
    DeleteVanigation(){
      delNavigation(this.delId).then((res) => {
        console.log(res)
        this.$message({
          message:"删除成功",
          type:'error'
        })
        this.getNavData()
      })
    },
    addData(){
      let time = new Date()
      var data = {
        "createBy":this.$store.getters.name,
        "createTime": time.toLocaleString(),
        "isApprove": this.form.region,
        // "navigationId": 0,
        "navigationName": this.form.name,
        "params": {},
        "remark": "string",
        "searchValue": this.$store.getters.name,
        "updateBy": this.$store.getters.name,
        "updateTime": time.toLocaleString()
      }
      console.log(data)
      debugger;
      addNavigation().then((res) => {
        console.log(res)
      })
    },
    updateData(){
      var data = {

      }
      debugger
      updateNavigation(data).then((res) => {
        console.log(res)
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
