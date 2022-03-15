import state from "./state";
import * as getters from "./getters";
import * as mutations from "../module-example/mutations";
import * as actions from "../module-example/actions";

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
