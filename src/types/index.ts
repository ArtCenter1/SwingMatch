// User and Session Types
export interface User {
  id: string;
  name: string;
  email: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  handedness: 'Right' | 'Left';
  avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  isAvailable?: boolean;
}

export interface VideoSession {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: number; // in seconds
  date: Date;
  tags: string[];
  notes?: string;
  analyzed: boolean;
}

export interface Analysis {
  id: string;
  sessionId: string;
  type: 'stroke_analysis' | 'pro_comparison' | 'pro_emulation';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: AnalysisResult;
  createdAt: Date;
}

export interface AnalysisResult {
  strokeType: string;
  biomechanics: {
    jointAngles: { [joint: string]: number };
    timing: number[];
    powerTransfer: number;
    consistency: number;
  };
  suggestions: string[];
  videoOverlayUrl?: string;
  comparisonProId?: string;
  emulationVideoUrl?: string;
}

export interface ProPlayer {
  id: string;
  name: string;
  avatar: string;
  playingStyle: string;
  strokeVideos: {
    forehand?: string;
    backhand?: string;
    serve?: string;
    volley?: string;
  };
  physicalCharacteristics: string[];
  youtubeChannelUrl?: string;
}

export interface Drill {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusArea: string[];
  duration: number; // in minutes
  equipment: string[];
}

export interface MatchRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  proposedDate?: Date;
  location?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// Navigation Types
export type RootTabParamList = {
  Home: undefined;
  Library: undefined;
  Record: undefined;
  AILab: undefined;
  Match: undefined;
};

export type LibraryTabParamList = {
  Sessions: undefined;
  Analyses: undefined;
  Drills: undefined;
};

export type AILabStackParamList = {
  Dashboard: undefined;
  StrokeAnalysis: { sessionId: string };
  ProComparison: { sessionId: string };
  ProEmulation: { sessionId: string };
  ProLibrary: undefined;
  ProDetail: { proId: string };
  AnalysisResult: { analysisId: string };
};

export type MatchStackParamList = {
  MapView: undefined;
  PlayerList: undefined;
  PlayerProfile: { userId: string };
  Chat: { userId: string };
};
