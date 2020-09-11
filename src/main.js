import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import * as firebase from 'firebase'
import AlertCmp from './components/Shared/Alert.vue'
import './assets/css/main.css'

Vue.config.productionTip = false
Vue.component('app-alert', AlertCmp)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyCbxi8DEzxOWPBrUXPj16klEKZl8e4cutQ',
      authDomain: 'devmeetup-85260.firebaseapp.com',
      databaseURL: 'https://devmeetup-85260.firebaseio.com',
      projectId: 'devmeetup-85260',
      storageBucket: 'gs://devmeetup-85260.appspot.com',
      messagingSenderId: '105400877774',
      appId: '1:105400877774:web:c178a97fa5d8f32a0f469f',
      measurementId: 'G-JFYJGPCGND'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        
        this.$store.dispatch('autoSignIn', user)
      }
    })
    this.$store.dispatch('loadPosts')
  }
}).$mount('#app')
