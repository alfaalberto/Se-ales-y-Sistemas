
export interface ContentBlockType {
  id: string;
  html: string;
}

export interface SectionType {
  id: string;
  title: string;
  content: ContentBlockType[];
  subsections?: SectionType[];
}

export interface ChapterType {
  chapter: string;
  title: string;
  sections: SectionType[];
}

export type TableOfContentsType = ChapterType[];
