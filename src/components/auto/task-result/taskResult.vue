<template>
  <div>
    <el-button type="primary" style="float: right;margin-right: 25px" @click="addResult">添加基准</el-button>
    <el-table
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
      >
      </el-table-column>
      <el-table-column
        prop="task_type"
        label="任务类型"
        :formatter="showTaskType"
      >
      </el-table-column>
      <el-table-column
        prop="dev_type"
        label="设备类型"
        :formatter="showDevType"
      >
      </el-table-column>
      <el-table-column
        prop="target"
        label="IP地址"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="400"
      >
        <template slot-scope="scope">
          <el-button type="success" size="medium" @click="down(scope.row)">
            下载
          </el-button>
          <el-button size="medium" @click="showDetail(scope.row.id)">
            更新
          </el-button>
          <el-button type="danger" size="medium" @click="deleteResult(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <publish-result ref="publish" @initData="initData"/>
    <div style="margin-top: 70px">
      <el-pagination
        background
        layout="sizes,prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        @current-change="currentChange"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import publishResult from "./publishResult";

  export default {
    name: 'task-result',
    components: {publishResult},
    data() {
      return {
        page: 1,
        total: 0,
        pageSize: 10,
        data: []
      }
    },
    methods: {
      initData(page) {
        this.$axios.get(`/update/benchmark_list/?page=${page}&size=${this.pageSize}`).then(res => {
          this.data = res.data.results
          this.total = res.data.count
        })
      },

      showTaskType(row) {
        if (row.task_type === 0) {
          return '系統扫描'
        } else if (row.task_type === 1) {
          return '口令猜测'
        } else if (row.task_type === 2) {
          return 'WEB扫描'
        }
      },

      showDevType(row){
        if (row.dev_type === '1') {
          return 'RSAS'
        } else if (row.dev_type === '2') {
          return 'WVSS'
        } else if (row.dev_type === '3') {
          return 'WSM-H F01'
        }
      },

      handleSizeChange(val) {
        this.pageSize = val
        this.initData(this.page)
      },

      currentChange(page) {
        this.page = page
        this.initData(this.page)
      },

      down(row) {
        const {id} = row
        this.$axios.get(`/update/download_benchmark/${id}/`).then(res => {
          const {code, msg} = res.data
          if (code === -1) {
            this.$message.error(msg)
          } else {
            window.open(`/update/download_benchmark/${id}/`)
          }
        })
      },

      deleteResult(id) {
        this.$confirm('此操作将删除任务,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/update/benchmark_list/${id}/`).then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.initData(this.page)
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      showDetail(id) {
        this.$axios.get(`/update/benchmark_list/${id}/`).then(res => {
          this.$refs.publish.getDetailData(res.data)
        })
      },

      addResult() {
        this.$refs.publish.addDialog()
      }
    },

    mounted() {
      this.initData(this.page)
    }
  }
</script>
<style scoped>
  .el-pagination {
    position: fixed;
    bottom: 30px;
    left: 41%;
  }
</style>
