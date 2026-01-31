export interface Photo {
  id: string;
  url: string;
  file: File;
  date: Date;
  isFavorite: boolean;
}

export enum ViewMode {
  UPLOAD = 'UPLOAD',
  RANDOM = 'RANDOM',
  ON_THIS_DAY = 'ON_THIS_DAY',
  FAVORITES = 'FAVORITES'
}

export interface AnalysisState {
  loading: boolean;
  text: string | null;
  error: string | null;
}