import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';
import { Channel } from './entities/Channel';
import { Game } from './entities/Game';
import { Stream } from './entities/Stream';

Vue.use(Vuex);

export const store = new Vuex.Store({
  plugins: [VuexWebExtensions()],
  state: {
    twitchApiKeys: ['8rqagai0ujp7ryvsmgde7qaxckiewf'],
    twitchChannels: [
      new Channel(61208450, 'voltik_tv', 'Voltik'),
      ...(process.env.NODE_ENV === 'development' ? [new Channel(27006807, 'thekocal', 'TheKocal')] : [])
    ],
    // settingsSynchronizing: false,
  },
  getters: {
    // settingsSynchronizing: state => state.settingsSynchronizing,
    twitchChannels(state) {
      // Used in background and popup apps, so we need to set prototypes manually
      return state.twitchChannels.map(channel => {
        channel.__proto__ = Channel.prototype;
        if (channel.stream) {
          channel.stream.__proto__ = Stream.prototype;
          if (channel.stream.game) {
            channel.stream.game.__proto__ = Game.prototype;
          }
        }

        return channel;
      });
    },
    twitchChannel(state) {
      return (id) => {
        return state.twitchChannels.find(channel => channel.id === Number(id)) || null;
      }
    },
  },
  mutations: {
    markTwitchChannelAsOnline(state, { channelId, stream }) {
      const twitchChannel = state.twitchChannels.find(channel => channel.id === Number(channelId));

      if (twitchChannel) {
        twitchChannel.markAsOnline(stream);
      }
    },
    markTwitchChannelAsOffline(state, { channelId }) {
      const twitchChannel = state.twitchChannels.find(channel => channel.id === Number(channelId));

      if (twitchChannel) {
        twitchChannel.markAsOffline();
      }
    },
    // settingsSynchronize(state) {
    //   state.settingsSynchronizing = true;
    // },
    // settingsEndSynchronize(state) {
    //   state.settingsSynchronizing = false;
    // },
  },
});
