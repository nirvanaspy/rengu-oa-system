<template>
    <div class="login-container">
        <linecanvas></linecanvas>
        <div class="content">
            <div class="logo">
                <span class="svg-container">
                    <svg-icon icon-class="logo1"/>
                </span>
            </div>
            <div class="title-container">
                <h3 class="title">注册一个新账号</h3>
            </div>
            <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                     label-position="left">
                <div class="ipContainer">
                    <el-form-item prop="ipConfig" class="ipform">
                        <span class="svg-container svg-container_ip">
                            <svg-icon icon-class="IP"/>
                        </span>
                        <el-input name="ipConfig" type="text" v-model="loginForm.ipConfig" autoComplete="on"
                                  placeholder="IP地址"/>
                    </el-form-item>
                    <el-form-item prop="port" class="portform">
                        <span class="svg-container">
                            <svg-icon icon-class="port"/>
                        </span>
                        <el-input name="port" type="text" v-model="loginForm.port" autoComplete="on" placeholder="端口号"/>
                    </el-form-item>
                </div>
                <div class="personalMes">
                    <el-form-item prop="mailConfig" class="ipform">
                        <span class="svg-container svg-container_ip">
                            <svg-icon icon-class="email"/>
                        </span>
                        <el-input name="mailConfig" type="text" v-model="loginForm.mailConfig" autoComplete="on"
                                  placeholder="邮箱"/>
                    </el-form-item>
                    <el-form-item prop="port" class="portform">
                        <span class="svg-container">
                            <svg-icon icon-class="phone"/>
                        </span>
                        <el-input name="tel" type="text" v-model="loginForm.tel" autoComplete="on" placeholder="手机号"/>
                    </el-form-item>
                </div>
                <el-form-item prop="username">
                    <span class="svg-container svg-container_login">
                      <svg-icon icon-class="user"/>
                    </span>
                    <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on"
                              placeholder="请输入用户名"/>
                </el-form-item>

                <el-form-item prop="password">
                    <span class="svg-container">
                      <svg-icon icon-class="password"/>
                    </span>
                    <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin"
                              v-model="loginForm.password" autoComplete="on" placeholder="请输入密码"/>
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon icon-class="eye"/>
                    </span>
                </el-form-item>
                <el-form-item prop="againPassword">
                    <span class="svg-container">
                      <svg-icon icon-class="password"/>
                    </span>
                    <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin"
                              v-model="loginForm.againPassword" autoComplete="on" placeholder="再次输入密码"/>
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon icon-class="eye"/>
                    </span>
                </el-form-item>

                <el-button type="primary" style="width:100%;margin-bottom:20px;" :loading="loading"
                           @click.native.prevent="registerUser">注册
                </el-button>
                <div class="register-container">
                    <span class="register-tips">已有账号？</span>
                    <span class="register-btn" @click="jumpToLogin">登录</span>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {isvalidUsername} from '@/utils/validate'
    import {addUser} from '@/api/register'
    import service from '@/utils/request'
    import linecanvas from '../../components/Canvas_line/index.vue'

    /*eslint-disable*/
    export default {
        name: 'login',
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!isvalidUsername(value)) {
                    callback(new Error('请输入正确的用户名！'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('请输入正确的密码,至少6位！'))
                } else {
                    callback()
                }
            }
            const validatePasswordAgain = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('请输入正确的密码,至少6位！'))
                } else if (this.loginForm.againPassword !== this.loginForm.password) {
                    callback(new Error('两次密码输入不一致，请再次输入新密码！'))
                } else {
                    callback()
                }
            }
            return {
                loginForm: {
                    ipConfig: '192.168.31.134',
                    port: '8080',
                    mailConfig: '',
                    tel: '',
                    username: '',
                    password: '',
                    againPassword: ''
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePassword}],
                    againPassword: [{required: true, trigger: 'blur', validator: validatePasswordAgain}]
                },
                passwordType: 'password',
                loading: false,
                showDialog: false
            }
        },
        components: {
            linecanvas
        },
        methods: {
            jumpToLogin() {
                this.$router.replace('/login')
            },
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
            },
            handleLogin() {
            },
            registerUser: function () {
                service.defaults.baseURL = 'http://' + this.loginForm.ipConfig + ':' + this.loginForm.port
                this.$refs['loginForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        let qs = require('qs');
                        let data = {
                            'username': this.loginForm.username,
                            'password': this.loginForm.password,
                            'email': this.loginForm.mailConfig,
                            'telephoneNum': this.loginForm.tel
                        }
                        let datapost = qs.stringify(data)
                        addUser(datapost).then(() => {
                            this.$cookies.set('username', this.loginForm.username)
                            this.$notify({
                                title: '成功',
                                message: '注册成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.loading = false
                            // this.$router.replace('/login')
                            let formData = qs.stringify({
                                "username": this.loginForm.username,
                                'password': this.loginForm.password,
                                'email': this.loginForm.mailConfig,
                                'telephoneNum': this.loginForm.tel,
                                'grant_type': 'password',
                                'scope': 'SCOPES',
                                'client_id': 'OAUTH_CLIENT_ID',
                                'enctype': 'OAUTH_CLIENT_ID'
                            })
                            // this.jumpLoading = true
                            this.$store.dispatch('LoginByUsername', formData).then(() => {
                                // this.jumpLoading = false
                                this.loading = false
                                /*getUserId().then((res) => {
                                  this.setCookie('userId', res.data.data.id)
                                })*/
                                this.$router.push({path: '/'})
                            }).catch(() => {
                                this.loading = false
                                // this.jumpLoading = false
                                this.$notify({
                                    title: '失败',
                                    message: '登录失败',
                                    type: 'error',
                                    duration: 1000
                                })
                            })
                        }).catch((error) => {
                            this.loading = false
                            this.errorMessage = '注册失败，请检查信息填写是否正确！'
                            if (error.response.data.message) {
                                this.errorMessage = error.response.data.message
                            }
                            this.$notify({
                                title: '失败',
                                message: this.errorMessage,
                                type: 'error',
                                duration: 2000
                            })
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .login-container {
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: #f9f9f9;
    }

    .login-container .content {
        margin: 40px auto;
    }

    .logo {
        text-align: center;
        font-size: 60px;
        margin-bottom: 30px;
        cursor: pointer;
    }

    .login-container .el-form-item {
        margin-bottom: 24px;
    }

    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 24%;
        padding: 35px 20px 15px 20px;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .title-container {
        position: relative;
    }

    .title {
        font-size: 18px;
        /*font-weight: 400;*/
        color: #000;
        margin: 0px auto 10px auto;
        text-align: center;
        /*font-weight: bold;*/
    }

    .ipform, .portform, .userform, .passwordform {
        position: relative;
    }

    .login-form span.svg-container {
        position: absolute;
        z-index: 99;
        top: 0;
        left: 6px;
    }

    .login-form .el-input__inner {
        padding-left: 30px;
        padding-right: 30px;
    }

    .show-pwd {
        position: absolute;
        z-index: 99;
        top: 0;
        right: 8px;
    }

    .register-container {
        text-align: center;
        font-size: 14px;
    }

    .register-container .register-btn {
        color: #409EFF;
        cursor: pointer;
    }
</style>
