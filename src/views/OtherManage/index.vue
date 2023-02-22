<template>
  <div class="app-container">
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
      <el-table-column label="正文" align="center" prop="inform" />
      <el-table-column label="浏览人数" align="center" prop="visitNumber" />
      <el-table-column label="图片" align="center" prop="picturesUrl">
        <template slot-scope="scope">
          <el-image :src="scope.row.picturesUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="文章标题" prop="informName">
          <el-input v-model="form.informName" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="正文" prop="inform">
          <el-input type="textarea" v-model="form.inform" placeholder="请输入正文" />
        </el-form-item>
        <el-form-item label="发布时间" prop="informDate">
          <el-date-picker
            v-model="form.informDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片名称" prop="picturesName">
          <el-input v-model="form.picturesName" placeholder="请输入图片名称" />
        </el-form-item>
        <el-form-item label="图片地址" prop="picturesUrl">
          <el-input v-model="form.picturesUrl" placeholder="请输入图片地址" />
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
  getPublishContentDetails, updatePublishContent
} from "@/api/otherManage";
import { getModule } from "@/api/module";
export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
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
      console.log(row)
      let data = {
        id:row.id,
        isShow: row.isShow === '0' ? '1' : '0'
      }
      console.log(data)
      changeIsShow(data).then((res) => {
        this.$modal.msgSuccess("修改成功");
        // this.open = false;
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
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
      // console.log(row.id)
      const data = {
        id : row.id
      }
      getPublishContentDetails(data).then((res) => {
        console.log(res)
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
      // const postIds = row.postId || this.ids;
      var data = {
        id:row.id
      }
      this.$modal.confirm('是否确认删除标题为"' + row.informName + '"的数据项？').then(function() {
        return delPublishContent(data);
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