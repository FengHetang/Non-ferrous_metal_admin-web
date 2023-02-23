<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="所属小类" prop="postCode">-->
<!--        <el-autocomplete-->
<!--          v-model="state"-->
<!--          :fetch-suggestions="querySearchAsync"-->
<!--          placeholder="请输入所属小类"-->
<!--          @select="handleSelect"-->
<!--        ></el-autocomplete>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="关键字" prop="informName">-->
<!--        <el-input-->
<!--          v-model="queryParams.informName"-->
<!--          placeholder="请输入关键字"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >数据备份</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="OneClickDelete"
          v-hasPermi="['system:post:remove']"
        >一键删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="时间" align="center" prop="time" />
      <el-table-column label="地址" align="center" prop="path" />
      <el-table-column label="创建人" align="center" prop="createBy" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDownload(scope.row)"
            v-hasPermi="['system:post:edit']"
          >下载</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import {addNavSubMan, delNavSubMan, getNavSubMan, updateNavSubMan} from "@/api/navigation/navSubMan";
import {getNavigation} from "@/api/navigation";
import {backupData, delData, downloadData, getDataBackup} from "@/api/dataBackup";

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      delList:[],
      // 日期范围
      dateRange: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        selectStartTime: undefined,
        selectEndTime:undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 获取数据 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      getDataBackup(this.queryParams).then(response => {
        console.log(response.data)
        this.postList = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.selectStartTime = this.dateRange[0]
      this.queryParams.selectEndTime = this.dateRange[1]
      console.log(this.queryParams.selectStartTime)
      console.log(this.queryParams.selectEndTime)
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.pageNum = 1;
      this.getList()
    },

    /** 数据备份按钮操作 */
    handleAdd() {
      backupData().then((res) => {
        console.log(res)
        this.$message({
          message:res.msg,
          type:'success'
        })
      })
    },

    /** 下载按钮操作 */
    handleDownload(row) {
      downloadData(row.id).then((res) => {
        console.log(res)
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.deleData(row.id)
    },
    /**  删除函数 **/
    deleData(id){
      delData(id).then((res) => {
        console.log(res)
        this.getList();
        this.$modal.msgSuccess("删除成功");
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    OneClickDelete(){
      if(this.ids.length === 0) {
        this.$message({
          message:'请选择数据',
          type:'error'
        })
      } else {
        this.ids.forEach(function (item){
          console.log(item)
          // this.deleData(item)
        })
        this.ids = []
      }
    }
  }
};
</script>
