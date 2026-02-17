export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  authProvider: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SavedItem {
  id: string;
  url: string | null;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  sourceApp: string | null;
  contentType: string | null;
  note: string | null;
  status: 'processing' | 'completed' | 'failed';
  tags: Tag[];
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
}
