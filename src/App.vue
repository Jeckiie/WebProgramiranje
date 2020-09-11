<template>
<!--<div id="#app">-->
  <v-app>
    <v-navigation-drawer temporary v-model="sideNav" app disable-resize-watcher="">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            WPProject
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item 
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-list-item-icon>
            <v-icon> {{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item v-if="userIsAuthenticated"
         @click="onLogout">
          <v-list-item-icon>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dense app elevate-on-scroll class="primary" dark>
      <v-app-bar-nav-icon @click.stop="sideNav = !sideNav" class="d-flex d-sm-none"></v-app-bar-nav-icon>
      <v-toolbar-title ><router-link to="/" tag="span" style="cursor: pointer;"><v-icon large>home</v-icon></router-link></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="d-none d-sm-flex">
        <v-btn 
        text 
        v-for="item in menuItems" 
        :key="item.title" 
        :to="item.link">
          <v-icon left>{{ item.icon}}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn text v-if="userIsAuthenticated"
        @click="onLogout">
          <v-icon left>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
    <main>
      <router-view></router-view>
    </main>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data (){
    return {
      sideNav: null,
    }
  },
  computed: {
    menuItems () {
      let menuItems = [
        { icon: 'face', title: 'Sign up', link: '/signup'},
        { icon: 'lock_open', title: 'Sign in', link: '/signin'}
      ]
      if(this.userIsAuthenticated) {
        menuItems = [
        { icon: 'mdi-post-outline', title: 'New Post', link: '/post/new'},
        { icon: 'person', title: 'Profile', link: '/profile'},
        ]
      }
      return menuItems
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">

</style>
