import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import createPackage from '@/components/structure/createPackage'
import packageList from '@/components/structure/packageList'
import login from '@/components/login'
import aceediter from '@/components/structure/aceediter'
import structure from '@/components/structure/layout/layout'
import tagmanage from '@/components/structure/tagmanage'
import encryption from '@/components/tool/encryption/encryption'
import layout from '@/components/auto/layout/layout'
import publishTask from '@/components/auto/publish-task/publishTask'
import taskList from '@/components/auto/task-list/taskList'
import emailSetting from '@/components/auto/system-setting/emailSetting'
import taskDetail from '@/components/auto/task-list/taskDetail'
import taskResult from '@/components/auto/task-result/taskResult'
import testCase from '@/components/tool/test-case/testCase'
import toolLayout from '@/components/tool/layout/layout'


import axios from 'axios'

import {Message} from 'element-ui'

import {Loading} from 'element-ui'


// import qs from 'qs'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: [
        {
          path: '/structure',
          name: 'structure',
          redirect: '/structure/createPackage',
          component: structure,
          meta: {
            activeMenu: '/structure'
          },
          children: [
            {
              path: '/structure/createPackage',
              name: 'createPackage',
              component: createPackage,
              meta: {
                activeMenu: '/structure', // 顶部导航 高亮
                ChildrenActiveMenu: '/structure/createPackage' // 子导航高亮
              },
            },
            {
              path: '/structure/packageList/:config_id',
              name: 'packageList',
              component: packageList,
              meta: {
                activeMenu: '/structure', // 顶部导航 高亮
                ChildrenActiveMenu: '/structure/packageList/:config_id' // 子导航高亮
              },
            },
            {
              path: '/structure/tagmanage',
              name: 'tagmanage',
              component: tagmanage,
              meta: {
                activeMenu: '/structure', // 顶部导航 高亮
                ChildrenActiveMenu: '/structure/tagmanage' // 子导航高亮
              },
            }]
        },

        {
          path: '/auto',
          name: 'auto',
          component: layout,
          redirect: '/auto/taskList',
          meta: {
            activeMenu: '/auto'
          },
          children: [
            {
              path: '/auto/publishTask',
              name: 'auto-publishTask',
              component: publishTask,
              meta: {
                activeMenu: '/auto', // 顶部导航 高亮
                ChildrenActiveMenu: '/auto/publishTask' // 子导航高亮
              }
            },
            {
              path: '/auto/taskList',
              name: 'auto-taskList',
              component: taskList,
              meta: {
                activeMenu: '/auto', // 顶部导航 高亮
                ChildrenActiveMenu: '/auto/taskList', // 子导航高亮
              },
            },
            {
              path: '/auto/emailSetting',
              name: 'auto-emailSetting',
              component: emailSetting,
              meta: {
                activeMenu: '/auto', // 顶部导航 高亮
                ChildrenActiveMenu: '/auto/emailSetting' // 子导航高亮
              }
            },
            {
              path: '/auto/taskDetail',
              name: 'auto-taskDetail',
              component: taskDetail,
              meta: {
                activeMenu: '/auto', // 顶部导航 高亮
                ChildrenActiveMenu: '/auto/taskList' // 子导航高亮
              }
            },
            {
              path: '/auto/taskResult',
              name: 'auto-taskResult',
              component: taskResult,
              meta: {
                activeMenu: '/auto', // 顶部导航 高亮
                ChildrenActiveMenu: '/auto/taskResult' // 子导航高亮
              }
            },
          ]
        },
        {
          path: '/tool',
          name: 'tool',
          component: toolLayout,
          redirect: '/tool/testCase',
          meta: {
            activeMenu: '/tool'
          },
          children: [
            {
              path: '/tool/testCase',
              name: 'tool-testCase',
              component: testCase,
              meta: {
                activeMenu: '/tool', // 顶部导航 高亮
                ChildrenActiveMenu: '/tool/testCase' // 子导航高亮
              }
            },
            {
              path: '/tool/encryption',
              name: 'tool-encryption',
              component: encryption,
              meta: {
                activeMenu: '/tool', // 顶部导航 高亮
                ChildrenActiveMenu: '/tool/encryption' // 子导航高亮
              }
            },
          ]
        },
      ]
    },
    {
      path: '/aceediter/:sskey',
      name: 'aceediter',
      component: aceediter
    },
  ]
})

// axios.defaults.timeout = 15000;
// Vue.prototype.$ajax = axios;
// Vue.prototype.$qs = qs;
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

let loading;
//内存中正在请求的数量
let loadingNum = 0;

function startLoading() {
  if (loadingNum == 0) {
    loading = Loading.service({
      lock: true,
      text: '请稍候...',
      background: 'rgba(255,255,255,0.5)',
    })
  }
  //请求数量加1
  loadingNum++;
}

function endLoading() {
  //请求数量减1
  loadingNum--
  if (loadingNum <= 0) {
    loading.close()
  }
}


axios.interceptors.request.use((config) => {
  var cookie = getCookie("csrftoken")
  if (cookie) {
    config.headers['X-CSRFToken'] = cookie
  }
  startLoading();
  return config
});


axios.interceptors.response.use(function (response) {
  // Do something with response data
  endLoading();
  return response;
}, function (error) {
  console.log(error);
  endLoading();

  if (error) {
    if (error.response.status == 403) {
      router.push({path: '/'})
    }
    if (error.response.status == 400) {
      // router.push({ path: '/' })
      Message.error(JSON.stringify(error.response.data))
    }

  }
  return Promise.reject(error);
});


export default router;
