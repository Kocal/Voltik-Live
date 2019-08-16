import { Stream } from './Stream';

export class Channel {
  /**
   * @param {Number} id
   * @param {String} username
   * @param {String} nickname
   */
  constructor(id, username, nickname) {
    this.id = id
    this.username = username
    this.nickname = nickname
    this.online = null;
    this.stream = null;
}

  get url() {
    return `https://twitch.tv/${this.username}`;
  }

  /**
   * @param {Stream} stream
   */
  markAsOnline(stream) {
    if (process.env.NODE_ENV === 'development') {
      console.log('markAsOnline()', this);
    }

    this.online = true;
    this.stream = stream;
  }

  markAsOffline() {
    if (process.env.NODE_ENV === 'development') {
      console.log('markAsOffline()', this);
    }

    this.online = false;
    this.stream = null;
  }

  isOnline() {
    return this.online === true;
  }
}
