import { Game } from './Game';

export class Stream {
  /**
   * @param {Game} game
   * @param {String} title
   * @param {Number} viewers
   * @param {String} thumbnailUrl
   */
  constructor(game, title, viewers, thumbnailUrl) {
    this.game = game;
    this.title = title;
    this.viewers = viewers;
    this.thumbnailUrl = thumbnailUrl;
  }
}
