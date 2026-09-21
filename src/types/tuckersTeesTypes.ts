
export interface Design {
  id: string;
  title: string;
  status: string;
  file_url: string;
  collection_id: string | null;
  created_at: string;
  user_id?: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
}
