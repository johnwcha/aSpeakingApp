<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in this.$store.state.items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />

      <v-btn dark color="primary lighten-1" @click="logout" v-if="this.$store.state.items.length>1">
        <v-icon>mdi-logout</v-icon>
        SIGN OUT
      </v-btn>

    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }} </span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Speak the Language'
    }
  },
  computed: {
    items () {
      return this.$store.state.items
    }
  },
  methods: {
    logout() {
      this.$fireAuth.signOut().then( () => {
        console.log('sign-out successful')
        this.$router.push('/')
        this.$store.commit('resetItems')
      }).catch(function(error) {
        // An error happened.
        console.log(error)
      })
    }
  },
  mounted () {
    //this.logout()
    //console.log(this.$store.state.items)
    //console.log(this.$store.state.role)
    let user = this.$fireAuth.currentUser
    if (!user) {
      this.$store.commit('resetItems')
    } else {
      if (this.$store.state.role) {
        if (this.$store.state.role === 'teacher') {
          this.$store.commit('setUserRole', 'teacher')
        } else {
          this.$store.commit('setUserRole', 'student')
        }
      }
    }
  }
}
</script>
