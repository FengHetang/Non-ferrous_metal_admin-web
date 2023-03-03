<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="文件名" prop="roleName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入文件名"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="所属导航栏" prop="navigationId">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请选择文件所属导航栏"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
        >上传文件</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList">
      <el-table-column label="导航栏ID">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="warning">{{ scope.row.navigationId }}</el-tag>
          </div>
        </template>
      </el-table-column>>
      <el-table-column label="文件ID">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="info">{{ scope.row.fileId }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文件名称" width="300">
        <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.realFileName }}</el-tag>
            </div>
        </template>
      </el-table-column>>
      <el-table-column label="文件日期" prop="fileDate"/>
      <!-- <el-table-column label="文件链接" prop="fileUrl"/> -->
      <el-table-column label="下载次数" >
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" type="success">{{ scope.row.count }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDownload(scope.row)"
          >下载文件</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="addform" :rules="rules" label-width="100px">
        <el-form-item label="所属导航栏" >
          <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请选择文件所属导航栏"
          @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="#"
            :multiple="false"
            :show-file-list="true"
            :http-request="uploadHttpRequest"
            :file-list="fileList"
            :on-change="handleUploadChange"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadFile()">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {delFileData, downloadFileData, getFileData, uploadFileData} from "@/api/fileMange/file";
import {getNavigation} from "@/api/navigation";

export default {
  name: "Role",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 文件列表
      fileList: [],
      addform:{
        navigationId:0,
        file:''
      },
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileName:undefined,
        navigationId:undefined,
        selectStartTime:null,
        selectEndTime:null
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      },
      restaurants:[],
      state:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
      this.queryParams.navigationId = item.navigationId
      this.addform.navigationId = item.navigationId
    },

    async getNavBarData(){
      let data = {
        pageNum:1,
        pageSize:100
      }
      await getNavigation(data).then((res) => {
        this.restaurants = res.data
      })
    },

    /** 查询文件列表 */
    getList() {
      this.loading = true;
      this.queryParams.selectStartTime = this.dateRange[0]
      this.queryParams.selectEndTime = this.dateRange[1]
      getFileData(this.queryParams).then((res) => {
        console.log(res)
        this.roleList = res.data;
        this.total = res.total;
        this.loading = false;
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除该文件？').then(function() {
        return delFileData(row.fileId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    uploadFile(){
      uploadFileData(this.addform.navigationId,this.formData).then((res) => {
        this.open = false
        this.$message({
          message:'文件上传成功',
          type:'success'
        })
        this.getList()
      })
    },
    // 覆盖element的默认上传文件
    uploadHttpRequest(param) {
      let formData = new FormData();
      formData.append('file',param.file)
      this.formData = formData
    },
    // 限制文件上传的个数只有一个，获取上传列表的最后一个
    handleUploadChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的文件
      }
    },

    /** 下载文件 */
    async handleDownload(row) {
      // console.log(row)
      const res = await downloadFileData(row.fileId)
      const data = res
      const url = window.URL.createObjectURL(new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', row.realFileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.$message({
        type:"success",
        message:"下载成功！"
      })
    },
    handleQuery() {
      this.getList()
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.navigationId = undefined
      this.queryParams.selectEndTime = null
      this.queryParams.selectStartTime = null
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },


    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "上传文件";
    },

  }
};
</script>
<style scoped>
.el-list-enter-active, .el-list-leave-active {
  -webkit-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
}
</style>

