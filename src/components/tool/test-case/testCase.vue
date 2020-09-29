<template>
  <div>
  <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="上传.mm文件">
      <upload ref="upload" type="tool"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">开始转换</el-button>
    </el-form-item>
  </el-form>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="使用说明" name="1">
        <div style="font-size: 15px">
          <span style="font-weight: bold">xmind用例编写要求：</span><br/>
          <span>TestSuite需要加上相关的图标：  旗帜 （对颜色无要求）</span><br/>
          <span>有步骤的用例需要加上相关的图标： 星星 （对颜色无要求）</span><br/>
          <span>有步骤的用例 各个步骤的描述及期望结果用 & 进行分隔   （例如： ‘点击登录按钮 & 登录成功’）</span><br/>
          <span>用例优先级需要加上相关的图标：1 2 3 --->高 中 低  (标注其他数字图标的 默认是中优先级)</span><br/>


          <span style="font-weight: bold">使用说明</span><br/>
          <span>xmind编写的用例请导出为freemind格式文件(.mm后缀文件)</span><br/>
          <span>将需要转换的freemind文件(例如demo.mm) 上传，点击“开始转换”</span><br/>
          <span>将生成的xml文件导入到Testlink就好了</span><br/>
          <span>mm文件的文件名最好不要出现特殊符号</span><br/>
          <span style="font-weight: bold">具体的编写可以参照下图</span><br/>
          <img src="../../../assets/images/mind.png" style="width: 50%;height: 600px">
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import upload from "../../auto/publish-task/upload";

  export default {
    components: {upload},
    name: "testCase",
    data() {
      return {
        activeNames: ['1']
      }
    },
    methods: {

      submitForm() {
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        const fromdata = new FormData()
        this.$refs.upload.tool(fromdata)
          this.$axios.post('/packages/freemind2testlink/', fromdata, config).then(res => {
            const {file_path} = res.data
            let href = `http://10.65.196.9${file_path}`
            let a = document.createElement('a')
            a.setAttribute('download', '')
            a.setAttribute('href', href)
            a.click()
          })
      }
    }
  }
</script>

<style scoped>

</style>
