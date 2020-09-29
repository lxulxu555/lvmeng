<template>
  <el-upload
    v-if="type !== 'tool'"
    class="upload"
    :drag="type!=='taskResult'"
    action=""
    :multiple="type!=='taskResult'"
    ref="upload"
    :limit="type === 'taskResult' ? 1 : 3"
    :accept="type === 'taskResult' ? '.xml':'.list,.xlsx,.xls,.dat'"
    :file-list="fileList"
    :auto-upload="false"
    :on-change="onChangeFile"
    :before-remove="beforeRemove"
    :on-remove="onRemoveFile"
  >
    <el-button size="small" type="primary" v-if="type === 'taskResult'">点击上传</el-button>
    <div v-else>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </div>
  </el-upload>

  <el-upload
    v-else
    class="upload"
    :drag="true"
    action=""
    :multiple="true"
    ref="upload"
    accept='.mm'
    :file-list="fileList"
    :auto-upload="false"
    :on-change="onChangeToolFile"
    :before-remove="beforeRemove"
    :on-remove="onRemoveFile"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>


</template>

<script>
  export default {
    name: "upload",
    props: ['type', 'editFiles'], // 传入子组件的数据
    data() {
      return {
        fileList: [], // // 上传文件列表
        upFileList: [], // 文件File列表 上传参数,
      }
    },
    watch: {
      upFileList(newVal) {
        this.$emit('getFileList', newVal)
      }
    },
    methods: {
      initFiles() {
        this.fileList = this.editFiles
        this.upFileList = this.fileList
      },
      // 选择上传文件
      onChangeFile(file, fileList) {
        this.upFileList = []
        for (let x of fileList) {
          if (x.raw) {
            this.upFileList.push(x.raw)
          }
        }
      },

      onChangeToolFile(file, fileList) {
        if (fileList.length > 0) {
          this.fileList = [fileList[fileList.length - 1].raw]  // 这一步，是 展示最后一次选择的文件
        }
      },

      // 移除文件之前
      beforeRemove(file, fileList) {
        return this.$msgbox.alert(`确定移除 ${file.name}？`)
      },

      // 移除文件
      onRemoveFile(file, fileList) {
        this.upFileList = []
        for (let x of fileList) {
          if (x.raw) {
            this.upFileList.push(x.raw)
          }
        }
      },

      //上传任务结果基准
      benchmark(targets, taskData, equipmentData,index, formdata) {
        formdata.append(`targets[${index}][target]`, targets[index].value)
        formdata.append(`targets[${index}][dev_type]`, equipmentData)
        formdata.append(`targets[${index}][task_type]`, taskData)
        if(!this.upFileList){
          this.$message.error('请上传')
        }else{
          formdata.append(`targets[${index}][benchmark_file]`, this.upFileList[0])
        }
      },

      //小工具中上传文件
      tool(fromdata) {
        if (!this.fileList[0]) {
          this.$message.error('请上传文件')
        } else {
          fromdata.append('upload_file', this.fileList[0])
        }
      },

      getFiles(formdata) {
        console.log(this.upFileList)
        const files = !this.upFileList ? '' : this.upFileList[0]
        return formdata.append('benchmark_file', files)
      },

      // 请求 上传产品文件 接口
      myUploadFile(formData) {
        console.log(this.upFileList)
        this.upFileList.map(item => {
          const fileType = item.name.substr(item.name.lastIndexOf('.') + 1)
          if (fileType === 'dat' && item.size) {
            formData.append('pkg', item)
          } else if (fileType === 'list' && item.size ) {
            formData.append('md5', item)
          } else if (fileType === 'xls' || fileType === 'xlsx' && item.size) {
            formData.append('vul_excel', item)
          }
        })
      }
    },

    mounted() {
      this.$emit('getFileList', '')
      this.initFiles()
    }
  }

</script>

<style>
  .el-upload-dragger {
    height: 100px
  }

  .el-upload-dragger .el-icon-upload {
    margin: 0;
  }
</style>
