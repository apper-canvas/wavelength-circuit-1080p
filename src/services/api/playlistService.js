import playlistsData from "@/services/mockData/playlists.json";
import trackService from "@/services/api/trackService";

// Simulate network delay
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

class PlaylistService {
  constructor() {
    this.playlists = [...playlistsData];
  }

  async getAll() {
    await delay();
    return [...this.playlists];
  }

  async getById(id) {
    await delay();
    const playlist = this.playlists.find(playlist => playlist.Id === parseInt(id));
    if (!playlist) {
      throw new Error(`Playlist with ID ${id} not found`);
    }
    return { ...playlist };
  }

  async getWithTracks(id) {
    await delay();
    const playlist = await this.getById(id);
    const tracks = await trackService.getByIds(playlist.tracks);
    return {
      ...playlist,
      trackDetails: tracks
    };
  }

  async create(playlistData) {
    await delay();
    const maxId = Math.max(...this.playlists.map(p => p.Id), 0);
    const newPlaylist = {
      Id: maxId + 1,
      name: playlistData.name || "New Playlist",
      description: playlistData.description || "",
      coverImage: playlistData.coverImage || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
      tracks: [],
      createdAt: new Date().toISOString(),
      duration: 0
    };
    
    this.playlists.push(newPlaylist);
    return { ...newPlaylist };
  }

  async update(id, playlistData) {
    await delay();
    const playlistIndex = this.playlists.findIndex(playlist => playlist.Id === parseInt(id));
    if (playlistIndex === -1) {
      throw new Error(`Playlist with ID ${id} not found`);
    }

    this.playlists[playlistIndex] = {
      ...this.playlists[playlistIndex],
      ...playlistData
    };

    return { ...this.playlists[playlistIndex] };
  }

  async delete(id) {
    await delay();
    const playlistIndex = this.playlists.findIndex(playlist => playlist.Id === parseInt(id));
    if (playlistIndex === -1) {
      throw new Error(`Playlist with ID ${id} not found`);
    }

    const deletedPlaylist = { ...this.playlists[playlistIndex] };
    this.playlists.splice(playlistIndex, 1);
    return deletedPlaylist;
  }

  async addTrack(playlistId, trackId) {
    await delay();
    const playlist = this.playlists.find(p => p.Id === parseInt(playlistId));
    if (!playlist) {
      throw new Error(`Playlist with ID ${playlistId} not found`);
    }

    if (!playlist.tracks.includes(parseInt(trackId))) {
      playlist.tracks.push(parseInt(trackId));
      
      // Update duration
      const track = await trackService.getById(trackId);
      playlist.duration += track.duration;
    }

    return { ...playlist };
  }

  async removeTrack(playlistId, trackId) {
    await delay();
    const playlist = this.playlists.find(p => p.Id === parseInt(playlistId));
    if (!playlist) {
      throw new Error(`Playlist with ID ${playlistId} not found`);
    }

    const trackIndex = playlist.tracks.indexOf(parseInt(trackId));
    if (trackIndex > -1) {
      playlist.tracks.splice(trackIndex, 1);
      
      // Update duration
      const track = await trackService.getById(trackId);
      playlist.duration -= track.duration;
    }

    return { ...playlist };
  }

  async reorderTracks(playlistId, trackIds) {
    await delay();
    const playlist = this.playlists.find(p => p.Id === parseInt(playlistId));
    if (!playlist) {
      throw new Error(`Playlist with ID ${playlistId} not found`);
    }

    playlist.tracks = trackIds.map(id => parseInt(id));
    return { ...playlist };
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

export default new PlaylistService();