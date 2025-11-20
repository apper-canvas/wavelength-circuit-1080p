import albumsData from "@/services/mockData/albums.json";
import trackService from "@/services/api/trackService";

// Simulate network delay
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

class AlbumService {
  constructor() {
    this.albums = [...albumsData];
  }

  async getAll() {
    await delay();
    return [...this.albums];
  }

  async getById(id) {
    await delay();
    const album = this.albums.find(album => album.Id === parseInt(id));
    if (!album) {
      throw new Error(`Album with ID ${id} not found`);
    }
    return { ...album };
  }

  async getWithTracks(id) {
    await delay();
    const album = await this.getById(id);
    const tracks = await trackService.getByIds(album.tracks);
    return {
      ...album,
      trackDetails: tracks
    };
  }

  async getByArtist(artistName) {
    await delay();
    return this.albums
      .filter(album => album.artist.toLowerCase().includes(artistName.toLowerCase()))
      .map(album => ({ ...album }));
  }

  async search(query) {
    await delay();
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.albums
      .filter(album => 
        album.title.toLowerCase().includes(searchTerm) ||
        album.artist.toLowerCase().includes(searchTerm)
      )
      .map(album => ({ ...album }));
  }

  async getFeatured() {
    await delay();
    // Return a random selection of albums as featured
    const shuffled = [...this.albums].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6).map(album => ({ ...album }));
  }

  async getRecent() {
    await delay();
    // Sort by release year (newest first) and return recent albums
    return [...this.albums]
      .sort((a, b) => b.releaseYear - a.releaseYear)
      .slice(0, 8)
      .map(album => ({ ...album }));
  }

  getDuration(album) {
    // Calculate total duration if tracks are available
    if (album.trackDetails) {
      return album.trackDetails.reduce((total, track) => total + track.duration, 0);
    }
    return 0;
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

export default new AlbumService();