<template>
  <div class="navMenu">
    <label v-for="navMenu in menuList">
      <!--只有一级菜单-->
      <el-menu-item v-if="!navMenu.children"
                    :index="navMenu.key"
                    :route="navMenu.key"
      >
        <!--图标-->
        <i :class="navMenu.icon"></i>
        <!--标题-->
        <span slot="title">{{navMenu.title}}</span>
      </el-menu-item>
      <!--有多级菜单-->
      <el-submenu v-if="navMenu.children"
                  :key="navMenu.key"
                  :index="navMenu.key"
      >
        <template slot="title">
          <i :class="navMenu.icon"></i>
          <span> {{navMenu.title}}</span>
        </template>
        <!--递归组件，把遍历的值传回子组件，完成递归调用-->
        <Menu :menuList = "navMenu.children"/>
      </el-submenu>
    </label>

  </div>
</template>

<script>
  export default {
    name: 'Menu', //使用递归组件必须要有
    props: ['menuList'], // 传入子组件的数据
    data() {
      return {}
    },

    methods: {
    },

    mounted() {
    }
  }
</script>

<style scoped>

</style>
