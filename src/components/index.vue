<template>
  <div style="background:#fff;">
    <el-container style="height: 100%">
      <el-header style="padding:0">
        <el-menu
          router
          :default-active="$route.meta.activeMenu"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">

          <el-menu-item index="/structure" route="/structure" class="topMenu">
            升级包构建
          </el-menu-item>
          <el-menu-item index="/auto" route="/auto" class="topMenu">
            升级包接收
          </el-menu-item>
          <el-menu-item index="/tool" route="/tool" class="topMenu">
            常用工具
          </el-menu-item>

          <el-button type="text" class="logout" @click="openlayout">退出</el-button>
          <!--<el-button  type="text" class="logout" icon="el-icon-search" @click="dialogVisible = true">错误日志</el-button>
          <el-input v-model="logId" style="width:120px;float:right;margin: 10px auto;" placeholder="请输入日志ID"></el-input>-->
        </el-menu>
        <el-dialog title="提示" :visible.sync="layout" width="30%">
          <span>是否退出系统</span>
          <span slot="footer" class="dialog-footer">
        <el-button @click="layout = false">取 消</el-button>
        <el-button type="primary" @click="layout = false">确 定</el-button>
      </span>
        </el-dialog>
      </el-header>
      <el-main style="padding: 0px">
        <router-view/>
      </el-main>
    </el-container>
    <!-- <indexdiv @transferconten='get_install_text_content'>
        <p>{{install_text_content}}</p>
      </indexdiv> -->

  </div>
</template>

<script>
  export default {
    data() {
      return {
        layout: false,
        logdialogVisible: false,
        logId: '',
        install_text_content: ""
      }
    },
    methods: {
      get_install_text_content(meg) {
        this.install_text_content = msg
        console.log(meg)

      },
      handleSelect(key, keyPath) {
        //console.log(key, keyPath);
      },
      openlayout() {
        this.$confirm('是否退出当前用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            url: "/packages/list/",
            method: "get"
          }).then(res => {
            if (res.data) {
              this.$message({message: '退出成功', type: 'success'});
              this.$router.push({path: "/"});
            } else {
              this.$message.error('退出失败，请稍后重试！');
            }
          })
        }).catch(() => {

        });
      },
    },
    mounted() {
      if (this.$route.path == "/packageList") {
        this.activeIndex = 2
      }
    }
  }
</script>
<style scoped>
  a {
    text-decoration: none;
  }

  .logout {
    float: right;
    color: white;
    margin: 10px;
  }

  .topMenu {
    display: block;
    height: 100%;
  }
</style>
