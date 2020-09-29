<template>
<div>
  <h3>打包任务列表</h3>
<el-button type="primary" style="float:right" @click="new_package" icon="el-icon-plus">新建</el-button>
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
        label="名称">
      </el-table-column>
      <el-table-column
        prop="file_id"
        label="file_id"
        width="180">
      </el-table-column>
      <el-table-column
        align = "center"
        prop="config"
        label="SVN ID">
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
        <img style="cursor: pointer;" v-if="scope.row.is_error==true" src="../../assets/images/preview.gif" alt="" @click="getLog(scope.row.log[scope.row.log.length-1])">
        </template>
      </el-table-column>
      <el-table-column
        align = "center"
        prop="notice"
        label="状态信息">
      </el-table-column>
       <el-table-column

      label="操作"
      width="250">
      <template  slot-scope="scope">
          <el-button v-if="scope.row.is_error" @click="resetPackage(scope.row)"  size="mini">重置</el-button>
          <el-button @click="editPackage(scope.row)"  size="mini">编辑</el-button>
          <el-button @click="makepackage(scope.row)"  size="mini">打包</el-button>
          <el-button @click="openEncrpty(scope.row)"  size="mini">下载</el-button>
          <el-button @click="downloadmd5(scope.row.id)"  size="mini">md5</el-button>
          <el-button @click="ace_editer('pre', scope.row)"  size="mini">编辑pre_install</el-button>
          <el-button @click="ace_editer('post', scope.row)" size="mini">编辑post_install</el-button>
          <el-button @click="delete_package(scope.row)" type="danger" size="mini">删除</el-button>

      </template>


    </el-table-column>
    </el-table>
     <el-pagination style="margin-bottom: 35px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 20, 25]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
        </el-pagination>
    <el-dialog
  title="打包配置"
  :visible.sync="dialogVisible"
  width="50%">
  <div>
<el-form ref="form" :model="form"  :rules="configRules" label-width="130px">

  <el-row>
  <el-col :span="11">
  <el-form-item label="名称" prop="name">
    <el-input v-model="form.name" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
  <el-form-item label="file id" prop="file_id">
    <el-input v-model="form.file_id" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
  <el-col :span="11">
   <el-form-item label="重启服务" prop="service">
    <el-input v-model="form.service" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
   <el-form-item label="重启设备" prop="reboot">
    <el-input v-model="form.reboot" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
  <el-col :span="11">
   <el-form-item label="vulsys" prop="vulsys">
    <el-input v-model="form.vulsys" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
   <el-form-item label="vulweb" prop="vulweb">
    <el-input v-model="form.vulweb" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
  <el-col :span="11">
   <el-form-item label="rsassys" prop="rsassys">
    <el-input v-model="form.rsassys" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
   <el-form-item label="icsscansys" prop="icsscansys">
    <el-input v-model="form.icsscansys" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
  <el-col :span="11">
   <el-form-item label="bvssys" prop="bvssys">
    <el-input v-model="form.bvssys" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
   <el-form-item label="打包类型" prop="oem">
    <el-select v-model="form.oem" placeholder="请选择" style="width:80%">
      <el-option label="系统包" value="0">系统包</el-option>
      <el-option label="定制包" value="O">定制包</el-option>
      <el-option label="特殊包" value="T">特殊包</el-option>
    </el-select>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
  <el-col :span="11">
  <el-form-item label="日期" prop="date">
    <el-input v-model="form.date" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
   <el-form-item label="usetime" prop="usetime">
    <el-input v-model="form.usetime" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
   <el-row>
  <el-col :span="11">
   <el-form-item label="是否空包">
    <!--<el-input v-model="form.is_empty" style="width:80%"></el-input>-->
    <el-switch v-model="form.is_empty"></el-switch>
  </el-form-item>
  </el-col>
  <el-col :span="22" v-if="form.is_empty==false">
  <el-form-item label="svn起止版本" required>
    <el-col :span="8" style="text-align:left">
      <el-input v-model="form.svn_num_1" prop="svn_num_1"></el-input>
    </el-col>
    <el-col  class="line" style="width:30px;text-align:center">  - </el-col>
    <el-col :span="8" style="text-align:right">
      <el-input v-model="form.svn_num_2" prop="svn_num_2"></el-input>
    </el-col>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row v-if="form.is_empty==false">
    <el-col :span="22">
    <el-form-item label="不打包路径" prop="svn_exclude_tag_group">
     <el-radio-group v-model="form.svn_exclude_tag_group">

      <el-radio-button
        v-for="taggroup in TagGroups"
        v-bind:key="taggroup.id"
        :label=taggroup.id>{{taggroup.name}}</el-radio-button>

    </el-radio-group>

    </el-form-item>
    </el-col>
  </el-row>
   <el-row>
  <el-col :span="11">
   <el-form-item label="英文描述" prop="decription_en_US">
    <el-input v-model="form.decription_en_US" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
   <el-form-item label="中文描述" prop="decription_zh_CN">
    <el-input v-model="form.decription_zh_CN" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
  <el-col :span="11">
   <el-form-item label="hash">
    <el-input v-model="form.hash" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
   <el-form-item label="rely">
    <el-input v-model="form.rely" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
  <el-col :span="11">
   <el-form-item label="bvs模板">
    <el-switch v-model="form.is_use_bvs_template"></el-switch>
  </el-form-item>
  </el-col>

  </el-row>
  <el-row v-if="form.is_use_bvs_template">
  <el-col :span="11">
   <el-form-item label="bvs版本号">
    <el-input v-model="form.bvs_template_svn_num" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11">
   <el-form-item label="bvs SVN路径">
    <el-input v-model="form.bvs_template_svn_path" style="width:80%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
    <el-col :span="22">
    <el-form-item label="系统架构" prop="arch">
    <el-select v-model="form.arch" placeholder="请选择">
      <el-option
      v-for="item in arch_type_options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>
    </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="22">
    <el-form-item label="目标路径" prop="copy_target">
    <el-select v-model="form.copy_target" placeholder="请选择">
      <el-option
      v-for="item in copy_target_type_options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>
    </el-form-item>
    </el-col>
  </el-row>

