<template>
<div>
<el-button type="primary" style="float:right" @click="openDialog" icon="el-icon-plus">新建</el-button>
<!-- <el-button type="primary" @click="openDialog" icon="el-icon-plus">非svn打包</el-button> -->
<el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="now_svn_version"
        label="svn版本号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="svn_path"
        label="svn路径">
      </el-table-column>
      <el-table-column
        align = "center"
        prop="is_finished"
        label="状态"
        width="180">
        <template slot-scope="scope">
        <img v-if="scope.row.is_finished" src="../../assets/images/set_on.gif" alt="">
        <img v-else src="../../assets/images/set_off.gif" alt="">
        </template>
      </el-table-column>
      <el-table-column
        align = "center"
        prop="is_error"
        label="报错信息"
        width="180">
        <template slot-scope="scope">
        <img v-if="scope.row.is_error==false" src="../../assets/images/set_on.gif" alt="">
        <span v-if="scope.row.is_error==true">{{scope.row.is_error}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align = "center"
        prop="notice"
        label="状态信息"
        width="180">
      </el-table-column>
       <el-table-column
      fixed="right"
      label="操作"
      width="220">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)"  size="mini">更新</el-button>
        <el-button @click="handlepackage(scope.row)"  size="mini">打包</el-button>
        <el-button v-if="scope.row.is_delete==true" @click="tag_delete_config(scope.row)"  type="danger" size="mini">删除</el-button>

      </template>
    </el-table-column>
    </el-table>
    <el-pagination style="margin-bottom: 35px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
        </el-pagination>
    <el-dialog
  title="新建SVN"
  :visible.sync="dialogVisible"
  width="30%">
  <div>
  <el-form ref="svnForm" :model="svnForm" label-width="80px">
  <el-form-item label="名称">
    <el-input v-model="svnForm.name"></el-input>
  </el-form-item>
  <el-form-item label="SVN路径">
  <el-input v-model="svnForm.svn_path"></el-input>
  </el-form-item>
  <el-form-item label="用户名">
  <el-input v-model="svnForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码">
  <el-input v-model="svnForm.password"  type="password"></el-input>
  </el-form-item>
  </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="createSvn">确 定</el-button>
  </span>
</el-dialog>


<el-dialog title="删除svn" :visible.sync="dialogDeleteVisible">
   <h3>注意!!! 删除svn配置将删除与该svn相关的所有打包记录</h3>
   <br>
   <h3>确认删除吗?</h3>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogDeleteVisible = false">取 消</el-button>
    <el-button type="primary" @click="delete_config()">确 定</el-button>

  </div>
</el-dialog>
</div>
</template>

<script>
  export default {
    data() {
      return {
        svn_id:0,
        dialogDeleteVisible : false,
        dialogVisible: false,
        svnForm: {
          name: '',
          svn_path:'',
          username:'',
          password:''
        },
        tableData: [],
        currentPage:1,
        pageSize:10,
        count:0
      };
    },
    methods: {
      tag_delete_config(row){
        this.dialogDeleteVisible = true
        this.svn_id = row.id
      },
      delete_config(){
        var vm = this
        var url = '/packages/config/' + this.svn_id+"/detail/"
        this.$axios({
          method: 'delete',
          url: url
        }).then(function(response){
          vm.getSvnList()

        })
        this.dialogDeleteVisible=false

      },

      createSvn(){
        this.dialogVisible = false
        // var csrftoken = this.getCookie("csrftoken")
        var vm = this
        this.$axios({
          method: 'post',
          url: '/packages/configs/',
          data: this.svnForm,
          // headers: {'X-CSRFToken': csrftoken},
        }).then(function(response){
          if(response.status==201){
            vm.getSvnList();
            vm.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              });
            }else{
              vm.$message({
                showClose: true,
                message: '创建失败',
                type: 'error'
              });
          }
        })
      },

      getSvnList(){
        var vm = this
        this.$axios({
          method: 'get',
          url: '/packages/configs/?page='+this.currentPage+'&size='+this.pageSize,
        }).then(function(response){
          vm.tableData=response.data.results
          vm.count = response.data.count
        })
      },
      openDialog(){
        this.svnForm.name = '',
        this.svnForm.svn_path = '',
        this.svnForm.username = '',
        this.svnForm.password = '',
        this.dialogVisible = true
      },
      handleClick(row){
        var vm = this
        this.$axios({
          method: 'put',
          url: '/packages/config/'+row.id+'/checkout/',
        }).then(function(response){
          vm.$message({
                showClose: true,
                message: response.data.detail,
              });
        }).catch(function(error){
          vm.$message({
              showClose: true,
              message: error.response.data.detail,
            });
        })
      },

      handlepackage(row){
        this.$router.push({ path: '/structure/packageList/' + row.id+"/" })

      },
      handleSizeChange: function(size) {
        this.pageSize = size;
        this.getSvnList()
      },
      handleCurrentChange: function(currentPage) {
        this.currentPage = currentPage;
        this.getSvnList()
      }
    },
    mounted:function (){
      this.getSvnList()
      const timer = setInterval(() =>{
      // 某些定时器操作
      this.getSvnList()
      }, 15000);
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      this.$once('hook:beforeDestroy', () => {
          clearInterval(timer);
      })

    }
  }

</script>
