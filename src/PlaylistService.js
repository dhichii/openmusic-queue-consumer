const {Pool} = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(id) {
    const playlistQuery = {
      text: 'SELECT id, name FROM playlists WHERE id=$1',
      values: [id],
    };
    const playlistSongsQuery = {
      text: `
        SELECT songs.id, songs.title, songs.performer FROM playlist_songs
        JOIN songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id=$1
      `,
      values: [id],
    };

    const result = await this._pool.query(playlistQuery);
    const songs = await this._pool.query(playlistSongsQuery);
    const playlist = result.rows[0];
    playlist.songs = songs.rows;

    return {playlist};
  }
}

module.exports = PlaylistService;
