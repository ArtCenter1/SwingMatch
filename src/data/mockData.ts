import { User, VideoSession, Analysis, ProPlayer, Drill, MatchRequest, Message } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  skillLevel: 'Intermediate',
  handedness: 'Right',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  isAvailable: true,
};

export const mockSessions: VideoSession[] = [
  {
    id: '1',
    title: 'Forehand Practice Session',
    thumbnail: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: 180,
    date: new Date('2024-01-15'),
    tags: ['forehand', 'baseline', 'practice'],
    notes: 'Focused on topspin and follow-through',
    analyzed: true,
  },
  {
    id: '2',
    title: 'Serve Technique Work',
    thumbnail: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=300&h=200&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: 240,
    date: new Date('2024-01-20'),
    tags: ['serve', 'technique', 'power'],
    notes: 'Working on consistency and placement',
    analyzed: false,
  },
  {
    id: '3',
    title: 'Backhand Rally',
    thumbnail: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: 150,
    date: new Date('2024-01-25'),
    tags: ['backhand', 'rally', 'consistency'],
    analyzed: true,
  },
];

export const mockAnalyses: Analysis[] = [
  {
    id: '1',
    sessionId: '1',
    type: 'stroke_analysis',
    status: 'completed',
    results: {
      strokeType: 'Forehand Topspin',
      biomechanics: {
        jointAngles: { shoulder: 45, elbow: 120, wrist: 15 },
        timing: [0.2, 0.4, 0.6, 0.8],
        powerTransfer: 78,
        consistency: 85,
      },
      suggestions: [
        'Increase hip rotation at contact',
        'Extend follow-through higher',
        'Keep head still through contact',
      ],
      videoOverlayUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    sessionId: '3',
    type: 'pro_comparison',
    status: 'completed',
    results: {
      strokeType: 'Backhand Drive',
      biomechanics: {
        jointAngles: { shoulder: 40, elbow: 110, wrist: 10 },
        timing: [0.3, 0.5, 0.7],
        powerTransfer: 72,
        consistency: 80,
      },
      suggestions: [
        'Match Djokovic\'s preparation timing',
        'Improve shoulder turn angle',
        'Follow through more consistently',
      ],
      comparisonProId: '1',
    },
    createdAt: new Date('2024-01-25'),
  },
];

export const mockProPlayers: ProPlayer[] = [
  {
    id: '1',
    name: 'Novak Djokovic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    playingStyle: 'Defensive Baseline',
    strokeVideos: {
      forehand: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      backhand: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      serve: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    },
    physicalCharacteristics: ['6\'2"', 'Right-handed', 'Athletic build'],
    youtubeChannelUrl: 'https://youtube.com/djokovic',
  },
  {
    id: '2',
    name: 'Rafael Nadal',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    playingStyle: 'Aggressive Topspin',
    strokeVideos: {
      forehand: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      backhand: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    },
    physicalCharacteristics: ['6\'1"', 'Left-handed', 'Muscular build'],
    youtubeChannelUrl: 'https://youtube.com/rafanadal',
  },
  {
    id: '3',
    name: 'Roger Federer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    playingStyle: 'All-Court Elegant',
    strokeVideos: {
      forehand: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      backhand: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      serve: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      volley: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    },
    physicalCharacteristics: ['6\'1"', 'Right-handed', 'Lean build'],
    youtubeChannelUrl: 'https://youtube.com/rogerfederer',
  },
];

export const mockDrills: Drill[] = [
  {
    id: '1',
    title: 'Forehand Cross-Court Rally',
    description: 'Practice consistent forehand shots cross-court to improve accuracy and rhythm.',
    thumbnail: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    difficulty: 'Beginner',
    focusArea: ['Forehand', 'Consistency', 'Footwork'],
    duration: 15,
    equipment: ['Tennis balls', 'Racket', 'Court'],
  },
  {
    id: '2',
    title: 'Serve and Volley Combination',
    description: 'Advanced drill combining serve placement with net approach and volleying.',
    thumbnail: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=300&h=200&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    difficulty: 'Advanced',
    focusArea: ['Serve', 'Volley', 'Net Play', 'Transition'],
    duration: 25,
    equipment: ['Tennis balls', 'Racket', 'Court', 'Cones'],
  },
  {
    id: '3',
    title: 'Backhand Down the Line',
    description: 'Improve backhand technique and accuracy by hitting down the line consistently.',
    thumbnail: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    difficulty: 'Intermediate',
    focusArea: ['Backhand', 'Accuracy', 'Power'],
    duration: 20,
    equipment: ['Tennis balls', 'Racket', 'Court'],
  },
];

export const mockNearbyPlayers: User[] = [
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    skillLevel: 'Advanced',
    handedness: 'Right',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1fe?w=150&h=150&fit=crop&crop=face',
    location: { latitude: 37.7849, longitude: -122.4094 },
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    skillLevel: 'Intermediate',
    handedness: 'Left',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: { latitude: 37.7649, longitude: -122.4294 },
    isAvailable: false,
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@example.com',
    skillLevel: 'Beginner',
    handedness: 'Right',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: { latitude: 37.7949, longitude: -122.4394 },
    isAvailable: true,
  },
];

export const mockMatchRequests: MatchRequest[] = [
  {
    id: '1',
    fromUserId: '2',
    toUserId: '1',
    message: 'Hey! Want to play this weekend?',
    status: 'pending',
    proposedDate: new Date('2024-02-10'),
    location: 'Golden Gate Park Tennis Courts',
    createdAt: new Date('2024-02-05'),
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    fromUserId: '2',
    toUserId: '1',
    content: 'Great match today! Thanks for the game.',
    timestamp: new Date('2024-02-01T14:30:00'),
    read: true,
  },
  {
    id: '2',
    fromUserId: '1',
    toUserId: '2',
    content: 'Absolutely! Your backhand has really improved.',
    timestamp: new Date('2024-02-01T14:32:00'),
    read: true,
  },
];

// Community feed data
export const mockCommunityPosts = [
  {
    id: '1',
    user: mockNearbyPlayers[0],
    session: mockSessions[0],
    analysis: mockAnalyses[0],
    likes: 23,
    comments: 5,
    timestamp: new Date('2024-01-30'),
  },
  {
    id: '2',
    user: mockNearbyPlayers[1],
    session: {
      ...mockSessions[1],
      title: 'Perfect Serve Technique',
      thumbnail: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=300&h=200&fit=crop',
    },
    likes: 18,
    comments: 3,
    timestamp: new Date('2024-01-28'),
  },
];
