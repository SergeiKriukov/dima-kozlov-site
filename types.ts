export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
  associatedImageId?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  width: number;
  height: number;
}

export enum ViewMode {
  HOME = 'HOME',
  STORY_DETAIL = 'STORY_DETAIL',
  GALLERY = 'GALLERY',
}

export interface NavItem {
  label: string;
  mode: ViewMode;
}