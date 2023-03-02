<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="postCode">
        <el-input
          v-model="queryParams.informName"
          placeholder="请输入标题关键字"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column label="标题" align="center" prop="informName" />
      <el-table-column label="时间" align="center" prop="informDate" />
      <el-table-column label="是否置顶" align="center" prop="isTop" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isTop === 0 ? 'danger' : 'success'">
            {{scope.row.isTop === 0 ? '不置顶' : '置顶'}}
          </el-tag>
        </template>
      </el-table-column>>
      <el-form-item label="内容" prop="inform" align="center">
          <editor v-model="form.inform" />
        </el-form-item>
      <el-table-column label="浏览人数" align="center" prop="visitNumber" />
      <el-table-column label="图片" align="center" prop="picturesUrl">
        <template slot-scope="scope">
          <el-image :src="scope.row.picturesUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.informDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否再轮播图中展示" align="center" prop="isShow" width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isShow === '0' ? 'danger' : 'success'">
            {{scope.row.isShow === '0' ? '不显示' : '显示'}}
          </el-tag>
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            :icon="scope.row.isShow === '0' ? 'el-icon-open' : 'el-icon-turn-off'"
            @click="handelIsShow(scope.row)"
            v-hasPermi="['system:post:edit']"
          >{{scope.row.isShow === '0' ? '修改为显示' : '修改为不显示'}}</el-button>
          <el-button
            size="mini"
            type="text"
            :icon="scope.row.isTop === 0 ? 'el-icon-upload2' : 'el-icon-download'"
            @click="updateState(scope.row)"
            v-hasPermi="['system:post:edit']"
          >{{scope.row.isTop === 0 ? '修改为置顶' : '修改为不置顶'}}</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handelDetails(scope.row)"
            v-hasPermi="['system:post:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          >修改</el-button>
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属模块" prop="titleId">
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入所属模块"
            :disabled=disabled
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="文章标题" prop="informName">
          <el-input v-model="form.informName" placeholder="请输入文章标题" :disabled=disabled />
        </el-form-item>
        <!-- <el-form-item label="正文" prop="inform">
          <el-input type="textarea" v-model="form.inform" placeholder="请输入正文" :disabled=disabled />
        </el-form-item> -->
        <el-form-item label="内容" >
          <editor v-model="form.inform" :min-height="192" />
        </el-form-item>
        <el-form-item label="发布时间" prop="informDate" :disabled=disabled>
          <el-date-picker
            v-model="form.informDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片名称" prop="picturesName" >
          <el-input v-model="form.picturesName" placeholder="请输入图片名称" :disabled=disabled />
        </el-form-item>
        <el-form-item label="图片地址" prop="picturesUrl">
          <el-input v-model="form.picturesUrl" placeholder="请输入图片地址"  :disabled=disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost } from "@/api/system/post";
import {
  addPubishContentDetails, changeIsShow,
  delPublishContent,
  getPublishContent,
  getPublishContentDetails, updatePublicState, updatePublishContent
} from "@/api/otherManage";
import { getModule } from "@/api/module";
import id from "element-ui/src/locale/lang/id";
export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 日期范围
      dateRange: [],
      disabled:false,
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        selectStartTime:undefined,
        selectEndTime:undefined,
        postCode: undefined,
        postName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        titleId: [
          { required: true, message: "模块名不能为空", trigger: "blur" }
        ],
        informName: [
          { required: true, message: "文章标题不能为空", trigger: "blur" }
        ],
        inform: [
          { required: true, message: "正文不能为空", trigger: "blur" }
        ],
        picturesName: [
          { required: true, message: "图片名称不能为空", trigger: "blur" }
        ],
        picturesUrl: [
          { required: true, message: "图片地址不能为空", trigger: "blur" }
        ]
      },
      // 模块名远程搜索
      restaurants: [],
      state: '',
      timeout:  null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 修改是否置顶**/
    updateState(row){
      console.log(row)
      const istop = row.isTop === 0 ? 1 : 0
      console.log(istop)
      updatePublicState(row.id,istop).then((res)=> {
        console.log(res)
        this.$message({
          type:"success",
          message:"修改成功"
        })
        this.getList()
      })
    },
    /** 模块名远程搜索 **/
    async querySearchAsync(queryString, cb) {
      let that = this
      let queryParams = {
        pageNum: 1,
        pageSize:1000,
        title:queryString
      }
      await getModule(queryParams).then((res) => {
        console.log(res)
        that.restaurants = res.data
      })
      let restaurants=[];
      for(let item of this.restaurants) {
        let obj = {
          value: item.title,
          titleId: item.titleId
        };
        restaurants.push(obj);
      }
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().match(queryString.toLowerCase()));
      };
    },

    async getModuleName(id) {
      // console.log(id)
      let queryParams = {
        pageNum: 1,
        pageSize:1000,
      }
      let restaurants = []
      await getModule(queryParams).then((res) => {
        console.log(res)
        restaurants = res.data
      })
      let restaurant = [];
      for(let item of restaurants) {
        let obj = {
          value: item.titleId,
          title: item.title
        };
        restaurant.push(obj);
      }
      // console.log(restaurant)
      var results = id ? restaurant.filter(this.createStateFilters(id)) : restaurant;
      // console.log(results)
      this.state = results[0].title
    },
    createStateFilters(queryString) {
      return (state) => {
        return (state.value === queryString );
      };
    },


    handleSelect(item) {
      this.form.titleId = item.titleId
    },

    /**修改 是否显示**/
    handelIsShow(row){
      var isShow = row.isShow === '0' ? '1' : '0'
      changeIsShow(row.id,isShow).then((res) => {
        this.$modal.msgSuccess("修改成功");
        this.open = false;
        this.getList();
      })
    },

    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      getPublishContent(this.queryParams).then(response => {
        this.postList = response.data;
        console.log(response.data)
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.disabled = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        titleId: undefined,
        informName: undefined,
        inform: undefined,
        informDate: '',
        picturesName: undefined,
        picturesUrl: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.selectStartTime = this.dateRange[0]
      this.queryParams.selectEndTime = this.dateRange[1]
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.informName = ""
      this.dateRange = []
      this.queryParams.selectStartTime = undefined
      this.queryParams.selectEndTime = undefined
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "发布新内容";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改发布内容";
      this.form = row
      this.getModuleName(this.form.titleId)
    },
    handelDetails(row) {
      getPublishContentDetails(row.id).then((res) => {
        this.open = true
        this.disabled = true
        this.title = "详情"
        this.form = res.data[0]
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title !== '发布新内容') {
            updatePublishContent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPubishContentDetails(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除标题为"' + row.informName + '"的数据项？').then(function() {
        return delPublishContent(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
