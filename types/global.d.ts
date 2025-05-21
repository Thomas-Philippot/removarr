export interface AlternateTitle {
  title: string;
  sceneSeasonNumber?: number;
  sourceType?: string;
  movieMetadataId?: number;
  id?: number;
}

export interface Image {
  coverType: string;
  url: string;
  remoteUrl: string;
}

export interface OriginalLanguage {
  id: number;
  name: string;
}

export interface Statistics {
  sizeOnDisk: number;
  releaseGroups: string[];
  seasonCount?: number;
  episodeFileCount?: number;
  episodeCount?: number;
  totalEpisodeCount?: number;
  percentOfEpisodes?: number;
  movieFileCount?: number;
}

export interface MediaStatistics {
  seasonNumber: number;
  monitored: boolean;
  statistics: {
    episodeFileCount: number;
    episodeCount: number;
    totalEpisodeCount: number;
    sizeOnDisk: number;
    releaseGroups: string[];
    percentOfEpisodes: number;
  };
}

export interface Season {
  seasonNumber: number;
  monitored: boolean;
  statistics: MediaStatistics;
}

export interface Ratings {
  votes?: number;
  value?: number;
  imdb?: {
    votes: number;
    value: number;
    type: string;
  };
  tmdb?: {
    votes: number;
    value: number;
    type: string;
  };
  metacritic?: {
    votes: number;
    value: number;
    type: string;
  };
  rottenTomatoes?: {
    votes: number;
    value: number;
    type: string;
  };
}

export interface Language {
  id: number;
  name: string;
}

export interface Quality {
  quality: {
    id: number;
    name: string;
    source: string;
    resolution: number;
    modifier: string;
  };
  revision: {
    version: number;
    real: number;
    isRepack: boolean;
  };
}

export interface MediaInfo {
  audioBitrate: number;
  audioChannels: string;
  audioCodec: string;
  audioLanguages: string;
  audioStreamCount: number;
  videoBitDepth: number;
  videoBitrate: number;
  videoCodec: string;
  videoFps: number;
  videoDynamicRange: string;
  videoDynamicRangeType: string;
  resolution: string;
  runTime: string;
  scanType: string;
  subtitles: string;
}

export interface MovieFile {
  movieId: number;
  relativePath: string;
  path: string;
  size: number;
  dateAdded: string;
  sceneName: string;
  releaseGroup: string;
  edition: string;
  languages: Language[];
  quality: Quality;
  indexerFlags: number;
  mediaInfo: MediaInfo;
  originalFilePath: string;
  qualityCutoffNotMet: boolean;
  id: number;
}

export interface Media {
  title: string;
  alternateTitles: AlternateTitle[];
  sortTitle: string;
  status: string;
  overview: string;
  images: Image[];
  year?: number;
  path?: string;
  qualityProfileId: number;
  monitored: boolean;
  runtime: number;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  rootFolderPath: string;
  certification: string;
  genres: string[];
  tags: string[];
  added: string;
  ratings: Ratings;
  statistics: Statistics;
  id: number;
}

export interface Movie extends Media {
  originalTitle: string;
  secondaryYearSourceId: number;
  inCinemas: string;
  physicalRelease: string;
  digitalRelease: string;
  releaseDate: string;
  website: string;
  youTubeTrailerId: string;
  studio: string;
  hasFile: boolean;
  movieFileId: number;
  minimumAvailability: string;
  isAvailable: boolean;
  folderName: string;
  movieFile: MovieFile;
  popularity: number;
  lastSearchTime: string;
}

export interface TVShow extends Media {
  ended: boolean;
  network: string;
  airTime: string;
  originalLanguage: OriginalLanguage;
  seasons: Season[];
  seasonFolder: boolean;
  useSceneNumbering: boolean;
}

export type MediaResponse = Media[];
