<template>
  <el-form ref="form" :model="form" label-width="180px" :rules="rules">
    <el-form-item label="任务名" prop="name">
      <el-input v-model="form.name" style="width: 300px"/>
    </el-form-item>

    <el-form-item label="设备类型" prop="dev_type">
      <el-select
        v-model="form.dev_type"
        placeholder="请选择设备"
        @change="changeDevType"
      >
        <el-option
          v-for="item in devTypeOptions"
          :key="item.label"
          :label="item.label"
          :value="item.label"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="系统类型" prop="sys_ver">
      <el-radio-group v-model="form.sys_ver">
        <el-radio
          v-for="item in sysVerOptions"
          :label="item.label"
          :key="item.label"
        >
          {{item.value}}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <div class="ssh">
      <el-form-item label="设备IP地址" prop="ssh_ip">
        <el-input v-model.trim="form.ssh_ip" style="width: 300px"/>
      </el-form-item>
      <el-form-item label="SSH端口" prop="ssh_port">
        <el-input v-model.trim="form.ssh_port" style="width: 300px"/>
      </el-form-item>
    </div>

    <div class="ssh">
      <el-form-item label="SSH账户" prop="ssh_user">
        <el-input v-model.trim="form.ssh_user" style="width: 300px"/>
      </el-form-item>
      <el-form-item label="SSH密码" prop="ssh_passwd">
        <el-input v-model.trim="form.ssh_passwd" style="width: 300px" type="password"/>
      </el-form-item>
    </div>


    <div class="ssh">
      <el-form-item label="升级包类型" prop="pkg_type">
        <el-select
          style="width: 300px"
          v-model="form.pkg_type"
          placeholder="请选择升级包"
        >
          <el-option
            v-for="item in pkgTypeOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="升级包版本" prop="pkg_version">
        <el-input v-model.trim="form.pkg_version" style="width: 300px"/>
      </el-form-item>
    </div>


    <el-form-item label="升级方式">
      <el-radio-group v-model="form.update_method">
        <el-radio :label=1>手动升级</el-radio>
        <el-radio :label=0>自动升级</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="选择升级包" v-if="form.update_method === 1">
      <el-tooltip class="item" effect="dark" content="最多选择三个文件" placement="top-start">
        <Upload ref="Upload" @getFileList="getFileList" :editFiles="editFiles"/>
      </el-tooltip>
    </el-form-item>


    <div v-else>
      <div class="ssh">
        <el-form-item label="升级站点配置" prop="upgrade_site">
          <el-input v-model.trim="form.upgrade_site" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="时间" prop="update_time">
          <el-tooltip class="item" effect="dark" content="输入升级等待时间，范围3~1440分钟" placement="top-start">
            <el-input v-model.trim="form.update_time" style="width: 300px">
              <template slot="append">分钟</template>
            </el-input>
          </el-tooltip>
        </el-form-item>
      </div>

      <div class="ssh">
        <el-form-item label="内网升级系统登录账户" prop="upgrade_user">
          <el-input v-model.trim="form.upgrade_user" style="width: 300px"/>
        </el-form-item>

        <el-form-item label="内网升级系统登录密码" prop="upgrade_passwd">
          <el-input v-model.trim="form.upgrade_passwd" style="width: 300px" type="password"/>
        </el-form-item>
      </div>


    </div>

    <el-form-item label="升级前操作">
      <el-checkbox-group
        v-model="updateDiff"


      >
        <el-checkbox-button
          v-for="operation in updateAfter"
          :label="operation"
          :key="operation"
        >
          {{operation}}
        </el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="升级后操作">
      <el-checkbox-group
        v-model="updateDiff"

      >
        <el-checkbox-button
          v-for="operation in updateBefore"
          :label="operation"
          :key="operation"
        >
          {{operation}}
        </el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>


    <el-form-item label="系统扫描目标" prop="sys_task_target" v-if="showTaskTarget === true">
      <el-tooltip class="item" effect="dark" :content="tip" placement="bottom-start">
        <el-input v-model.trim="form.sys_task_target" style="width: 300px"/>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="WEB扫描目标" prop="web_task_target" v-if="showTaskTarget === true">
      <el-tooltip class="item" effect="dark" :content="tip" placement="bottom-start">
        <el-input v-model.trim="form.web_task_target" style="width: 300px"/>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="口令猜测目标" prop="pwd_task_target" v-if="showTaskTarget === true">
      <el-tooltip class="item" effect="dark" :content="tip" placement="bottom-start">
        <el-input v-model.trim="form.pwd_task_target" style="width: 300px"/>
      </el-tooltip>
    </el-form-item>


    <el-form-item label="发送邮件">
      <el-switch
        disabled
        v-model="form.is_mail"
      >
      </el-switch>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
  import Upload from './upload'
  import {
    time,
    port,
    ip,
    sysVerOptions,
    devTypeOptions,
    updateBefore,
    updateAfter,
    TaskType,
    tip,
  } from './initData'

  export default {
    components: {Upload},
    name: "PublishTask",
    data() {
      return {
        uploadList: [],
        tip,
        sysVerOptions,
        devTypeOptions,
        updateBefore,
        updateAfter,
        TaskType,
        pkgTypeOptions: [],
        updateDiff: [],
        showTaskTarget: false,
        form: {
          id: '',
          name: '',
          dev_type: '',
          sys_ver: 0,
          ssh_ip: '',
          ssh_port: '',
          ssh_user: '',
          ssh_passwd: '',
          pkg_type: '',
          update_method: 1,
          pkg_version: '',
          upgrade_site: `http://${window.location.host}`,
          update_time: '3',
          upgrade_user: '',
          upgrade_passwd: '',
          sys_task_target: '',
          web_task_target: '',
          pwd_task_target: '',
          is_mail: true,
          is_md5: false,
          is_vul: false,
          is_task: false,
          is_result_comp: false,
          opt: ''
        },
        rules: {
          name: this.rulesOption('请输入任务名称'),
          dev_type: this.rulesOption('请选择设备类型'),
          sys_ver: this.rulesOption('请选择系统类型'),
          ssh_ip: {validator: ip, trigger: 'change', required: true},
          ssh_port: {validator: port, trigger: 'change', required: true},
          ssh_user: this.rulesOption('请输入账户'),
          ssh_passwd: this.rulesOption('请输入密码'),
          pkg_type: this.rulesOption('请选择升级包类型'),
          pkg_version: this.rulesOption('请输入升级包版本'),
          upgrade_site: this.rulesOption('请输入升级站点'),
          update_time: {validator: time, trigger: 'change', required: true},
          upgrade_user: this.rulesOption('请输入账户'),
          upgrade_passwd: this.rulesOption('请输入密码'),
        },
        editFiles: []
      }
    },

    watch: {
      //监听升级前后操作
      updateDiff(newVal, oldVal) {
        //选择结果对比，自动选择创建任务
        if (newVal.indexOf('结果对比') !== -1 && newVal.indexOf('创建任务') === -1) {
          newVal.push('创建任务')
          //取消选择结果对比
        } else if (oldVal.indexOf('结果对比') !== -1 && newVal.indexOf('结果对比') === -1) {
          var index = newVal.indexOf('创建任务')
          if (index > -1) {
            newVal.splice(index, 1)
          }
        }
        if(newVal.indexOf('创建任务') !== -1){
          this.form.is_task = true
        }else{
          this.form.is_task = false
          this.form.sys_task_target= ''
          this.form.web_task_target= ''
          this.form.pwd_task_target= ''
        }
        this.form.is_md5 = newVal.indexOf('MD5计算') !== -1;
        this.form.is_result_comp = newVal.indexOf('结果对比') !== -1;
        this.form.is_vul = newVal.indexOf('核心功能') !== -1;
        this.showTaskTarget = newVal.indexOf('创建任务') !== -1;
      },
      //监听升级方式
      'form.update_method'(newVal) {
        if (newVal === 1) {
          this.form.upgrade_user = ''
          this.form.upgrade_passwd = ''
        }
      },
      //监听设备类型
      'form.dev_type'(newVal) {
        if (newVal === 'BVS') {
          this.pkgTypeOptions.push({
            label: '系统包'
          })
        } else if (newVal === 'WVSS') {
          this.form.sys_ver = 32
          this.sysVerOptions.splice(1, 1)
          this.pkgTypeOptions.push({
            label: '系统包'
          }, {
            label: 'WEB插件包'
          })
        } else {
          if (newVal === 'WSM-H F01') {
            this.form.sys_ver = 64
            this.sysVerOptions.splice(0, 1)
          } else if (newVal === 'WSMS') {
            this.form.sys_ver = 32
            this.sysVerOptions.splice(1, 1)
          }
          this.pkgTypeOptions.push({
              label: '系统包'
            }, {
              label: '系统插件包'
            }, {
              label: 'WEB插件包'
            }, {
              label: '审计规则包'
            }
          )
        }
      },
      //监听升级包类型时
      'form.pkg_type'(newVal) {
        const {updateAfter, updateBefore} = this
        if (newVal !== '系统插件包' && updateAfter.includes('漏洞对比') && updateBefore.includes('漏洞对比')) {
          this.updateAfter.splice(1, 1)
          this.updateBefore.splice(1, 1)
        } else if (newVal === '系统插件包') {
          this.updateAfter.splice(1, 0, '漏洞对比')
          this.updateBefore.splice(1, 0, '漏洞对比')
        }
      },
    },

    methods: {

      rulesOption(message) {
        return {required: true, message: message, trigger: "change"}
      },
      changeDevType() {
        this.pkg_type = ''
        this.pkgTypeOptions = []
        this.form.sys_ver = 0
        this.sysVerOptions = [{
          label: 32,
          value: '32位'
        }, {
          label: 64,
          value: '64位'
        }]
      },

      onSubmit(ref) {
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        const {uploadList, form} = this


        this.$refs[ref].validate((valid) => {
          if (valid) {
            const formdata = new FormData()
            if (this.form.update_method === 1) {
              this.$refs.Upload.myUploadFile(formdata)
              var opt = ""
              uploadList.filter(item => !item.size).map(item => {
                opt += item.name + ","
              })
              this.form.opt = opt.substring(0, opt.lastIndexOf(','));
            }
            const keys = Object.keys(form)
            const values = Object.values(form)
            keys.map((item, index) => {
              formdata.append(item, values[index])
            })
            if (uploadList === '' && form.update_method === 1) {
              this.$message.error('请上传升级包');
            } else {
              if (uploadList !== '' && form.update_method === 1) {
                const type = []
                uploadList.map(item => {
                  const fileType = item.name.substr(item.name.lastIndexOf('.') + 1)
                  type.push(fileType)
                })
                if (!type.includes('dat') || !type.includes('list')) {
                  this.$message.error('请上传dat和list文件')
                  return
                }
              }
              this.$axios.post('/update/create/', formdata, config).then(res => {
                if (res.data.code === 0) {
                  this.$message({
                    message: `${res.data.id}号任务创建成功`,
                    type: 'success'
                  });
                  this.$router.push('/auto/taskList')
                } else {
                  this.$message.error(res.data.msg)
                }
              })
            }
          } else {
            return false;
          }
        });
      },


      getFileList(list) {
        this.uploadList = list
      },

      getEditData(id) {
        this.$axios.put(`update/list/${id}/`).then(res => {
            if (res.data.update_method === 1) {
              res.data.upgrade_site = `http://${window.location.host}`
              res.data.update_time = '3'
              res.data.upgrade_user = ''
              res.data.upgrade_passwd = ''
            }
            if (res.data.is_md5 === true) {
              this.updateDiff.push('MD5计算')
            }
            if (res.data.is_task === true) {
              this.updateDiff.push('创建任务')
            }
            if (res.data.is_vul === true) {
              this.updateDiff.push('漏洞对比')
            }
            if (res.data.is_result_comp === true) {
              this.updateDiff.push('结果对比')
            }
            this.form = res.data
            this.form['is_mail'] = true
            if (res.data['pkg']) {
              this.editFiles.push(
                {
                  name: res.data['pkg'],
                  raw: {
                    name: res.data['pkg'],
                  }
                }
              )
            }
            if (res.data['md5']) {
              this.editFiles.push(
                {
                  name: res.data['md5'],
                  raw: {
                    name: res.data['md5'],
                  }
                }
              )
            }
            if (res.data['vul_excel']) {
              this.editFiles.push(
                {
                  name: res.data['vul_excel'],
                  raw: {
                    name: res.data['vul_excel'],
                  }
                }
              )
            }
            delete this.form.pkg
            delete this.form.md5
            delete this.form.vul_excel

          }
        )
      }
    },

    mounted() {
      const {id} = this.$route.query
      if (id) {
        this.getEditData(id)
      }
    }
    ,

  }

</script>

<style lang="less" scoped>
  .flex(@type) {
    display: flex;
    flex-direction: @type;
  }

  .ssh {
    .flex(row);

    .el-form-item {
      margin-right: 50px;
    }
  }

  .switch {
    .flex(row);

    span {
      font-weight: bold;
    }

    .el-switch {
      margin-top: 10px;
    }
  }


</style>
