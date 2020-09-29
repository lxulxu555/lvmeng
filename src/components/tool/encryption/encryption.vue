<template>
  <div>
    <h3>升级包加解密</h3>

    <el-form :rules="rules" ref="form" :model="form" label-width="80px">
      <el-form-item label="方法选择" :required=true  prop="method_type">
        <el-radio-group v-model="form.method_type">
          <el-radio-button
            v-for="options in method_type_options"
            v-bind:key="options.label"
            :label=options.value>{{options.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择秘钥" :required=true prop="key_type">
        <el-radio-group v-model="form.key_type">

          <el-radio-button
            v-for="options in key_type_options"
            v-bind:key="options.value"
            :label=options.value>{{options.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传文件"  prop="upload_file_status">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          action="packages/push/"
          multiple
          :auto-upload="false"
          :limit=1
          name="upload_file"
          :file-list="file_list"
          :data=form
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-success="handleSuccess"

        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传dat/tar.gz文件</div>
        </el-upload>

      </el-form-item>




      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">开始{{form.method_type}}</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  export default {
    data() {
      var validate_upload_file = (rule, value, callback) => {

        if (this.upload_file_status=== ''){
          callback(new Error('请选择文件'));
        } else {
          callback();
        }
      };
      return {

        file_list:[],
        upload_file_status:"",
        form :{
          method_type:"",
          key_type: "",
          csrfmiddlewaretoken: ""
        },
        key_type_options:[{
          value: '0',
          label: '旧版秘钥'
        },
          {
            value: '1',
            label: '新版秘钥'
          }],
        method_type_options: [
          {
            value: 'encrypt',
            label: '加密'
          },
          {
            value: 'decrypt',
            label: '解密'
          }
        ],
        rules: {
          method_type: [
            { type: "string", required: true, message: '请选择方法', trigger: 'blur' },
          ],
          key_type: [
            { type: "string", required: true, message: '请选择秘钥', trigger: 'blur' }
          ],
          upload_file_status:[
            { validator: validate_upload_file, trigger: 'blur' }
          ]

        }
      }

    },
    methods: {
      getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
          return (arr[2]);
        else
          return null;
      },
      onSubmit(form){
        var vm =this
        this.$refs[form].validate((valid) => {
          if (valid) {
            vm.form.csrfmiddlewaretoken = vm.getCookie("csrftoken")
            vm.$refs.upload.submit();
            // vm.file_list =[]
            // vm.upload_file_status = ""
          }
        });

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

      handleSuccess(response, file, fileList){
        this.download(response.file_path)
        this.file_list =[]
        this.upload_file_status = ""


      },
      handleRemove(file, fileList) {
        this.upload_file_status = ""
      },
      handleChange(file, fileList) {
        this.upload_file_status = "有文件了"
      },

    }
  }
</script>