</el-form>
</div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="createPackage()">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="加密升级包"
  :visible.sync="encrypt_dialogVisible"
  width="40%">
  <el-form ref="encrpty_form" :model="encrpty_form" label-width="80px">
  <el-row>
  <el-col :span="11" >
  <el-form-item label="秘钥类型">
    <el-select v-model="encrpty_form.key_type" placeholder="请选择">
      <el-option
      v-for="item in key_type_options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>
  </el-form-item>
  </el-col>
  <el-col :span="11" style="margin-left:30px">
  <el-form-item label="打包类型">
    <el-select v-model="encrpty_form.package_type" placeholder="请选择">
      <el-option
      v-for="item in package_type_options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>
  </el-form-item>
  </el-col>
  </el-row>
  <el-row>
  <el-col :span="11">
  <el-form-item label="产品类型">
    <el-select v-model="encrpty_form.product" placeholder="请选择">
      <el-option
      v-for="item in product_options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>
  </el-form-item>
  </el-col>
  <el-col :span="11" style="margin-left:30px">
  <el-form-item label="版本名">
    <el-input v-model="encrpty_form.version_name" style="width:87%"></el-input>
  </el-form-item>
  </el-col>
  </el-row>
  </el-form>
  <el-collapse v-model="activeNames" @change="handleChange(activeNames)" style="margin-left:10px">
  <!-- <el-collapse-item title="修改install" name="1"> -->
    <!-- <el-radio v-model="install_radio" label="pre" @change="getInstall">pre</el-radio>
    <el-radio v-model="install_radio" label="post" @change="getInstall">post</el-radio> -->
    <!-- <editor v-model="content" @init="editorInit" lang="html" theme="chrome" width="500" height="100"></editor> -->
    <!-- <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="install_txt"></el-input> -->
  <!-- </el-collapse-item> -->
  <el-collapse-item title="上传文件" name="2">

    <upload :package_id= "encrpty_form.id"></upload>
  </el-collapse-item>
