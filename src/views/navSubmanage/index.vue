<template>
  <el-card shadow="always" class="card">
    <el-card class="box-card">
      <el-row :gutter="10" class="mb8">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="dialogFormVisible = true"
              v-hasPermi="['system:user:add']"
            >新增</el-button>
          </el-col>
          <el-input
            placeholder="请输入内容"
            size="mini"
            style="width:20%;position: absolute;right: 0"
            v-model="searchData">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-row>
      </el-row>
      <template #header>
        <div class="card-header">
          <span>
            <el-icon class="el-icon-menu" style="font-size: 20px"></el-icon>
            <span style="font-size: 15px;font-weight: 500;position: relative;left:10px;bottom:3px">小类管理</span>
          </span>
        </div>
      </template>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="partName"
          label="名称"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          prop="navigationId"
          label="navigationId"
        ></el-table-column>
        <el-table-column
          prop="partId"
          label="partId"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="remark"
        ></el-table-column>
        <el-table-column
          prop="searchValue"
          label="searchValue"
        ></el-table-column>
        <el-table-column
          prop="updateBy"
          label="更新人"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          label="是否展示"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.isApprove === 0 ? 'danger' : 'success'">{{scope.row.isApprove === 0 ? "不展示" : "展示"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"
        width="200">
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
        <el-form-item label="小类名称" :label-width="formLabelWidth">
          <el-input v-model="form.partName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属大类" :label-width="formLabelWidth">
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
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
          <el-input v-model="editform.partName" autocomplete="off"></el-input>
        </el-form-item>
<!--        <el-form-item label="是否展示" :label-width="formLabelWidth">-->
<!--          <el-select v-model="editform.isApprove" placeholder="请选择是否展示">-->
<!--            <el-option label="显示" value=0></el-option>-->
<!--            <el-option label="不显示" value=1></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除"
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

import { addSubclass, delSubclass, getnavSubclass, updateSubclass } from '@/api/navigation/navSubclass'
import log from '@/views/monitor/job/log.vue'
import { getNavigation } from '@/api/navigation'

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
        navigationId:0,
        partName:"",
      },
      editform: {
        navigationId: 0,
        partId: 0,
        partName:""
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogVisible:false,
      dialogEditVisible:false,
      restaurants: [],
      state:'',
      addNavigationId:0,
    }
  },
  created() {
    this.getNavData()
  },
  methods:{
    async getNavBarData(){
      let data = {
        pageNum:1,
        pageSize:100
      }
      await getNavigation(data).then((res) => {
        this.restaurants = res.data
      })
    },
    getNavData(){
      let data = {
        pageNum:this.queryParams.pageNum,
        pageSize:this.queryParams.pageSize
      }
      getnavSubclass(data).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    async querySearchAsync(queryString, cb) {
      await this.getNavBarData()
      let restaurants=[];
      for(let item of this.restaurants) {
        let obj = {
          value: item.navigationName,
          navigationId: item.navigationId
        };
        restaurants.push(obj);
      }
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      console.log(results)
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().match(queryString.toLowerCase()));
      };
    },
    handleSelect(item) {
      this.form.navigationId = item.navigationId
    },

    handleEdit(index, row) {
      this.dialogEditVisible  = true
      this.editform.navigationId = row.navigationId
      this.editform.partId = row.partId
      this.editform.partName = row.partName
      // console.log(this.editform)
    },
    handleDelete(index, row) {
      console.log(row)
      this.delId = row.partId
      this.dialogVisible = true
    },
    DeleteVanigation(){
      // let data = {
      //   partId:this.delId
      // }
      delSubclass(this.delId).then((res) => {
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
      var data = this.form
      addSubclass(data).then((res) => {
        console.log(res)
        this.$message({
          message:'新增成功',
          type:'success',
        })
        this.dialogFormVisible = false
        this.getNavData()
      })
    },
    updateData(){
      updateSubclass(this.editform).then((res) => {
        console.log(res)
        this.$message({
          message:"修改成功",
          type:'success'
        })
        this.dialogEditVisible = false
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
