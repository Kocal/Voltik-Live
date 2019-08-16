import { markAsOffline, markAsOnline, setBrowserActionTitle } from '@kocal/web-extension-library';
import { Channel } from './entities/Channel';

/**
 * @param {Channel[]} channels
 */
export const updateBrowserAction = (channels) => {
  if (channels.some(channel => channel.isOnline())) {
    const onlineChannel = channels.find(channel => channel.isOnline());

    markAsOnline();
    setBrowserActionTitle(`${onlineChannel.nickname} joue à ${onlineChannel.stream.game.name} devant ${onlineChannel.stream.viewers} viewers\n${onlineChannel.stream.title}`);
  } else {
    markAsOffline();
    setBrowserActionTitle(require('./manifest.json').browser_action.default_title);
  }
};
