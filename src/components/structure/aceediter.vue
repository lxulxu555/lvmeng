<template>
  <div>
    <AceEditor
      :showPrintMargin="true"
      :showGutter="true"
      :highlightActiveLine="true"
      name="editor"
      :value='editData'
      :autoComplete="true"
      theme="chrome"
      mode="sh"
      snippets="sh"
      ext="language_tools"
      :onChange="onChange"
      :wrapEnabled="true"
      wrap="free"
      style="width:1600px; height:700px; font-size:14px;"

      :editorProps="{$blockScrolling: true}"/>

    <span slot="footer" class="dialog-footer">
    <el-button @click="close_ace_editer()">退 出</el-button>
    <el-button @click="save_and_close_ace_editer()">保 存 并 退出</el-button>
    <el-button @click="save_editData()">保 存</el-button>
  </span>

  </div>
</template>


<!-- @setCompletions="setCompletions" -->


<script>
  import Vue from 'vue';
  import brace from 'brace';
  import {Ace as AceEditor, Split as SplitEditor} from 'vue2-brace-editor';

  import 'brace/mode/sh';
  import 'brace/theme/chrome';
  // import 'brace/snippets/sh';//此处根据编辑器语言来选择，两者同步
  // import 'brace/ext/language_tools';

  export default {
    data() {
      return {
        editData: "",
      }
    },
    components: {
      AceEditor,
      //   SplitEditor,
    },
    $el: 'root',
    methods: {
      onChange(newValue) {
        this.editData = newValue.replace("\r\n", "\n")
      },
      get_install_url() {
        var result = this.$route.params.sskey.split("_")
        var url = "/packages/" + result[0] + "/" + result[1] + "/"
        return url
      },
      save_editData() {
        var vm = this
        var install_url = this.get_install_url()

        var data = {
          "content": this.editData
        }

        this.$axios({
          method: "put",
          url: install_url,
          data: data
        }).then(function (response) {
            if (response.status == 200) {
              sessionStorage.setItem(this.$route.params.sskey, JSON.stringify(response.data.content))
              vm.$message({
                showClose: true,
                message: "保存成功",
              });
            }
          }.bind(this)
        )

      },
      close_ace_editer() {
        // this.$router.push({ path: '/packageList' })
        this.$router.back(-1)
      },

      save_and_close_ace_editer() {
        this.save_editData()
        this.close_ace_editer()
      },

      // setCompletions (editor, session, pos, prefix, callback) {
      //   /**
      //  * 设置自动补全回调函数，value变化实时执行。
      //  * @param editor ace editor对象
      //  * @param session
      //  * @param pos 当前字符位置：row、column
      //  * @param prefix 当前编辑字符
      //  * @param callback 执行函数
      //  */
      //   let wordList = ['提示']
      //   callback(null, wordList.map(function (word) {
      //     return {
      //       caption: word,
      //       value: word,
      //       meta: 'local'
      //     }
      //   }
      //   ))
      // },
      get_value() {
        var content = sessionStorage.getItem(this.$route.params.sskey)
        this.editData = JSON.parse(content)
      }

    },
    mounted: function () {
      this.get_value()
    }
  }
</script>
