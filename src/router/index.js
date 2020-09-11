import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
//import Meetups from '@/components/Meetup/Meetups'
import CreatePost from '@/components/Post/CreatePost'
import Profile from '@/components/User/Profile'
import Signin from '@/components/User/Signin'
import Signup from '@/components/User/Signup'
//import Meetup from '@/components/Meetup/Meetup'
import AuthGuard from './auth-gard'
 
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
 /* {
    path: '/meetups',
    name: 'Meetups',
    component: Meetups
  },*/
  {
    path: '/post/new',
    name: 'CreatePost',
    component: CreatePost,
    beforeEnter: AuthGuard
  },
 /* {
    path: '/meetups/:id',
    props: true,
    component: Meetup
  },*/
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: AuthGuard
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
