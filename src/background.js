import { createNotification, createTab, getTwitchLiveStreams, onNotificationClick, registerTwitchApiKeys } from '@kocal/web-extension-library';
import { store } from './store';
import { updateBrowserAction } from './browser-action';
import { Game, Stream } from './entities';

global.browser = require('webextension-polyfill');

// Only for debugging purpose
if (process.env.NODE_ENV === 'development') {
  global.store = store;
}

const app = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('app()');
  }

  // await registerSettings(settings);

  registerTwitchApiKeys(store.state.twitchApiKeys);
  onNotificationClick(async channelId => {
    const channel = store.getters.twitchChannel(channelId);

    if (channel) {
      await createTab({
        url: channel.url,
      });
    }
  });

  onTick();
  setInterval(onTick, (process.env.NODE_ENV === 'development' ? 10 : 60) * 1000);

  async function onTick() {
    if (process.env.NODE_ENV === 'development') {
      console.log('onTick()');
    }

    // await loadSettings();
    const { onlineStreams, offlineStreams } = await getTwitchLiveStreams(store.state.twitchChannels.map(channel => channel.id));

    onlineStreams.forEach(stream => {
      const channel = store.getters.twitchChannel(stream.user_id);

      if (channel) {
        const wasOnline = channel.isOnline();

        store.commit('markTwitchChannelAsOnline', {
          channelId: channel.id,
          stream: new Stream(
            new Game(stream.game.name, stream.game.box_art_url),
            stream.title,
            stream.viewer_count,
            stream.thumbnail_url,
          ),
        });

        if (!wasOnline) {
          createNotification(String(channel.id), {
            type: 'basic',
            title: `${channel.nickname} est en live sur ${channel.stream.game.name} !`,
            message: channel.stream.title,
            iconUrl: 'icons/icon_128.png',
          });
        }
      }
    });

    offlineStreams.forEach(userId => {
      store.commit('markTwitchChannelAsOffline', {
        channelId: userId,
      });
    });

    updateBrowserAction(store.state.twitchChannels);
  }
};

app();
