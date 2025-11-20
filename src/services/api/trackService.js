import tracksData from "@/services/mockData/tracks.json";

// Simulate network delay
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

class TrackService {
  constructor() {
    this.tracks = [...tracksData];
  }

  async getAll() {
    await delay();
    return [...this.tracks];
  }

  async getById(id) {
    await delay();
    const track = this.tracks.find(track => track.Id === parseInt(id));
    if (!track) {
      throw new Error(`Track with ID ${id} not found`);
    }
    return { ...track };
  }

  async getByIds(ids) {
    await delay();
    return this.tracks
      .filter(track => ids.includes(track.Id))
      .map(track => ({ ...track }));
  }

  async search(query) {
    await delay();
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.tracks
      .filter(track => 
        track.title.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm) ||
        track.album.toLowerCase().includes(searchTerm)
      )
      .map(track => ({ ...track }));
  }

  async toggleLike(id) {
    await delay();
    const track = this.tracks.find(track => track.Id === parseInt(id));
    if (track) {
      track.isLiked = !track.isLiked;
      return { ...track };
    }
    throw new Error(`Track with ID ${id} not found`);
  }

  async getLikedTracks() {
    await delay();
    return this.tracks
      .filter(track => track.isLiked)
      .map(track => ({ ...track }));
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}

export default new TrackService();