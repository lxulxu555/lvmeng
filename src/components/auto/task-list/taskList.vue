<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="data"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="(row)=>{ return row.id}"
      @selection-change="handleSelectionChange"
      @cell-click="toDetail"
    >
      <el-table-column
        prop="id"
        label="任务ID"
        width="70">
      </el-table-column>
      <el-table-column
        prop="name"
        label="任务名称"

        width="230">
      </el-table-column>
      <el-table-column
        prop="dev_type"
        label="设备类型"
        width="60"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="pkg_version"
        label="升级包版本"
        width="140"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="sys_ver"
        label="系统类型"
        width="60"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ssh_ip"
        label="IP地址"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="pkg_type"
        label="升级包类型"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="update_method"
        label="升级方式"
        show-overflow-tooltip
        width="60"
        :formatter="updateMethod"
      >
      </el-table-column>
      <el-table-column
        prop="time_start_scan"
        label="开始时间"
        show-overflow-tooltip
        width="180"
      >
        <template slot-scope="scope">
          <div>{{startTime(scope.row)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="time_end_scan"
        label="结束时间"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{endTime(scope.row)}}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        prop="status"
        width="180"
      >
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="showPercentage(scope.row.status)"></el-progress>
          <div>{{showStatus(scope.row.status)}}</div>
        </template>

      </el-table-column>

      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            size="small "
            @click.stop="pauseTask(scope.row)"
            v-if="scope.row.status !== 50 && scope.row.status !== 42 && scope.row.status !== 43"
          >
            停止
          </el-button>
          <el-button size="small " type="danger" @click.stop="deleteTask(scope.row)">
            删除
          </el-button>
          <el-button
            size="small "
            type="warning"
            @click.stop="editTask(scope.row)"
            v-if="scope.row.status === 50 || scope.row.status === 42 "
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 70px">
      <el-pagination
        background
        layout="sizes,prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        @current-change="CurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    name: "taskList",
    data() {
      return {
        data: [],
        total: 0,
        pageSize: 10,
        page: 1,
        multipleSelection: [],
        myProgress: {
          10: 20, 20:40,21: 42, 22: 44, 23: 46, 24: 48, 40: 80, 25: 50, 26: 52, 27: 54, 41: 82, 42: 100, 43: 100, 50: 100
        },
        stopButton:false
      }
    },
    methods: {

      editTask(row){
        const {id} = row
        this.$router.push({path: '/auto/publishTask', query: {id}});

      },

      showPercentage(state){
        return this.myProgress[state]
      },

      updateMethod(row) {
        if (row.update_method === 0) {
          return '自动'
        } else {
          return '手动'
        }
      },


      showStatus(status) {
        if (status === 10) {
          return '初始状态中...'
        } else if (status === 20) {
          return '升级前MD5计算中...'
        } else if (status === 21) {
          return '升级前漏洞计算中...'
        } else if (status === 22) {
          return '升级前扫描任务中...'
        } else if (status === 23) {
          return '手动升级中...'
        } else if (status === 24) {
          return '自动升级中...'
        } else if (status === 25) {
          return '升级后MD5计算中...'
        } else if (status === 26) {
          return '升级后漏洞计算中...'
        } else if (status === 27) {
          return '升级后扫描任务中...'
        } else if (status === 40) {
          return '升级完成'
        } else if (status === 41) {
          return '任务结果打包中'
        } else if (status === 42) {
          return '任务异常结束'
        } else if (status === 43) {
          return '任务停止成功'
        } else if (status === 50) {
          return '任务完成'
        }
      },

      handleSizeChange(val) {
        this.pageSize = val
        this.initData(this.page)
      },

      initTime(data) {
        /*2020-09-01T07:30:25Z*/
        if (data) {
          const first = data.replace('T', ' ')
          const last = first.replace('Z', '')
          return last
        }
      },

      startTime(row) {
        const time = row.time_start_scan
        return this.initTime(time)
      },

      endTime(row) {
        const time = row.time_end_scan
        return this.initTime(time)
      },

      pauseTask(row) {
        const {id} = row
        this.$confirm('此操作将停止任务,不可重新开始任务,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/update/stop/', {id}).then(res => {
            const {code, msg} = res.data
            if (code === 0) {
              this.$message({
                message: msg,
                type: 'success'
              });
              this.initData(this.page)
            } else {
              this.$message.error(msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      initData(page) {
        this.$axios({
          method: 'get',
          url: '/update/list/?page=' + page + '&size=' + this.pageSize,
        }).then(res => {
          this.data = res.data.results
          this.total = res.data.count
        })
      },


      CurrentChange(currentPage) {
        this.page = currentPage;
        this.initData(this.page) //点击第几页
      },

      toDetail(row) {
        const {id} = row
        this.$router.push({path: '/auto/taskDetail', query: {id}});
      },

      deleteTask(row) {
        const {id} = row
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`update/list/${id}/`).then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '删除任务成功',
                type: 'success'
              });
              this.initData(this.page)
            } else if (res.status === 404) {
              this.$message.error('删除失败,没有找到对应任务')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    },
    mounted() {
      this.initData(this.page)
      const timer = setInterval(() => {
        // 某些定时器操作
        this.initData(this.page)
      }, 15000);
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer);
      })
    },
  }

</script>

<style scoped>
  .el-pagination {
    position: fixed;
    bottom: 30px;
    left: 41%;
  }
</style>