</el-collapse>
  <el-button  @click="py_to_pyc">加密特定py文件</el-button>

  <span slot="footer" class="dialog-footer">
    <el-button @click="encrypt_dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="encrypt">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="报错信息"
  :visible.sync="log_dialogVisible"
  width="30%">
  <el-form ref="log_dialogFrom" :model="log_dialogFrom" label-width="80px">
  <el-form-item label="创建时间">
    <el-input v-model="log_dialogFrom.create_date"></el-input>
  </el-form-item>
  <el-form-item label="日志类别">
    <el-input v-model="log_dialogFrom.log_type"></el-input>
  </el-form-item>
  <el-form-item label="内容">
    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 20}" v-model="log_dialogFrom.content"></el-input>
  </el-form-item>
  </el-form>
</el-dialog>


</div>
</template>

<style scoped>
  /* .activeclose {
    background-color: rgb(187, 255, 0);
  } */

  .active{
    background-color: rgb(0, 174, 255);

  }
</style>

<script>
import SubmitForm from '../../utils/utils.js'
import upload from './upload.vue'
  export default {
    components: {upload},
    data() {
      this.taggroup_id =1,
      this.TagGroups = [{id:1,name:"系统包排除目录"}]

      return {
        // taggroup_id :1,
        // TagGroups : [{id:1,name:"系统包排除目录"}],
        install_txt:"",
        install_radio:"before",
        activeNames:[],
        count:0,
        currentPage:1,
        pagesize:10,
        encrypt_dialogVisible:false,
        dialogVisible: false,
        form: {
          "id":0,
          "name":"",
          "rsassys": "6.0.2.4.5",
          "vulsys": 0,
          "usetime": 0,
          "service": "1",
          "reboot": 0,
          "bvssys": "6.0.1.4.5",
          "config": "",
          "decription_en_US": "",
          "decription_zh_CN": "",
          "file_id": "6.0.0.22",
          "oem": "0",
          "date": "2019-10-28",
          "vulweb": 0,
          "svn_num_2": "",
          "icsscansys": "6.0.0.6.1",
          "svn_num_1": "",
          "rely": "",
          "hash": "",
          "is_empty":"false",
          "is_use_bvs_template":"false",
          "bvs_template_svn_path":"",
          "bvs_template_svn_num":"",
          "svn_exclude_tag_group":2,
          "arch": "",
          "copy_target": ""
        },
        tableData: [],
        encrpty_form:{
          "id":"",
          "key_type":"1",
          "product":"rsas",
          "package_type":"sys",
          "version_name":"V6.0R03F00SP01"
        },
        key_type_options:[{
          value: '0',
          label: '旧版秘钥'
        },{
          value: '1',
          label: '新版秘钥'
        }],
        arch_type_options:[{
          value: 'ARM64',
          label: 'ARM64'
        },{
          value: 'X86_64',
          label: 'X86_64'
        }],
        copy_target_type_options:[{
          value: 'custom',
          label: '定制'
        },{
          value: 'common',
          label: '通用'
        },{
          value: ' ',
          label: '默认'
        }],

        package_type_options:[{
          value: 'sys',
          label: 'sys'
        },{
          value: 'special',
          label: 'special'
        },{
          value: 'ctm',
          label: 'ctm'
        },{
          value: 'oem',
          label: 'oem'
        }],
        product_options:[{
          value: 'rsas',
          label: 'rsas'
        },{
          value: 'bvs',
          label: 'bvs'
        }],
        log_dialogFrom:{
          "id":"",
          "create_date":"",
          "content":"",
          "log_type":""
        },
        log_dialogVisible : false,
        configRules:{
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          file_id: [
            { required: true, message: '请输入file_id', trigger: 'blur' },
          ],
          date: [
            { required: true, message: '请输入日期', trigger: 'blur' },
          ],
          service: [
            { required: true, message: '请输入重启服务', trigger: 'blur' },
          ],
          reboot: [
            { required: true, message: '请输入重启设备', trigger: 'blur' },
          ],
          vulsys: [
            { required: true, message: '请输入vulsys', trigger: 'blur' },
          ],
          vulweb: [
            { required: true, message: '请输入vulweb', trigger: 'blur' },
          ],
          rsassys: [
            { required: true, message: '请输入rsassys', trigger: 'blur' },
          ],
          icsscansys: [
            { required: true, message: '请输入icsscansys', trigger: 'blur' },
          ],
          bvssys: [
            { required: true, message: '请输入bvssys', trigger: 'blur' },
          ],
          oem: [
            { required: true, message: '请输入oem', trigger: 'blur' },
          ],
          // config: [
          //   { required: true, message: '请输入SVN ID', trigger: 'blur' },
          // ],
          decription_en_US: [
            { required: true, message: '请输入英文描述', trigger: 'blur' },
          ],
          decription_zh_CN: [
            { required: true, message: '请输入中文描述', trigger: 'blur' },
          ],
          usetime: [
            { required: true, message: '请输入usetime', trigger: 'blur' },
          ],
          arch: [
            { required: true, message: '请输入系统架构', trigger: 'blur' },
          ],
          copy_target: [
            { required: true, message: '请输入目标目录', trigger: 'blur' },
          ]
        }
      };
    },
    methods: {
      oncheck(taggroup_id) {
        this.taggroup_id = taggroup_id
      },
      get_tag_groups_list(){
        var vm = this
        var url = "/packages/taggroups/?page=1&size=1000"
        this.$axios({
          method:"get",
          url: url
        }).then(function(response){
          vm.TagGroups = response.data.results
        })

      },
      createPackage(){
        this.$refs['form'].validate((valid) => {
        if (valid) {
        var vm = this
        this.dialogVisible = false
        var csrftoken = this.getCookie("csrftoken")
        var data = SubmitForm(this.form)

        if ("is_empty" in data){
          data["is_empty"]= (data["is_empty"].toString().toLowerCase() === 'true')
        }


        var url = "/packages/create/"

        if (this.form.id != 0){
          this.$axios({
            method:"put",
            url:"/packages/detail/"+this.form.id+"/",
            data:data,
            headers: {'X-CSRFToken': csrftoken}
          }).then(function(reponse){
            if(reponse.status==200){
              vm.getPackageList()
              vm.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });}
            else{
              vm.$message({
                showClose: true,
                message: '修改失败',
                type: 'error'
              });
            }
            })
        }
        else{
          this.$axios({
            method:"post",
            url:"/packages/create/",
            data:data,
            headers: {'X-CSRFToken': csrftoken}
          }).then(function(reponse){
            if(reponse.status==201){
              vm.getPackageList()
              vm.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            });}
            else{
              vm.$message({
                showClose: true,
                message: '创建失败',
                type: 'error'
              });
            }
            })
          }
          }else{
            return false
          }
          })
      },
      delete_package(row){
        var vm = this
        this.$axios({
          method:"delete",
          url:"/packages/detail/"+row.id+"/"
        }).then(function(response){
            vm.getPackageList()

        })

      },
      editPackage(row){
        var vm = this
        this.$axios({
          method:"get",
          url:"/packages/detail/"+row.id+"/"
        }).then(function(response){
          vm.form = response.data
          vm.form.id = row.id
          vm.dialogVisible = true
        })
      },
      resetPackage(row){
        var vm = this
        this.$axios({
          method:"post",
          url:"/packages/detail/"+row.id+"/"
        }).then(function(response){
          vm.getPackageList()

        })

      },
      makepackage(row){
        // var csrftoken = this.getCookie("csrftoken")
        var vm = this
        this.$axios({
          method: 'put',
          url:'/packages/run/'+row.id+'/',
          // headers: {'X-CSRFToken': csrftoken},
        }).then(function(response){
          if(response){
            vm.$message({
                showClose: true,
                message: response.data.detail,
              });
            }
        }).catch(function(error){
            vm.$message({
                showClose: true,
                message: error.response.data.detail,
              });
        })
        this.getPackageList()
      },

      getPackageList(){

        var vm = this

        var url = "/packages/list/?page="+this.currentPage+"&size=10"+"&config=" + this.$route.params.config_id


        this.$axios({
          method:"get",
          url: url
        }).then(function(response){
          vm.tableData = response.data.results
          vm.count = response.data.count
        })
      },
      openEncrpty(row){
        this.encrypt_dialogVisible=true
        this.encrpty_form.id=row.id
        this.activeNames=[]
      },
      encrypt(){
        // var csrftoken = this.getCookie("csrftoken")
        var vm = this
        this.encrypt_dialogVisible = false
        this.$axios({
          method:"post",
          url:"/packages/encrypt/"+this.encrpty_form.id+"/",
          // headers: {'X-CSRFToken': csrftoken},
          data:this.encrpty_form
        }).then(function(response){
          if(response.status==200){
            var url = response.data.encrypt_file_path
            vm.download(url)
          }
        })
      },
      py_to_pyc(){
        var vm = this
        this.$axios({
          method:"put",
          url:"/packages/py_to_pyc/"+this.encrpty_form.id+"/",
        }).then(function(response){
          if(response){
            vm.$message({
                showClose: true,
                message: response.data.detail,
              });
            }

        })

      },
      ace_editer(file_type, row){
        var vm = this
        this.$axios({
          method:"get",
          url:"/packages/"+file_type+"/"+row.id+"/",
        }).then(function(response){
          if(response.status==200){
            var sskey = file_type+ "_" + row.id
            sessionStorage.setItem(sskey, JSON.stringify(response.data.content))
            this.$router.push({ path: '/aceediter/' + sskey + '/' })
          }
        }.bind(this)
        )
      },

      download (data) {
        const link = document.createElement('a')
        const evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', false, false)
        link.href = data
        link.target = '_blank'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
      },

      handleSizeChange: function(size) {
        this.pagesize = size;
        this.getPackageList()
      },
      handleCurrentChange: function(currentPage) {
        this.currentPage = currentPage;
        this.getPackageList()
      },
      downloadmd5(id){
        // var csrftoken = this.getCookie("csrftoken")
        var vm = this
        this.$axios({
          method:"put",
          url:"/packages/md5/"+id+"/",
          // headers: {'X-CSRFToken': csrftoken},
        }).then(function(response){
          if(response.status==200){
            var url = response.data.md5list_file_path
            vm.download(url)
          }
        }).catch(function(error){
            vm.$message({
                showClose: true,
                message: error.response.data.detail,
              });
            })
      },
      getLog(id){
        // var csrftoken = this.getCookie("csrftoken")
        var vm = this
        this.$axios({
          method:"get",
          url:"/packages/log/"+id+"/",
          // headers: {'X-CSRFToken': csrftoken},
        }).then(function(response){
          if(response.status==200){
            vm.log_dialogVisible=true
            vm.log_dialogFrom=response.data
          }
        })
      },
      handleChange(val){
        var list = val.toString().split(',')
        if ("1" in list || "1"==list){
          this.getInstall()
        }
      },
      getInstall(){
        var file_type = this.install_radio
        var id = this.encrpty_form.id
        var vm = this
        this.$axios({
          method:"get",
          url:"/packages/"+file_type+"/"+id+"/",
        }).then(function(response){
          if(response.status==200){
            vm.install_txt=response.data.content
          }
        })
      },
      new_package(){
        this.dialogVisible = true
        this.form = {
          "id":0,
          "name":"",
          "rsassys": "6.0.3.0.5",
          "vulsys": 0,
          "usetime": 0,
          "service": "1",
          "reboot": 0,
          "bvssys": "6.0.2.0.5",
          "config": this.$route.params.config_id,
          "decription_en_US": "",
          "decription_zh_CN": "",
          "file_id": "6.0.0.23",
          "oem": "0",
          "date": "2019-10-28",
          "vulweb": 0,
          "svn_num_2": "2",
          "icsscansys": "6.0.0.6.1",
          "svn_num_1": "1",
          "rely": "",
          "hash": "",
          "is_empty":"false",
          "is_use_bvs_template":"false",
          "bvs_template_svn_path":"",
          "bvs_template_svn_num":"",
          "svn_exclude_tag_group":2,
          "arch": "X86_64",
          "copy_target": "common"

        }
      }

    },
    mounted:function(){
      this.getPackageList()
      this.get_tag_groups_list()
      const timer = setInterval(() =>{
      // 某些定时器操作
      this.getPackageList()
      }, 15000);
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      this.$once('hook:beforeDestroy', () => {
          clearInterval(timer);
      })
    }
  }
</script>
