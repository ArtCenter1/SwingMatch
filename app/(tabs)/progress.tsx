import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Calendar, Award, Target, ChartBar as BarChart3, Activity, ChevronDown, Star, Zap, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const timeRanges = ['Week', 'Month', '3 Months', 'Year'];

const progressData = {
  overall: {
    current: 8.2,
    previous: 7.8,
    trend: 'up',
    sessions: 47,
    improvements: 23
  },
  strokes: [
    { name: 'Forehand', score: 8.5, change: +0.7, color: '#34D399' },
    { name: 'Backhand', score: 7.8, change: +0.4, color: '#3B82F6' },
    { name: 'Serve', score: 8.9, change: +1.2, color: '#8B5CF6' },
    { name: 'Volley', score: 7.2, change: +0.3, color: '#F59E0B' },
  ],
  achievements: [
    {
      id: 1,
      title: 'Perfect Week',
      description: '7 consecutive improvement sessions',
      icon: Trophy,
      color: '#F59E0B',
      unlocked: true,
      date: '2 days ago'
    },
    {
      id: 2,
      title: 'Consistency King',
      description: '15 days of practice this month',
      icon: Target,
      color: '#34D399',
      unlocked: true,
      date: '1 week ago'
    },
    {
      id: 3,
      title: 'Power Player',
      description: 'Increase serve speed by 15%',
      icon: Zap,
      color: '#8B5CF6',
      unlocked: false,
      progress: 73
    }
  ]
};

export default function Progress() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Month');

  const renderProgressCard = () => (
    <LinearGradient
      colors={['#34D399', '#059669']}
      style={styles.progressCard}
    >
      <View style={styles.progressHeader}>
        <View>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <Text style={styles.progressSubtitle}>This {selectedTimeRange.toLowerCase()}</Text>
        </View>
        <View style={styles.trendIndicator}>
          <TrendingUp size={20} color="white" />
        </View>
      </View>
      
      <View style={styles.progressStats}>
        <View style={styles.mainStat}>
          <Text style={styles.mainStatValue}>{progressData.overall.current}</Text>
          <Text style={styles.mainStatLabel}>Average Score</Text>
          <View style={styles.changeIndicator}>
            <TrendingUp size={12} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.changeText}>+{progressData.overall.current - progressData.overall.previous}</Text>
          </View>
        </View>
        
        <View style={styles.subStats}>
          <View style={styles.subStat}>
            <Text style={styles.subStatValue}>{progressData.overall.sessions}</Text>
            <Text style={styles.subStatLabel}>Sessions</Text>
          </View>
          <View style={styles.subStat}>
            <Text style={styles.subStatValue}>{progressData.overall.improvements}</Text>
            <Text style={styles.subStatLabel}>Improvements</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {timeRanges.map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              selectedTimeRange === range && styles.activeTimeRange
            ]}
            onPress={() => setSelectedTimeRange(range)}
          >
            <Text style={[
              styles.timeRangeText,
              selectedTimeRange === range && styles.activeTimeRangeText
            ]}>
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStrokeProgress = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stroke Analysis</Text>
      <View style={styles.strokesContainer}>
        {progressData.strokes.map((stroke, index) => (
          <View key={stroke.name} style={styles.strokeCard}>
            <View style={styles.strokeHeader}>
              <View style={[styles.strokeIndicator, { backgroundColor: stroke.color }]} />
              <Text style={styles.strokeName}>{stroke.name}</Text>
              <View style={styles.strokeChange}>
                <TrendingUp size={12} color={stroke.color} />
                <Text style={[styles.strokeChangeText, { color: stroke.color }]}>
                  +{stroke.change}
                </Text>
              </View>
            </View>
            
            <Text style={styles.strokeScore}>{stroke.score}</Text>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(stroke.score / 10) * 100}%`,
                    backgroundColor: stroke.color
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      <View style={styles.achievementsContainer}>
        {progressData.achievements.map((achievement) => {
          const IconComponent = achievement.icon;
          return (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.lockedAchievement
              ]}
            >
              <View style={styles.achievementLeft}>
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.unlocked ? achievement.color : '#D1D5DB' }
                ]}>
                  <IconComponent 
                    size={20} 
                    color={achievement.unlocked ? 'white' : '#9CA3AF'} 
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.lockedText
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.lockedText
                  ]}>
                    {achievement.description}
                  </Text>
                  {achievement.unlocked ? (
                    <Text style={styles.achievementDate}>{achievement.date}</Text>
                  ) : (
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressText}>{achievement.progress}%</Text>
                      <View style={styles.miniProgressBar}>
                        <View 
                          style={[
                            styles.miniProgressFill,
                            { width: `${achievement.progress}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
              {achievement.unlocked && (
                <Star size={16} color="#F59E0B" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderInsights = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weekly Insights</Text>
      <View style={styles.insightsContainer}>
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Target size={20} color="#34D399" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Most Improved</Text>
            <Text style={styles.insightText}>Your serve technique has improved significantly this week</Text>
          </View>
        </View>
        
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Activity size={20} color="#3B82F6" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Focus Area</Text>
            <Text style={styles.insightText}>Work on backhand consistency for better overall performance</Text>
          </View>
        </View>
        
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Award size={20} color="#8B5CF6" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Next Goal</Text>
            <Text style={styles.insightText}>3 more perfect sessions to unlock "Precision Master"</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProgressCard()}
        {renderTimeRangeSelector()}
        {renderStrokeProgress()}
        {renderAchievements()}
        {renderInsights()}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  calendarButton: {
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
  scrollView: {
    flex: 1,
  },
  progressCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  progressSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  trendIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainStat: {
    flex: 1,
    alignItems: 'center',
  },
  mainStatValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  mainStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 4,
  },
  subStats: {
    flex: 1,
    gap: 16,
  },
  subStat: {
    alignItems: 'center',
  },
  subStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  subStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  timeRangeContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTimeRange: {
    backgroundColor: '#34D399',
    borderColor: '#34D399',
  },
  timeRangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTimeRangeText: {
    color: 'white',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  strokesContainer: {
    gap: 12,
  },
  strokeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  strokeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strokeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  strokeName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  strokeChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strokeChangeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  strokeScore: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
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
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#34D399',
  },
  miniProgressBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 1,
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  bottomSpacer: {
    height: 32,
  },
});