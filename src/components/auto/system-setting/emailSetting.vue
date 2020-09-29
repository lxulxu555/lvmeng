<template>
  <div>
    <el-form ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item label="邮件服务器地址" prop="smtp_addr">
        <el-input v-model="form.smtp_addr" style="width: 300px"/>
      </el-form-item>
      <el-form-item label="端口" prop="smtp_port">
        <el-input v-model="form.smtp_port" style="width: 300px"/>
      </el-form-item>
      <el-form-item label="邮箱账号" prop="smtp_user">
        <el-input v-model="form.smtp_user" style="width: 300px"/>
      </el-form-item>
      <el-form-item label="密码" prop="smtp_pwd">
        <el-input v-model="form.smtp_pwd" style="width: 300px" type="password"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "EmailSetting",
    data(){
      return {
        form:{
          smtp_addr:'',
          smtp_port:'',
          smtp_user:'',
          smtp_pwd:''
        },
        rules:{
          smtp_addr: {required: true, message: '请输入邮箱服务器地址', trigger: "change"},
          smtp_port: {required: true, message: '请输入端口号', trigger: "change"},
          smtp_user: {required: true, message: '请输入邮箱账号', trigger: "change"},
          smtp_pwd: {required: true, message: '请输入邮箱密码', trigger: "change"},
        }
      }
    },
    methods:{
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.form.smtp_port = parseInt(this.form.smtp_port)
            this.$axios.post('/update/email_setting/',this.form).then(res => {
              if(res.data.success === '配置成功'){
                this.$message({
                  message: '配置成功',
                  type: 'success'
                });
              }else{
                this.$message.error(res.data.error)
              }
            })
          } else {
            return false;
          }
        });

      },
      initData(){
        this.$axios.get('/update/email_setting/').then(res => {
          const {msg,code} = res.data
          if(code === 0){
            const {EMAIL_HOST,EMAIL_HOST_PASSWORD,EMAIL_HOST_USER,EMAIL_PORT} = msg
            this.form.smtp_addr = EMAIL_HOST
            this.form.smtp_port = EMAIL_PORT
            this.form.smtp_user = EMAIL_HOST_USER
            this.form.smtp_pwd = EMAIL_HOST_PASSWORD
          }else{
            this.$message.error('配置初始化失败')
          }
        })
      }
    },
    mounted() {
      this.initData()
    }
  }
</script>

<style scoped>

</style>
