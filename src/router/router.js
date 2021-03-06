import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)


//无权限路由表
export const constantRouterMap = [
    {
        path: '/login', component: _import('login/index'), hidden: true
    },
    {
        path: '/register', component: _import('register/index'), hidden: true
    },
    {
        path:'/',
        component: Layout,
        redirect: 'home',
        children: [{
            path: 'home',
            name: 'home',
            component: _import('Home'),
            // component: () => import('../views/About.vue'),
            meta: {
                title: '首页',
                icon: 'form'
            }
        }]
    },
    {
        path:'',
        component: Layout,
        children: [{
            path: 'usermanage',
            name: 'usermanange',
            component: _import('userManage/index'),
            // component: () => import('../views/About.vue'),
            meta: {
                title: '用户管理',
                icon: 'peoples'
            }
        }]
    }
]

//权限动态路由表
export const asyncRouterMap = [
    {
        path:'',
        component: Layout,
        meta: {
            roles: ['admin']
        },
        children: [{
            path: 'about',
            name: 'about',
            component: _import('About'),
            // component: () => import('../views/About.vue'),
            meta: {
                title: '关于我们',
                icon: 'people',
                roles: ['admin']
            }
        }]
    },
]

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    /*routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            meta: {
                title: '关于我们'
            },
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/login/index.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/register/index.vue')
        }
    ]*/
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
