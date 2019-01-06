<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt="图片无法显示">
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1" class="loginout">
          <a href="#" @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu router unique-opened default-active="2">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-success"></i>
              用户列表
            </el-menu-item>
          </el-submenu>

          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-success"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-success"></i>
              权限列表
            </el-menu-item>
          </el-submenu>

          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              商品分类
            </el-menu-item>
          </el-submenu>

          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              订单列表
            </el-menu-item>
          </el-submenu>

          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view> 
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    // 如果 token 就渲染home
    // 反之 就不渲染 -> 回到登录

    beforeCreate() {
        if (!localStorage.getItem("token")) {
            this.$message.warning("请登录");
            this.$router.push({
                name: "login"
            })
        }
    },
    // 之后会继续执行钩子函数 -> mounted(){}

    methods: {
        // 清除token
        handleLoginout () {
            localStorage.clear();
            // 回到登录页面
            this.$router.push({
                name: "login"
            });
            this.$message.success("退出成功");
        }
    }

};
</script>

<style>
.container {
  height: 100%;
  /* background-color: yellow; */
}
.container .header {
  background-color: #b3c0d1;
}

.middle {
  line-height: 60px;
  color: white;
  text-align: center;
}
.loginout a {
  line-height: 60px;
  text-decoration: none;
}
</style>
