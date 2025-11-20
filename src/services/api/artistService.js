import artistsData from "@/services/mockData/artists.json";
import albumService from "@/services/api/albumService";
import trackService from "@/services/api/trackService";

// Simulate network delay
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

class ArtistService {
  constructor() {
    this.artists = [...artistsData];
  }

  async getAll() {
    await delay();
    return [...this.artists];
  }

  async getById(id) {
    await delay();
    const artist = this.artists.find(artist => artist.Id === parseInt(id));
    if (!artist) {
      throw new Error(`Artist with ID ${id} not found`);
    }
    return { ...artist };
  }

  async getWithDetails(id) {
    await delay();
    const artist = await this.getById(id);
    
    // Get full album details
    const albums = await Promise.all(
      artist.albums.map(albumId => albumService.getById(albumId))
    );
    
    // Get top tracks details
    const topTracks = await trackService.getByIds(artist.topTracks);
    
    return {
      ...artist,
      albumDetails: albums,
      topTrackDetails: topTracks
    };
  }

  async search(query) {
    await delay();
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.artists
      .filter(artist => 
        artist.name.toLowerCase().includes(searchTerm)
      )
      .map(artist => ({ ...artist }));
  }

  async getFeatured() {
    await delay();
    // Return a random selection of artists as featured
    const shuffled = [...this.artists].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6).map(artist => ({ ...artist }));
  }

  async getPopular() {
    await delay();
    // Return all artists (in a real app, this would be based on play counts)
    return [...this.artists];
  }

  async getDiscography(artistId) {
    await delay();
    const artist = await this.getById(artistId);
    return await Promise.all(
      artist.albums.map(albumId => albumService.getWithTracks(albumId))
    );
  }

  async getTopTracks(artistId) {
    await delay();
    const artist = await this.getById(artistId);
    return await trackService.getByIds(artist.topTracks);
  }
}

export default new ArtistService();