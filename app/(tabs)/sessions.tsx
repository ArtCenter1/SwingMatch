import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Search, Filter, Calendar, Clock, TrendingUp, Target, Award, ChevronRight, ChartBar as BarChart3, Eye, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const sessions = [
  {
    id: 1,
    type: 'Forehand',
    date: '2024-01-15',
    time: '2 hours ago',
    score: 8.5,
    improvements: 3,
    thumbnail: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    status: 'analyzed',
    keyMetrics: {
      timing: 85,
      power: 78,
      accuracy: 92
    }
  },
  {
    id: 2,
    type: 'Backhand',
    date: '2024-01-14',
    time: 'Yesterday',
    score: 7.8,
    improvements: 2,
    thumbnail: 'https://images.pexels.com/photos/622279/pexels-photo-622279.jpeg',
    status: 'analyzed',
    keyMetrics: {
      timing: 72,
      power: 85,
      accuracy: 78
    }
  },
  {
    id: 3,
    type: 'Serve',
    date: '2024-01-13',
    time: '2 days ago',
    score: 9.1,
    improvements: 4,
    thumbnail: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg',
    status: 'processing',
    keyMetrics: {
      timing: 94,
      power: 89,
      accuracy: 91
    }
  },
  {
    id: 4,
    type: 'Volley',
    date: '2024-01-12',
    time: '3 days ago',
    score: 6.9,
    improvements: 5,
    thumbnail: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    status: 'analyzed',
    keyMetrics: {
      timing: 65,
      power: 70,
      accuracy: 72
    }
  }
];

const filterOptions = ['All', 'Forehand', 'Backhand', 'Serve', 'Volley'];

export default function Sessions() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const filteredSessions = sessions.filter(session => 
    selectedFilter === 'All' || session.type === selectedFilter
  );

  const handleSessionPress = (session) => {
    setSelectedSession(session);
    setShowAnalysis(true);
  };

  const renderSessionCard = (session) => (
    <TouchableOpacity
      key={session.id}
      style={styles.sessionCard}
      onPress={() => handleSessionPress(session)}
    >
      <View style={styles.sessionThumbnail}>
        <Image source={{ uri: session.thumbnail }} style={styles.thumbnailImage} />
        <View style={styles.playOverlay}>
          <Play size={16} color="white" />
        </View>
        {session.status === 'processing' && (
          <View style={styles.processingBadge}>
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </View>
      
      <View style={styles.sessionInfo}>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionType}>{session.type}</Text>
          <Text style={styles.sessionScore}>{session.score}</Text>
        </View>
        
        <View style={styles.sessionMeta}>
          <Clock size={12} color="#9CA3AF" />
          <Text style={styles.sessionTime}>{session.time}</Text>
        </View>
        
        <View style={styles.sessionMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Timing</Text>
            <Text style={styles.metricValue}>{session.keyMetrics.timing}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Power</Text>
            <Text style={styles.metricValue}>{session.keyMetrics.power}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Accuracy</Text>
            <Text style={styles.metricValue}>{session.keyMetrics.accuracy}%</Text>
          </View>
        </View>
        
        {session.improvements > 0 && (
          <View style={styles.improvementsBadge}>
            <TrendingUp size={12} color="#34D399" />
            <Text style={styles.improvementsText}>+{session.improvements} improvements</Text>
          </View>
        )}
      </View>
      
      <ChevronRight size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  const renderAnalysisModal = () => {
    if (!selectedSession) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAnalysis(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedSession.type} Analysis</Text>
            </View>
            
            <View style={styles.videoContainer}>
              <Image 
                source={{ uri: selectedSession.thumbnail }} 
                style={styles.analysisVideo}
              />
              <View style={styles.videoOverlay}>
                <Play size={32} color="white" />
              </View>
            </View>
            
            <LinearGradient
              colors={['#34D399', '#059669']}
              style={styles.scoreCard}
            >
              <Text style={styles.scoreTitle}>Overall Score</Text>
              <Text style={styles.scoreValue}>{selectedSession.score}/10</Text>
              <Text style={styles.scoreSubtitle}>Excellent performance!</Text>
            </LinearGradient>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Target size={24} color="#34D399" />
                <Text style={styles.metricCardTitle}>Timing</Text>
                <Text style={styles.metricCardValue}>{selectedSession.keyMetrics.timing}%</Text>
                <Text style={styles.metricCardStatus}>Excellent</Text>
              </View>
              <View style={styles.metricCard}>
                <BarChart3 size={24} color="#3B82F6" />
                <Text style={styles.metricCardTitle}>Power</Text>
                <Text style={styles.metricCardValue}>{selectedSession.keyMetrics.power}%</Text>
                <Text style={styles.metricCardStatus}>Good</Text>
              </View>
              <View style={styles.metricCard}>
                <Award size={24} color="#8B5CF6" />
                <Text style={styles.metricCardTitle}>Accuracy</Text>
                <Text style={styles.metricCardValue}>{selectedSession.keyMetrics.accuracy}%</Text>
                <Text style={styles.metricCardStatus}>Outstanding</Text>
              </View>
            </View>
            
            <View style={styles.improvementsSection}>
              <Text style={styles.improvementsTitle}>Key Improvements</Text>
              <View style={styles.improvementItem}>
                <View style={styles.improvementIcon}>
                  <TrendingUp size={16} color="#34D399" />
                </View>
                <View style={styles.improvementContent}>
                  <Text style={styles.improvementText}>Follow-through angle improved by 15°</Text>
                  <Text style={styles.improvementDetail}>Better wrist position at contact</Text>
                </View>
              </View>
              <View style={styles.improvementItem}>
                <View style={styles.improvementIcon}>
                  <TrendingUp size={16} color="#34D399" />
                </View>
                <View style={styles.improvementContent}>
                  <Text style={styles.improvementText}>Racket speed increased by 8%</Text>
                  <Text style={styles.improvementDetail}>More explosive hip rotation</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.compareButton}>
                <Users size={20} color="#8B5CF6" />
                <Text style={styles.compareButtonText}>Compare with Pro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.simulateButton}>
                <Eye size={20} color="#34D399" />
                <Text style={styles.simulateButtonText}>AI Simulation</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sessions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Calendar size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
        {filteredSessions.map(renderSessionCard)}
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Keep practicing!</Text>
          <Text style={styles.emptyText}>
            Record more sessions to see detailed analysis and track your improvement over time.
          </Text>
        </View>
      </ScrollView>
      
      {showAnalysis && renderAnalysisModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#34D399',
    borderColor: '#34D399',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: 'white',
  },
  sessionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sessionThumbnail: {
    position: 'relative',
    marginRight: 16,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  processingText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  sessionScore: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#34D399',
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  sessionMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  metricValue: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  improvementsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  improvementsText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#34D399',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 8,
  },
  closeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#34D399',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  videoContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  analysisVideo: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scoreValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginVertical: 8,
  },
  scoreSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricCardTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
  },
  metricCardValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 4,
  },
  metricCardStatus: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#34D399',
    marginTop: 2,
  },
  improvementsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  improvementsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  improvementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  improvementContent: {
    flex: 1,
  },
  improvementText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  improvementDetail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  compareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: 16,
    borderRadius: 12,
  },
  compareButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  simulateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34D399',
    paddingVertical: 16,
    borderRadius: 12,
  },
  simulateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
});