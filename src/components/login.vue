<template>
  <div class="loginBg">
    <el-form size="medium" :model="loginForm" :rules="loginrules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container"  :inline="true">
      <img id="logo_img" style="display:block;"  class="logo">
      <h1 style="color:#507b8e" >RCM自动化系统</h1>
      <el-form-item prop="account">
        <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
      <el-form-item>
        <el-button type="primary" class="operate_btn" style="width:100%;" @click.native.prevent="login" >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          account: '',
          checkPass: ''
        },
        loginrules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        checked: true
      };
    },
    created(){
      this.keyupSubmit()
    },
    methods: {  //enter登录
      keyupSubmit(){
        document.onkeydown=e=>{
          let _key = null
          if (window.event){
            _key=window.event.keyCode;
          }
          else{
            _key = e.which
          }
          if(_key===13){
            this.login()
          }
        }
      },
      login(){
          var vm = this
          this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { username: this.loginForm.account, password: this.loginForm.checkPass };
            // var csrftoken = this.getCookie("csrftoken");
            this.$axios({
              method:'post',
              url: '/packages/login/',
              data : loginParams,
              // headers: {'X-CSRFToken': csrftoken},
            }).then(function(reponse){
              if(reponse.status==201){
                vm.$router.push({ path: '/structure' });
            }

            })
          } else {
            console.log('error submit!!');
            return false;
          }
          });
      }
    }
  }

</script>

<style  scoped  lang="css">
  .loginBg{
    height:100%;
    width:100%;
    background-size:cover;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    width: 550px;
    padding: 35px 35px 35px 35px;
    background:none;
    border:none;
    /* background:rgba(255,255,255,0.3); */
    /* border: 1px solid #eaeaea; */
    /* box-shadow: 0 0 25px #cac6c6; */
    left:0;
    right:0;
    margin:auto;
    top: 40%;
    position:absolute;
    transform: translateY(-72%);
  }
  .nsfocus {
    border: none;
    position: absolute;
    top: 24px;
    left: 34px;
    width: 117px;
    height: 17px;
}
</style>
