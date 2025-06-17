import React from 'react';
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
import { router } from 'expo-router';
import {
  Play,
  Target,
  TrendingUp,
  Users,
  Camera,
  ChevronRight,
  Award,
  Clock,
  Zap
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Home() {
  const quickActions = [
    {
      id: 'record',
      title: 'Start Recording',
      subtitle: 'Record your strokes',
      icon: Camera,
      color: '#34D399',
      action: () => router.push('/record')
    },
    {
      id: 'analyze',
      title: 'AI Analysis',
      subtitle: 'Get instant feedback',
      icon: Target,
      color: '#3B82F6',
      action: () => router.push('/sessions')
    },
    {
      id: 'compare',
      title: 'Compare with Pros',
      subtitle: 'Learn from the best',
      icon: Users,
      color: '#8B5CF6',
      action: () => {}
    },
    {
      id: 'progress',
      title: 'View Progress',
      subtitle: 'Track improvement',
      icon: TrendingUp,
      color: '#F59E0B',
      action: () => router.push('/progress')
    }
  ];

  const recentSessions = [
    {
      id: 1,
      type: 'Forehand',
      date: '2 hours ago',
      score: 8.5,
      improvements: 3
    },
    {
      id: 2,
      type: 'Backhand',
      date: 'Yesterday',
      score: 7.8,
      improvements: 2
    },
    {
      id: 3,
      type: 'Serve',
      date: '2 days ago',
      score: 9.1,
      improvements: 4
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.nameText}>Ready to improve your game?</Text>
          </View>
          <TouchableOpacity style={styles.profilePicture}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <LinearGradient
          colors={['#34D399', '#059669']}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>This Week's Progress</Text>
              <Text style={styles.progressSubtitle}>You're on fire! 🔥</Text>
            </View>
            <View style={styles.progressIcon}>
              <Award size={24} color="white" />
            </View>
          </View>
          
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>12</Text>
              <Text style={styles.progressLabel}>Sessions</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>8.4</Text>
              <Text style={styles.progressLabel}>Avg Score</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>23</Text>
              <Text style={styles.progressLabel}>Improvements</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionCard,
                    index % 2 === 0 ? styles.actionCardLeft : styles.actionCardRight
                  ]}
                  onPress={action.action}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <IconComponent size={24} color="white" />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/sessions')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color="#34D399" />
            </TouchableOpacity>
          </View>
          
          {recentSessions.map((session) => (
            <TouchableOpacity key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionLeft}>
                <View style={styles.sessionIcon}>
                  <Play size={16} color="#34D399" />
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <View style={styles.sessionMeta}>
                    <Clock size={12} color="#9CA3AF" />
                    <Text style={styles.sessionDate}>{session.date}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.sessionRight}>
                <Text style={styles.sessionScore}>{session.score}</Text>
                <View style={styles.improvementsBadge}>
                  <Zap size={12} color="#F59E0B" />
                  <Text style={styles.improvementsText}>+{session.improvements}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pro Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Record your warm-up strokes before practice sessions to establish a baseline for comparison.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 8,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  nameText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 2,
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  progressCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  progressSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#34D399',
    marginRight: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
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
  actionCardLeft: {
    width: (width - 52) / 2,
    marginLeft: 6,
    marginRight: 6,
  },
  actionCardRight: {
    width: (width - 52) / 2,
    marginLeft: 6,
    marginRight: 6,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sessionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  sessionRight: {
    alignItems: 'flex-end',
  },
  sessionScore: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#34D399',
  },
  improvementsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  improvementsText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginLeft: 2,
  },
  tipCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginTop: 0,
    marginBottom: 32,
  },
  tipHeader: {
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#78350F',
    lineHeight: 20,
  },
});