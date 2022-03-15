<template>
  <q-layout class="full-width full-height flex column justify-center items-center">
    <q-btn class="authentication__authenticate" @click="click()" v-if="isShowed">Enter</q-btn>
    <p class="account__address" v-else>{{ account }}</p>
    <p class="authentication__warning" v-if="!accountsEqual && isShowed">Your MetaMask account is different from the one you authenticated with
      before.</p>
  </q-layout>
</template>

<script>

import Web3 from 'web3/dist/web3.min.js'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: "MainLayout",
  data() {
    return {
      isShowed: true,
      accountsEqual: true,
    }
  },
  async mounted() {
    if (this.savedAccount) {
      let accounts = await ethereum.request({method: 'eth_requestAccounts'});
      let account = accounts[0];
      if (account !== this.savedAccount) {
        this.accountsEqual = false
      }
    }
  },
  methods: {
    ...mapMutations('main', ['changeAccount']),
    isEqualAccount() {

    },
    async click() {
      if (typeof window.ethereum !== 'undefined') {
        await this.connect()
        await this.sign()
        // this.isShowed = false
      }
    },
    async connect() {
      let accounts = await ethereum.request({method: 'eth_requestAccounts'});
      this.account = accounts[0];
      this.changeAccount(this.account)
    },
    async sign() {
      const web3 = new Web3
      const msgParams = JSON.stringify({
        domain: {
          // Defining the chain aka Rinkeby testnet or Ethereum Main Net
          chainId: 1,
          // Give a user friendly name to the specific contract you are signing for.
          name: 'Ether Mail',
          // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          // Just let's you know the latest version. Definitely make sure the field name is correct.
          version: '1',
        },

        // Defining the message signing data content.
        message: {
          /*
           - Anything you want. Just a JSON Blob that encodes the data you want to send
           - No required fields
           - This is DApp Specific
           - Be as explicit as possible when building out the message schema.
          */
          contents: 'Hello, Bob!',
          attachedMoneyInEth: 4.2,
          from: {
            name: 'Cow',
            wallets: [
              '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
              '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
            ],
          },
          to: [
            {
              name: 'Bob',
              wallets: [
                '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                '0xB0B0b0b0b0b0B000000000000000000000000000',
              ],
            },
          ],
        },
        // Refers to the keys of the *types* object below.
        primaryType: 'Mail',
        types: {
          // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
          EIP712Domain: [
            {name: 'name', type: 'string'},
            {name: 'version', type: 'string'},
            {name: 'chainId', type: 'uint256'},
            {name: 'verifyingContract', type: 'address'},
          ],
          // Not an EIP712Domain definition
          Group: [
            {name: 'name', type: 'string'},
            {name: 'members', type: 'Person[]'},
          ],
          // Refer to PrimaryType
          Mail: [
            {name: 'from', type: 'Person'},
            {name: 'to', type: 'Person[]'},
            {name: 'contents', type: 'string'},
          ],
          // Not an EIP712Domain definition
          Person: [
            {name: 'name', type: 'string'},
            {name: 'wallets', type: 'address[]'},
          ],
        },
      });

      var from = this.account

      var params = [from, msgParams];
      var method = 'eth_signTypedData_v4';

      await window.ethereum.sendAsync(
        {
          method,
          params,
          from,
        },
        this.callback
      );
    },
    callback(err, result) {

      if (err) return console.dir(err);
      if (result.error) {
        alert(result.error.message);
      }
      if (result.error) return console.error('ERROR', result);
      console.log('TYPED SIGNED:' + JSON.stringify(result.result));
      this.isShowed = false
    }

  },
  computed: {
    ...mapGetters('main', ['savedAccount'])
  }
}
</script>
