<template>
  <div class="example-drag">
    <div class="upload" style="background:#409eff">
      <ul v-if="files.length">
        <li v-for="(file, index) in files" :key="file.id">
          <span>{{file.name}}</span> -
          <span>{{file.size | formatSize}}</span> -
          <span v-if="file.error">{{file.error}}</span>
          <span v-else-if="file.success">上传成功</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
        </li>
      </ul>
      <ul v-else>
        <td colspan="7">
          <div class="text-center p-5">
            <h4>拖拽文件或文件夹上传</h4>
            <h4>注意!!!上传文件的用户组将变为root,文件权限变为644</h4>
          </div>
        </td>
      </ul>




      <div class="example-btn">
        <file-upload
          class="btn btn-primary"
          :custom-action="customAction"
          :multiple="true"
          :drop="true"
          :drop-directory="true"
          v-model="files"
          ref="upload">
        </file-upload>

        <el-button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          开始上传
        </el-button>
        <el-button type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
          <i class="fa fa-stop" aria-hidden="true"></i>
          停止上传
        </el-button>
        <el-button  @click="$refs.upload.clear()">清空文件区</el-button>
      </div>
    </div>

  </div>
</template>
<style>
/* .example-drag label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.example-drag .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
.example-drag .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
} */
</style>

<script>
import FileUpload from 'vue-upload-component'
import getCookie from '../../router'
export default {
  components: {
    FileUpload,
  },
  props: ["package_id"],
  data() {
    return {
      files: [],
    }
  },
  methods:{
    async customAction(fileobj, component) {
      let formData = new FormData();
      formData.append(
        "upload_file",
        fileobj.file,
        fileobj.name);

      formData.append(
        "file_path", fileobj.name);

      this.$axios.put(
        "/packages/upload/"+this.package_id+"/",
        formData).then(response => {
        })

    },
    // clean_all_file() {

    // }


  }

}
</script>
