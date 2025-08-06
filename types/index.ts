export interface User {
  id: string;
  name: string;
  email: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  handedness: 'Right' | 'Left';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  tags: string[];
  notes?: string;
  analyzed: boolean;
  created_at: string;
}

export interface Analysis {
  id: string;
  session_id: string;
  user_id: string;
  score: number;
  improvements: string[];
  biomechanical_data: any;
  suggestions: string[];
  created_at: string;
}

export interface ProPlayer {
  id: string;
  name: string;
  playing_style: string;
  video_library: ProVideo[];
}

export interface ProVideo {
  id: string;
  pro_player_id: string;
  stroke_type: 'Forehand' | 'Backhand' | 'Serve' | 'Volley';
  video_url: string;
  thumbnail_url: string;
  description: string;
}

export interface Match {
  id: string;
  player1_id: string;
  player2_id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  scheduled_at?: string;
  location?: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  likes_count: number;
  comments_count: number;
  improvement_metric?: string;
  created_at: string;
}