<template>
  <v-layout column justify-center align-center class="text-center" :class="antwoord_class">
    <h1 class="display-1">Kan ik douchen?</h1>

    <h1 class="display-4 font-weight-bold">{{ antwoord }}</h1>
    <h4>Laatste activiteit: {{ LastChange }}</h4>
    <v-btn icon><v-icon v-if="!showinfo" @click="showinfo = true">mdi-information</v-icon></v-btn>
    <h4 v-if="showinfo">12 hr project by <a target="_blank" href="https://oliviersfunctionals.com">oliviersfunctionals</a> & <a target="_blank" href="https://hidde.dev">hidde.dev</a></h4>
    <v-btn v-if="showinfo" class="mt-3" href="https://github.com/hiddehs/kanikdouchen.nl" target="_blank"><v-icon left>mdi-github-circle</v-icon> Open Source</v-btn>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      CanDouche: true,
      LastChange: null,
      showinfo: false
    }
  },
  computed: {
    antwoord_class() {
      return this.CanDouche ? 'success' : 'red'
    },
    antwoord() {
      return this.CanDouche ? 'JA!' : 'NEE!'
    }
  },
  watch: {
    CanDouche() {
      this.setDocTitle();
    }
  },
  created() {
    let interval = 2000
    this.loadSheet()
    setInterval(() => {
      this.loadSheet()
      interval += 500
    }, interval)
  },
  methods: {
    loadSheet() {
      this.$axios
        .get(
          'https://spreadsheets.google.com/feeds/list/' + this.$store.state.sheetid + '/3/public/values?alt=json'
        )
        .then((resp) => {
          const spreadsheet = resp.data
          this.CanDouche = !Boolean(spreadsheet.feed.entry[0].gsx$state.$t * 1)
          this.LastChange = spreadsheet.feed.entry[0].gsx$lastchange.$t
          this.setDocTitle();
        })
    },
    setDocTitle(){
      document.title = (this.CanDouche ? '💦 je kan douchen!' : '🚨 douche = bezet');
    }
  }
}
</script>
