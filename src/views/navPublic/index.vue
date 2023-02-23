<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属小类" prop="postCode">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入所属小类"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="关键字" prop="informName">
        <el-input
          v-model="queryParams.informName"
          placeholder="请输入关键字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['system:post:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:post:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:post:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

<!--    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">-->
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column label="岗位编号" align="center" prop="postId" />-->
<!--      <el-table-column label="岗位编码" align="center" prop="postCode" />-->
<!--      <el-table-column label="岗位名称" align="center" prop="postName" />-->
<!--      <el-table-column label="岗位排序" align="center" prop="postSort" />-->
<!--      <el-table-column label="状态" align="center" prop="status">-->
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="创建时间" align="center" prop="createTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.createTime) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['system:post:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['system:post:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column label="标题" align="center" prop="informName" />
      <el-table-column label="时间" align="center" prop="informDate" />
      <el-table-column label="内容" align="center" prop="inform" />
      <el-table-column label="浏览人数" align="center" prop="visitNumber" />
      <el-table-column label="创建时间" align="center" prop="informDate" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.informDate }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="是否展示" align="center" prop="isShow" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag :type="scope.row.isShow === '0' ? 'danger' : 'success'">-->
<!--            {{scope.row.isShow === '0' ? '不显示' : '显示'}}-->
<!--          </el-tag>-->
<!--          <span>{{ parseTime(scope.row.createTime) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            :icon="scope.row.isShow === '0' ? 'el-icon-open' : 'el-icon-turn-off'"-->
<!--            @click="handelIsShow(scope.row)"-->
<!--            v-hasPermi="['system:post:edit']"-->
<!--          >{{scope.row.isShow === '0' ? '修改为显示' : '修改为不显示'}}</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-search"-->
<!--            @click="handelDetails(scope.row)"-->
<!--            v-hasPermi="['system:post:edit']"-->
<!--          >详情</el-button>-->
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
        <el-form-item label="所属小类" prop="partId">
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入所属模块"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="标题" prop="informName">
          <el-input v-model="form.informName" placeholder="请输入岗位标题" />
        </el-form-item>
        <el-form-item label="内容" prop="inform">
          <el-input v-model="form.inform" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发布时间" prop="informDate">
          <el-date-picker
            v-model="form.informDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日">
          </el-date-picker>
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
import {addNavSubMan, delNavSubMan, getNavSubMan, updateNavSubMan} from "@/api/navigation/navSubMan";
import {getNavigation} from "@/api/navigation";

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        informName: undefined,
        selectStartTime: undefined,
        selectEndTime: undefined,
        partId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        partId: [
          { required: true, message: "所属小类不能为空", trigger: "blur" }
        ],
        informName: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        inform: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        informDate: [
          { required: true, message: "时间不能为空", trigger: "blur" }
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
      await getNavigation(queryParams).then((res) => {
        console.log(res)
        that.restaurants = res.data
      })
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
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().match(queryString.toLowerCase()));
      };
    },

    async getPartName(id) {
      console.log(id)
      let queryParams = {
        pageNum: 1,
        pageSize:1000,
      }
      let restaurants = []
      await getNavigation(queryParams).then((res) => {
        console.log(res)
        restaurants = res.data
      })
      let restaurant = [];
      for(let item of restaurants) {
        let obj = {
          value: item.navigationId,
          navigationName: item.navigationName
        };
        restaurant.push(obj);
      }
      // console.log(restaurant)
      var results = id ? restaurant.filter(this.createStateFilters(id)) : restaurant;
      // console.log(results)
      // debugger
      this.state = results[0].navigationName
    },
    createStateFilters(queryString) {
      return (state) => {
        return (state.value === queryString );
      };
    },

    handleSelect(item) {
      this.form.partId = item.navigationId
      this.queryParams.partId = item.navigationId
    },

    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      getNavSubMan(this.queryParams).then(response => {
        console.log(response.data)
        this.postList = response.data;
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
        partId: undefined,
        postCode: undefined,
        postName: undefined,
        informName: undefined,
        informDate: undefined
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
      this.title = "添加岗位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row
      this.open = true;
      this.title = "修改信息";
      console.log(row)
      this.form.informId = row.informId
      this.getPartName(row.partId)
      // const postId = row.postId || this.ids
      // getPost(postId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改岗位";
      // });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title === "修改信息" ) {
            updateNavSubMan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            console.log(this.form)
            addNavSubMan(this.form).then(response => {
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
        return delNavSubMan(row.informId);
      }).then((res) => {
        console.log(res)
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
