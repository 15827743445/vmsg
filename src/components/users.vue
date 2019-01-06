<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索+添加用户 -->
    <el-row>
      <el-col>
        <el-input
          @clear="getAllUsers()"
          clearable
          placeholder="请输入用户名"
          v-model="query"
          class="input-with-select"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <el-button type="primary" @click="showDiaAdd()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格
      data属性的值是表格的数据
      el-table-column 列 (每列的行数是data绑定数据的长度)
        label="列的表头文本"
        prop="每一列中每个单元格的数据 来源于tableData中每个对象的key名"
    -->
    <!--
        id:id
        username:用户名
        email:邮箱
        mobile:电话
        create_time:创建时间
        mg_state:用户状态
        role_name:角色名
    -->
    <el-table class="table" height="300px" :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>

      <!--
    fmtDate
  1. {{ create_time | fmtDate}}
  2. v-bind
      -->
      <!-- <el-table-column prop="create_time | fmtDate" label="创建日期" width="180"></el-table-column> -->
      <!-- <p>{{msg | fmtDate}}</p> -->
      <!-- <el-table-column prop="create_time" label="创建日期" width="180">
        {{create_time|fmtDate}}
      </el-table-column>-->
      <el-table-column label="创建日期" width="180">
        <!-- 如果单元格的内容不是prop的值key对应的值,
        此时,需要给被显示内容的外层包裹容器template-->
        <!-- 目的: 在里层使用外层tableData->组件传值
        slot-scope作用: 承上启下/传递数据
        "tableData"会自动获取上层数据的值:data="tableData"
        在里层通过tableData.row
        -->
        <template slot-scope="scope">{{ scope.row.create_time|fmtDate}}</template>
      </el-table-column>

      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showDiaEdit(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleConfig(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showRoleDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <!-- 添加 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">{{currUsername}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          {{currRoleId}}
          <el-select v-model="currRoleId">
            <!--
              1. v-model写在select
              2. 如果v-model绑定数据的值和option的value一样 -> 默认显示option(label)
              3. 如果选择了某个option,此时,v-model绑定的数据值就是被选中的option的value值

            -->
            <!-- 数字-1和"-1" -->
            <el-option disabled label="请选择" :value="-1"></el-option>

            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      // 表格数据源
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 控制对话框显示/隐藏
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      // select所绑定的数据
      currRoleId: -1,
      // 角色数据
      roles: [],
      currUsername: "",
      currUserId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //分配角色 - 发送 请求
    async setRole() {
      // id: 用户id->1看data 2. 看方法能不能传递user.id -> 在data中提供新数据currUserId
      // 请求体{rid:当前修改后的角色id}

      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      this.dialogFormVisibleRole = false;

      // console.log(res);
    },
    // 分配角色 - 打开对话框
    async showRoleDia(user) {
      // user用户信息  是否有用户的角色信息 currRoleId

      // console.log(user);
      // this.currRoleId = user.角色id
      this.currUsername = user.username;
      this.currUserId = user.id;

      this.dialogFormVisibleRole = true;

      // 获取所有角色名字
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        // 获取data
        this.roles = data;
      }
      // console.log(this.roles);

      // 根据用户id查询用户 ->获取当前用户角色id

      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      this.currRoleId = res2.data.data.rid;
    },
    // 改变用户状态
    async changeState(user) {
      // console.log(user);

      // uid 用户id
      // type 改之后状态
      // put(url,{})
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );

      console.log(res);
    },
    // 编辑 - 发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        // 刷新表格
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 编辑 - 打开对话框
    async showDiaEdit(user) {
      this.dialogFormVisibleEdit = true;
      // 获取当前编辑的数据
      const res = await this.$http.get(`users/${user.id}`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        // data
        this.form = data;
        // console.log(this.form);
      }
    },
    // 删除 - 打开确认框
    showDeleConfig(user) {
      // console.log(user);

      this.$confirm("是否删我?再考虑考虑", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 删除 - 发送请求
          const res = await this.$http.delete(`users/${user.id}`);
          // console.log(res);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success("删除成功");
            this.pagenum = 1;
            this.getTableData();
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 添加用户 - 发送请求
    async addUser() {
      // 1. 发送请求
      const res = await this.$http.post(`users`, this.form);
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 2. 关闭对话框
        this.dialogFormVisibleAdd = false;
        // 3. 刷新表格
        this.getTableData();
        // 4. 提示
      } else {
        this.$message.warning(msg);
      }
    },
    // 添加用户 - 打开对话框
    showDiaAdd() {
      // 0 清空
      this.form = {};

      this.dialogFormVisibleAdd = true;
    },
    // 点击X 获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    // 搜索
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页相关方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      // val是当前页码

      //前提: 每页2条:  比如 点击2页 -> 获取数据中第三第四条
      this.pagenum = val;
      this.getTableData();
      // console.log(`当前页: ${val}`);
    },
    // 获取用户列表数据
    async getTableData() {
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空

      // 请求头
      // 原因是 所有接口中 除了登录不需要授权->其他所有的请求都需要授权->
      // 设置请求头->Authorization=token->查看axiosAPI
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        meta: { status, msg },
        data: { total, users }
      } = res.data;
      if (status === 200) {
        // 获取成功
        this.tableData = users;
        // console.log(this.tableData);

        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>



