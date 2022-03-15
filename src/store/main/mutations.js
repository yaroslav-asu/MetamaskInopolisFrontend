export function someMutation(/* state */) {}

export function changeAccount(state, newAccount ){
  return state.savedAccount = newAccount
}
