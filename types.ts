
export type Category = 'ALL' | 'BRANDED CONTENT' | 'INTERVIEW' | 'MAKING' | 'AI-STUDIO';

export type AspectRatio = '9:16' | '16:9';

export type View = 'HOME' | 'DIRECTORS' | 'ABOUT' | 'CONTACT' | 'ADMIN';

export interface Project {
  id: string;
  title: string;
  category: Category;
  thumbnail: string;
  videoUrl: string;
  client: string;
  director: string;
  year: string;
  description: string;
  gallery: string[];
  aspectRatio: AspectRatio;
}

export interface SynopsisRequest {
  brandName: string;
  mood: string;
}

export interface SynopsisResponse {
  title: string;
  concept: string;
  synopsis: string;
  visualHook: string;
  brandName?: string; // Optional field for passing back to the request form
}
