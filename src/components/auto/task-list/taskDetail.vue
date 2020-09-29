<template>
  <div>
    <el-tabs type="border-card" v-model="activeIndex" :before-leave="beforeLeave">
      <el-tab-pane name="0">
       <span slot="label" style="padding: 8px">
         <div class="el-icon-back" style="font-weight: bold;color: rgb(1,171,158)"/>
       </span>
      </el-tab-pane>
      <el-tab-pane label="任务参数" name="1">
        <el-table
          :data="data"
          border
          prop="name"
          style="width: 100%">
          <el-table-column
            prop="name"
            label='参数名'>
          </el-table-column>

          <el-table-column
            prop="data"
            label="参数">
          </el-table-column>
        </el-table>
      </el-tab-pane>


      <el-tab-pane label="任务对比" name="2">
        <el-table
          :data="resultData"
          border
          style="width: 100%">


          <el-table-column
            prop="name"
            label='类型'>
          </el-table-column>
          <el-table-column
            label="下载">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="download(scope.row.name)">下载</el-button>
              <el-button v-if="scope.row.name === '任务结果对比'" type="success" size="small" @click="showUpdate(scope.row)">
                更新基准
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-tab-pane>
    </el-tabs>

    <el-dialog title="更新基准" :visible.sync="showModel">
      <el-button type="primary" size="small" @click="toggleSelection()" style="float: right;margin-right: 15px">
        多选更新
      </el-button>
      <el-table :data="benchmark" @select="getSelect" @select-all="getSelect">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="task" label="任务类型"></el-table-column>
        <el-table-column prop="ip" label="IP站点"></el-table-column>
      </el-table>
    </el-dialog>

  </div>

</template>

<script>
  export default {
    name: "task-detail",
    data() {
      return {
        activeIndex: '1',
        data: [],
        resultData: [],
        showModel: false,
        names: {
          name: '任务名称',
          id: '任务ID',
          dev_type: '设备类型',
          sys_ver: '系统类型',
          ssh_ip: 'SSH_IP地址',
          pkg_type: '升级包类型',
          update_method: '升级方式',
          time_start_scan: '任务开始时间',
          time_end_scan: '任务结束时间',
          is_vul: '漏洞对比',
          pkg_version: '升级包版本',
          is_task: '任务对比',
          is_result_comp: '结果对比',
          is_md5: 'MD5计算',
          web_task_target: 'WEB扫描目标',
          sys_task_target: '系统扫描目标',
          pwd_task_target: '口令猜测目标'
        },
        benchmark: [],
        select: []
      };
    },
    methods: {

      getSelect(selection) {
        this.select = selection
      },

      toggleSelection() {
        const data = []
        const {id} = this.$route.query
        this.select.map((item, index) => {
          data.push({
            'taskid': id,
            'task_type': item.id,
            'target': item.ip,
            'dev_type': item.dev
          })
        })
        this.$axios.post('/update/update_benchmark/',data).then(res => {
          const {code,msg} = res.data
          if(code === 0){
            this.$message({
              message: '更新成功',
              type: 'success'
            });
          }else{
            this.$message.error(msg)
          }
        })
      },

      initData() {
        const {id} = this.$route.query
        const content = (type) => {
          this.resultData.push({
            name: type
          })
          return '升级前，升级后选择'
        }
        const noContent = '升级前，升级后未选择'
        this.$axios.get(`update/list/${id}/`).then(res => {
          delete res.data['status']
          //转换时间
          res.data['time_start_scan'] = res.data['time_start_scan'] ?
            res.data['time_start_scan'].replace('T', ' ').replace('Z', '') : ''
          res.data['time_end_scan'] = res.data['time_end_scan'] ?
            res.data['time_end_scan'].replace('T', ' ').replace('Z', '') : ''
          const web = res.data['web_task_target'].split(',')
          const sys = res.data['sys_task_target'].split(',')
          const pwd = res.data['pwd_task_target'].split(',')
          web.map(item => {
            if (item !== '') {
              this.benchmark.push({
                id:'0',
                task: 'WEB扫描目标',
                ip: item,
                dev: res.data['dev_type']
              })
            }
          })
          sys.map(item => {
            if (item !== '') {
              this.benchmark.push({
                id:'1',
                task: '系统扫描目标',
                ip: item,
                dev: res.data['dev_type']
              })
            }
          })
          pwd.map(item => {
            if (item !== '') {
              this.benchmark.push({
                id:'2',
                task: '口令猜测目标',
                ip: item,
                dev: res.data['dev_type']
              })
            }
          })
          res.data['update_method']  = res.data['update_method'] === 0 ? '自动上传' : '手动上传'
          res.data['is_md5'] = res.data['is_md5'] ? content('MD5计算对比') : noContent
          res.data['is_task'] = res.data['is_task'] ? content('任务结果对比') : noContent
          res.data['is_vul'] = res.data['is_vul'] ? content('漏洞对比') : noContent
          res.data['is_result_comp'] = res.data['is_result_comp'] ? content('结果对比') : noContent
          const nameKey = Object.keys(res.data)
          const value = Object.values(res.data)
          const newData = nameKey.map((item, index) => ({
            name: this.names[item],
            data: value[index]
          }))
          this.data = newData
        })
      },


      beforeLeave(activeIndex, oldActiveIndex) {
        if (activeIndex === '0') {
          this.$router.back()
          return false
        }
      },

      download(name) {
        const {id} = this.$route.query
        let type
        if (name === 'MD5计算对比') {
          type = 'md5'
        } else if (name === '任务结果对比') {
          type = 'result'
        } else if (name === '漏洞对比') {
          type = 'vul'
        }

        this.$axios.get(`update/download/${id}/${type}/`).then(res => {
          if (res.data.error === '没有找到对应文件') {
            this.$message.error(res.data.error)
          }else{
            window.open(`update/download/${id}/${type}/`)
          }
        })
      },

      showUpdate() {
        this.showModel = true
      }

    },
    mounted() {
      this.initData()
    }
  }
</script>

<style scoped>

</style>
