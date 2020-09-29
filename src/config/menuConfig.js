const menuList = [
  {
    title : '任务列表',
    key :'/auto/taskList',
    icon : 'el-icon-search',

  },
  {
    title : '新建任务',
    key : '/auto/publishTask',
    icon : 'el-icon-plus',
  },
  {
    title : '任务结果基准',
    key : '/auto/taskResult',
    icon : 'el-icon-document-checked',
  },
  {
    title:'系统配置',
    key:'/system-config',
    icon:'el-icon-setting',
    children:[
     {
       title : '邮箱服务器设置',
       key : '/auto/emailSetting',
       icon : 'el-icon-message',
     },
   ]
  }
]

export default menuList
