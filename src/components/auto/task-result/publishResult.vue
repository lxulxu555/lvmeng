<template>
  <el-dialog title="添加基准" :visible.sync="showDialog" :before-close="closeDialog" v-if="this.showDialog">
    <el-form ref="form" :model="form" label-width="100px" >
      <el-form-item label="设备类型">
        <el-radio-group v-model="form.equipmentData" @change="changeDevType">
          <el-radio-button :label="item.value" v-for="(item,index) in equipment" :key="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="任务类型">
        <el-radio-group v-model="form.taskData" >
          <el-radio-button :label="item.value" v-for="(item,index) in task" :key="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>


      <el-form-item
        label="目标"
        v-for="(domain, index) in form.domains"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{ required: true, message: '域名不能为空', trigger: 'blur'}"
        v-if="updateResult === false"
      >
        <div style="display: flex;flex-direction: row;align-items: center">
          <el-input style="width: 400px" v-model.trim="domain.value"/>
          <div class="el-icon-remove-outline" style="font-size: 20px;margin-left: 15px"
               @click.prevent="removeDomain(domain,'sys')"/>
          <Upload ref="Upload" type="taskResult" style="margin: 0 15px 0 15px"/>
        </div>
      </el-form-item>


      <el-form-item v-if="updateResult === true" label="ip地址">
        <el-input style="width: 400px" v-model.trim="detailTarget"/>
      </el-form-item>
      <el-form-item label="上传文件" v-if="updateResult === true">
        <el-tooltip class="item" effect="dark" content="如果不上传，文件则会不变" placement="bottom-start">
          <Upload ref="Upload" type="taskResult" style="margin: 0 15px 0 15px" v-if="this.showDialog"/>
        </el-tooltip>
      </el-form-item>

      <el-form-item>
        <el-button @click="addDomain" type="danger" v-if="updateResult === false">新增IP</el-button>
        <el-button @click="save('form')" type="primary" v-if="updateResult === false">保存</el-button>
        <el-button @click="update('form')" v-if="updateResult === true" type="success">更新</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script>
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
  import Upload from "../publish-task/upload";

  export default {
    name: "publish-result",
    components: {Upload},
    data() {
      return {
        activeIndex: '0',
        resultData: [],
        task: [{
          label:'系统扫描',
          value:'0'
        }, {
          label:'口令猜测',
          value:'1'
        }, {
          label:'WEB扫描',
          value:'2'
        }],
        equipment: [{
          label:'RSAS',
          value:'1'
        }, {
          label:'WVSS',
          value:'2'
        }, {
          label:'WSM-H F01',
          value:'3'
        }],
        form: {
          taskData: '',
          equipmentData:'',
          domains: [{
            value: ''
          }],
        },
        detailData: {},
        detailTarget: '',
        updateResult: false,
        showDialog:false
      }
    },
    watch:{
      'form.equipmentData'(newVal){
        if(newVal === '2' || newVal === '3'){
          this.task = [{label:'WEB扫描', value:'2'}]
        }else{
          this.task = [{label:'系统扫描', value:'0'}, {label:'口令猜测', value:'1'}, {label:'WEB扫描', value:'2'}]
        }
      }
    },
    methods: {
      addDomain() {
        this.form.domains.push({
          value: '',
          key: Date.now()
        });
      },
      changeDevType(e){
          this.form.taskData = ''
      },

      update() {
        const {id} = this.detailData
        const formdata = new FormData()
        this.$refs.Upload.getFiles(formdata)
        formdata.append('target', this.detailTarget)
        formdata.append('task_type', this.form.taskData)
        formdata.append('dev_type', this.form.equipmentData)
        this.$axios.patch(`/update/benchmark_list/${id}/`, formdata, config).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            this.$refs['form'].resetFields();
            this.form.taskData = ''
            this.form.equipmentData = ''
            this.showDialog = false
            this.$emit('initData',1)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },

      removeDomain(item) {
        const code = this.form.domains.indexOf(item)
        if (code !== -1) {
          this.form.domains.splice(code, 1)
        }
      },

      /*打开更新基准时*/
      getDetailData(data) {
        this.showDialog = true
        this.updateResult = true
        this.detailData = data
        this.form.taskData = data.task_type.toString()
        console.log(this.form.taskData)
        this.form.equipmentData = data.dev_type
        this.detailTarget = data.target
      },

      /*打开添加基准时*/
      addDialog(){
        this.updateResult = false
        this.showDialog = true
      },


      closeDialog(done){
        this.$refs['form'].resetFields();
        this.form.taskData = ''
        this.form.equipmentData = ''
        this.showDialog = false
      },

      save(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const {domains, taskData,equipmentData} = this.form
            var formdata = new FormData()
            this.$refs.Upload.map((item, index) => {
              item.benchmark(domains, taskData,equipmentData, index, formdata)
            })
            this.$axios.post('/update/upload_benchmark/', formdata, config).then(res => {
              const {code, msg} = res.data
              if (code === 0) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.$emit('initData',1)
                this.showDialog = false
                this.$refs['form'].resetFields();
                this.form.taskData = ''
                this.form.equipmentData = ''
              } else {
                this.$message.error(msg)
              }
            })
          } else {
            return false;
          }
        });

      },
    },

  }
</script>

<style scoped>

</style>
