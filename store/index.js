import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      sheetid: process.env.sheetid
    })
  })
}

export default createStore