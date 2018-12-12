export const state = () => ({
  list: []
})

export const mutations = {
  add(state, about) {
    state.list.push(about)
  },
  emptyList(state) {
    state.list = []
  }
}

export const getters = {
  list: state => {
    return state.list
  }
}
