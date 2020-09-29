<template>
  <el-container>
    <el-aside style="width: 200px">
      <el-menu
        router
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <Menu :menuList="LeftMenus"/>
      </el-menu>
    </el-aside>
    <el-main>
        <router-view />
    </el-main>
  </el-container>
</template>

<script>
  import Menu from './menu'
  import menuList from "../../../config/menuConfig";

  export default {
    components: {Menu},
    name: "Layout",
    data() {
      return {
        LeftMenus: menuList,
      }
    },
    computed: {
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        if (meta.ChildrenActiveMenu) { // 注意这里很重要
          return meta.ChildrenActiveMenu
        }
        return path
      }
    },
  }
</script>

<style scoped>
  .el-container {
    height: 100%;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .el-menu {
    height: 100%;
  }



</style>
