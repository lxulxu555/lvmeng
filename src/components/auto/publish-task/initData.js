import fa from "element-ui/src/locale/lang/fa";

export let time = (rule, value, callback) => {
  var numReg = /^[1-9][0-9]*$/
  if (value === '') {
    callback(new Error('请输入时间'))
  } else if (!numReg.test(value)) {
    callback(new Error('只能输入整数'))
  } else if (value < 3) {
    callback(new Error('最小时间为3分钟'))
  } else if (value > 1440) {
    callback(new Error('最大时间为24小时'))
  } else {
    callback()
  }
}
export let port = (rule, value, callback) => {
  var numReg = /^[1-9][0-9]*$/
  if (value === '') {
    callback(new Error('请输入端口号'))
  } else if (!numReg.test(value)) {
    callback(new Error('只能输入整数'))
  } else {
    callback()
  }
}
export let ip = (rule, value, callback) => {
  var ipReg = /^(\d{1,3}|\*)(\.(\d{1,3}|\*)){3}(,(\d{1,3}|\*)(\.(\d{1,3}|\*)){3})*$/
  if (value === '') {
    callback(new Error('请输入IP地址'))
  } else if (!ipReg.test(value)) {
    callback(new Error('请输入正确的IP地址'))
  } else {
    callback()
  }
}
/*
export let web = (rule, value, callback) => {
  var web = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)/;
  if (value === '') {
    callback(new Error('请输入WEB地址'))
  } else if (!web.test(value)) {
    callback(new Error('请输入正确的WEB地址'))
  } else {
    callback()
  }
}
*/

export const sysVerOptions =  [{
  label: 32,
  value: '32位'
}, {
  label: 64,
  value: '64位'
}]
export const devTypeOptions = [{
  label: 'RSAS'
}, {
  label: 'BVS'
}, {
  label: 'WVSS'
}, {
  label: 'WSM-H F01'
}, {
  label: 'WSMS'
}]
export const updateBefore =  ['MD5计算', '创建任务', '结果对比', '核心功能']
export const updateAfter = ['MD5计算', '创建任务']
export const TaskType = ['系统扫描', 'WEB扫描', '口令猜测', '代码审计']
export const tip =  '如需写多个，请用小写逗号分开'
