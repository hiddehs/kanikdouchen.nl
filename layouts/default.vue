<template>
  <v-app dark>
    <!-- <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      
    </v-app-bar>-->
    <v-content>
      <v-container class="fill-height">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
