<template>
<div>
  <el-tabs v-model="activeName" @tab-click="change_config">
    <el-tab-pane label="标签组" name="taggroups"></el-tab-pane>
    <el-tab-pane label="标签" name="tags"></el-tab-pane>
  </el-tabs>

<el-row>
<el-button type="primary" style="float:right" @click="opendialog" icon="el-icon-plus">新建</el-button>
</el-row>

<el-row>
  <el-col style="width: 90%;height:100%">

    <el-table
      :data="tableData"
      >
      <el-table-column
        v-for="{ prop, label } in config"
        :key="prop"
        :prop="prop"
        :label="label"
        :formatter="formatBoolean">
      </el-table-column>

       <el-table-column
        label="操作"
        >
        <template
          slot-scope="scope"
          v-if="scope.row.is_default==false">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>

    </el-table>
     <el-pagination
      style="margin-bottom: 35px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[10, 15, 20, 25]"
      :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length">

      </el-pagination>


  </el-col>
</el-row>


<el-dialog :title="dialogTagGroup_title" :visible.sync="dialogTagGroupVisible">
  <el-form :model="taggroup_form">
    <el-form-item label="name" :label-width="formLabelWidth">
      <el-input  v-model="taggroup_form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="tags" :label-width="formLabelWidth">
      <el-checkbox-group v-model="taggroup_form.tags">
        <el-checkbox
          v-for="each_tag in tag_list"
          v-bind:key="each_tag.id"
          :label=each_tag.id>{{each_tag.name}}</el-checkbox>
      </el-checkbox-group>

    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogTagGroupVisible = false">取 消</el-button>
    <el-button v-if="dialogTagGroup_model=='new'" type="primary" @click="create_tag_group()">确 定</el-button>
    <el-button v-if="dialogTagGroup_model=='change'" type="primary" @click="update_tag_group()">确 定</el-button>

  </div>
</el-dialog>

<el-dialog :title="dialogTag_title" :visible.sync="dialogTagVisible">
  <el-form :model="tag_form">
    <el-form-item label="标签名" :label-width="formLabelWidth">
      <el-input  v-model="tag_form.name" ></el-input>
    </el-form-item>
    <el-form-item label="内容" :label-width="formLabelWidth">
      <el-input  v-model="tag_form.content" ></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogTagVisible = false">取 消</el-button>
    <el-button v-if="dialogTag_model=='new'" type="primary" @click="create_tag()">确 定</el-button>
    <el-button v-if="dialogTag_model=='change'" type="primary" @click="update_tag()">确 定</el-button>

  </div>
</el-dialog>


</div>

</template>



<script>
export default {
  data() {
    this.config =[],

    this.TagGroupConfigs = [
      {prop: "id", label: "id"},
      {prop: "name", label: "名称"},
      {prop: "tags", label: "包含标签"},
      {prop: "is_default", label: "是否系统默认"},
      {prop: "user", label: "所属"},
    ],
    this.TagConfigs = [
      {prop: "id", label: "id"},
      {prop: "name", label: "名称"},
      {prop: "content", label: "内容"},
      {prop: "is_default", label: "是否系统默认"},
      {prop: "user", label: "所属"}
    ],
    this.type_name = "taggroups"


    return {
      activeName:'taggroups',
      dialogTagGroupVisible: false ,
      dialogTagGroup_title :"新建标签组",
      dialogTagGroup_model : "new",
      taggroup_form: {
        id : 0,
        name:"",
        tags:[]},

      dialogTagVisible: false,

      dialogTag_title :"新建标签",
      dialogTag_model : "new",
      tag_form: {
        id : 0,
        name:"",
        content:""
      },
      formLabelWidth: '120px',

      count:0,
      currentPage:1,
      pagesize:10,
      tableData: [],
      tag_list :[]
    }
  },
  methods: {
      create_tag(){
      this.dialogTagVisible = false

      var vm = this
      var url = "/packages/" + this.type_name + "/"
      this.$axios({
        method:"post",
        url: url,
        data:vm.tag_form
      }).then(function(response){
        vm.get_List(vm.type_name);

      })

    },
    update_tag(){
      this.dialogTagVisible = false
      var vm = this
      var url = "/packages/tag/" + this.tag_form.id + "/"
      this.$axios({
        method:"put",
        url: url,
        data:vm.tag_form
      }).then(function(response){
        vm.get_List(vm.type_name);
      })
      this.dialogTagGroup_model = "new"
      this.dialogTagGroup_title ="新建标签"

    },
    handleDelete(index, row){
      var vm = this
      var url = "/packages/"+ this.type_name.slice(0,-1) +"/" + row.id + "/"
      this.$axios({
        method:"delete",
        url: url
      }).then(function(response){
        vm.get_List(vm.type_name);
      })

    },
    handleEdit(index, row){
      if (this.type_name == "taggroups"){

        this.dialogTagGroup_title ="编辑标签组",
        this.dialogTagGroup_model = "change"
        this.dialogTagGroupVisible = true
        this.taggroup_form = row
        } else{
          this.dialogTag_title ="编辑标签",
          this.dialogTag_model = "change"
          this.dialogTagVisible = true
          this.tag_form = row

        }
    },

    update_tag_group(){
      this.dialogTagGroupVisible = false
      var vm = this
      var url = "/packages/taggroup/" + this.taggroup_form.id + "/"
      this.$axios({
        method:"put",
        url: url,
        data:vm.taggroup_form
      }).then(function(response){
        vm.get_List(vm.type_name);
      })
      this.dialogTagGroup_model = "new"
      this.dialogTagGroup_title ="新建标签组"

    },

    create_tag_group(){
      this.dialogTagGroupVisible = false
      var vm = this
      var url = "/packages/taggroups/"
      this.$axios({
        method:"post",
        url: url,
        data:vm.taggroup_form
      }).then(function(response){
        vm.get_List(vm.type_name);
      })

    },
    opendialog(){
      // 打开弹窗
      if (this.type_name == "taggroups"){
        this.dialogTagGroupVisible = true

      } else {
        this.dialogTagVisible = true

      }

    },
    formatBoolean(row, column, cellValue) {

      if (column.property == "is_default"){
        var ret = ''
        if (cellValue) {
                ret = "是"  //根据自己的需求设定
            } else {
                ret = "否"
            }
        return ret
        } else if (column.property == "user"){
          if (cellValue==null){
            return "system"
          }
        }
      return cellValue;
    },
    get_tag_list(){
      var vm = this
      var url = "/packages/tags/?page="+this.currentPage+"&size="+this.pagesize
      this.$axios({
        method:"get",
        url: url
      }).then(function(response){
        vm.tag_list = response.data.results
      })

    },
    get_List(type_name){

      var vm = this
      var url = "/packages/" + type_name + "/?page="+this.currentPage+"&size="+this.pagesize
      this.$axios({
        method:"get",
        url: url
      }).then(function(response){
        console.log(response.data.results)
        vm.tableData = response.data.results
        vm.count = response.data.count
      })
    },

    handleSizeChange: function(size) {
        this.pagesize = size;
        this.get_List(this.type_name)
      },
    handleCurrentChange: function(currentPage) {
        this.currentPage = currentPage;
        this.get_List(this.type_name)
      },

    change_config(){
      if (this.activeName == "tags") {
        this.config= this.TagConfigs
      } else {
        this.config= this.TagGroupConfigs
      }
      this.type_name = this.activeName
      this.get_List(this.activeName)

    }

  },
  mounted:function(){
    this.change_config('taggroups');
    this.get_List("taggroups");
    this.get_tag_list();




    }
}

</script>
