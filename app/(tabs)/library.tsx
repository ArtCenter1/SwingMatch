import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Play, MoveVertical as MoreVertical, Clock, Tag, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState('sessions');

  const tabs = [
    { id: 'sessions', label: 'My Sessions' },
    { id: 'analyses', label: 'Analyses' },
    { id: 'lessons', label: 'Lessons' },
  ];

  const sessions = [
    {
      id: 1,
      title: 'Forehand Practice',
      date: '2 hours ago',
      duration: '12:34',
      thumbnail: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Forehand', 'Power'],
      analyzed: false,
    },
    {
      id: 2,
      title: 'Serve Training',
      date: 'Yesterday',
      duration: '8:45',
      thumbnail: 'https://images.pexels.com/photos/1619860/pexels-photo-1619860.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Serve', 'Technique'],
      analyzed: true,
    },
  ];

  const analyses = [
    {
      id: 1,
      title: 'Forehand Analysis',
      date: 'Today',
      score: 85,
      improvements: ['Timing', 'Follow-through'],
      thumbnail: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const lessons = [
    {
      id: 1,
      title: 'Perfect Forehand Technique',
      instructor: 'Rafael Nadal',
      duration: '5:30',
      thumbnail: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'Intermediate',
    },
  ];

  const renderSessionCard = (session: any) => (
    <View key={session.id} style={styles.card}>
      <Image source={{ uri: session.thumbnail }} style={styles.cardThumbnail} />
      <TouchableOpacity style={styles.playButton}>
        <Play size={16} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{session.title}</Text>
          <TouchableOpacity>
            <MoreVertical size={20} color="#8E8E93" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#8E8E93" strokeWidth={2} />
            <Text style={styles.metaText}>{session.duration}</Text>
          </View>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{session.date}</Text>
        </View>
        <View style={styles.tagsContainer}>
          {session.tags.map((tag: string, index: number) => (
            <View key={index} style={styles.tag}>
              <Tag size={12} color="#FF6B35" strokeWidth={2} />
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        {!session.analyzed && (
          <TouchableOpacity style={styles.analyzeButton}>
            <Zap size={16} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.analyzeText}>Analyze with AI</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderAnalysisCard = (analysis: any) => (
    <View key={analysis.id} style={styles.card}>
      <Image source={{ uri: analysis.thumbnail }} style={styles.cardThumbnail} />
      <View style={styles.scoreOverlay}>
        <Text style={styles.scoreText}>{analysis.score}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{analysis.title}</Text>
          <TouchableOpacity>
            <MoreVertical size={20} color="#8E8E93" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDate}>{analysis.date}</Text>
        <View style={styles.improvementsContainer}>
          <Text style={styles.improvementsLabel}>Key Improvements:</Text>
          <View style={styles.improvementsList}>
            {analysis.improvements.map((improvement: string, index: number) => (
              <Text key={index} style={styles.improvementItem}>• {improvement}</Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderLessonCard = (lesson: any) => (
    <View key={lesson.id} style={styles.card}>
      <Image source={{ uri: lesson.thumbnail }} style={styles.cardThumbnail} />
      <TouchableOpacity style={styles.playButton}>
        <Play size={16} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{lesson.title}</Text>
          <TouchableOpacity>
            <MoreVertical size={20} color="#8E8E93" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Text style={styles.instructorText}>by {lesson.instructor}</Text>
        <View style={styles.lessonMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#8E8E93" strokeWidth={2} />
            <Text style={styles.metaText}>{lesson.duration}</Text>
          </View>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color="#1C1C1E" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={24} color="#1C1C1E" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'sessions' && sessions.map(renderSessionCard)}
        {activeTab === 'analyses' && analyses.map(renderAnalysisCard)}
        {activeTab === 'lessons' && lessons.map(renderLessonCard)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardThumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#F0F0F0',
  },
  playButton: {
    position: 'absolute',
    top: 70,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  cardDate: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F0',
    paddingVertical: 12,
    borderRadius: 12,
  },
  analyzeText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  improvementsContainer: {
    marginTop: 8,
  },
  improvementsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  improvementsList: {
    gap: 2,
  },
  improvementItem: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  instructorText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
});