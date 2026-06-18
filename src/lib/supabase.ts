import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const createServerSupabaseClient = async (accessToken?: string, refreshToken?: string) => {
  const options: any = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  };

  if (accessToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, options);

  if (accessToken && refreshToken) {
    await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }
  return client;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  tags: string[];
  image_url: string | null;
  images_urls: string[] | null;
  live_url: string | null;
  github_url: string | null;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  available_for_hire: boolean;
  neon_cursor_enabled: boolean;
  cv_download_enabled: boolean;
  maintenance_mode: boolean;
  bio: string;
  role_title: string;
  logo_text: string;
  hero_title: string;
  about_image_url: string | null;
  about_text: string;
  cv_pdf_url: string | null;
  skills: string[];
  tools: string[];
  languages: any[];
  education: any[];
  updated_at: string;
};

export type SocialNetwork = {
  id: string;
  name: string;
  url: string;
  icon: string;
  order_index: number;
  created_at: string;
};

export type Trajectory = {
  id: string;
  date_range: string;
  role: string;
  company: string;
  description: string;
  order_index: number;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  author: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
};

export type PageVisit = {
  id: string;
  page: string;
  ip_address: string;
  user_agent: string;
  referer: string;
  created_at: string;
};
