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
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Users, Wand as Wand2, ArrowRight, Play, ChartBar as BarChart3, Target, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AILabScreen() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const aiFeatures = [
    {
      id: 'analysis',
      title: 'AI Stroke Analysis',
      subtitle: 'Get detailed biomechanical feedback',
      icon: BarChart3,
      color: '#007AFF',
      gradient: ['#007AFF', '#5856D6'],
    },
    {
      id: 'comparison',
      title: 'Pro Comparison',
      subtitle: 'Compare with professional players',
      icon: Target,
      color: '#34C759',
      gradient: ['#34C759', '#30D158'],
    },
    {
      id: 'emulation',
      title: 'Pro Emulation',
      subtitle: 'See yourself with perfect form',
      icon: Wand2,
      color: '#FF9500',
      gradient: ['#FF9500', '#FF6B35'],
    },
  ];

  const recentAnalyses = [
    {
      id: 1,
      title: 'Forehand Analysis',
      score: 85,
      improvements: 3,
      date: '2 hours ago',
      thumbnail: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'Serve Comparison',
      score: 92,
      improvements: 2,
      date: 'Yesterday',
      thumbnail: 'https://images.pexels.com/photos/1619860/pexels-photo-1619860.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const renderFeatureCard = (feature: any) => {
    const IconComponent = feature.icon;
    
    return (
      <TouchableOpacity key={feature.id} style={styles.featureCard}>
        <LinearGradient
          colors={feature.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featureGradient}>
          <View style={styles.featureContent}>
            <View style={styles.featureIcon}>
              <IconComponent size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </View>
            <ArrowRight size={20} color="rgba(255, 255, 255, 0.8)" strokeWidth={2} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>AI Lab</Text>
            <Text style={styles.headerSubtitle}>Analyze and improve your game</Text>
          </View>
          <View style={styles.creditsContainer}>
            <Zap size={16} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.creditsText}>5 credits</Text>
          </View>
        </View>

        {/* Quick Start */}
        <View style={styles.quickStartSection}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <TouchableOpacity style={styles.quickStartCard}>
            <View style={styles.quickStartContent}>
              <View style={styles.quickStartIcon}>
                <Play size={24} color="#FF6B35" strokeWidth={2} />
              </View>
              <View style={styles.quickStartText}>
                <Text style={styles.quickStartTitle}>Select Video to Analyze</Text>
                <Text style={styles.quickStartSubtitle}>Choose from your recent sessions</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* AI Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>AI Features</Text>
          {aiFeatures.map(renderFeatureCard)}
        </View>

        {/* Recent Analyses */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Analyses</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentAnalyses.map((analysis) => (
            <TouchableOpacity key={analysis.id} style={styles.analysisCard}>
              <Image source={{ uri: analysis.thumbnail }} style={styles.analysisThumbnail} />
              <View style={styles.analysisContent}>
                <View style={styles.analysisHeader}>
                  <Text style={styles.analysisTitle}>{analysis.title}</Text>
                  <View style={styles.scoreContainer}>
                    <Trophy size={14} color="#34C759" strokeWidth={2} />
                    <Text style={styles.scoreText}>{analysis.score}</Text>
                  </View>
                </View>
                <Text style={styles.analysisDate}>{analysis.date}</Text>
                <View style={styles.improvementsRow}>
                  <Text style={styles.improvementsText}>
                    {analysis.improvements} improvements identified
                  </Text>
                  <ArrowRight size={16} color="#8E8E93" strokeWidth={2} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  quickStartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  quickStartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickStartContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStartIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickStartText: {
    flex: 1,
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  quickStartSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featureCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  featureGradient: {
    padding: 20,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
  },
  analysisThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#F0F0F0',
  },
  analysisContent: {
    flex: 1,
    padding: 16,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  analysisDate: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 8,
  },
  improvementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  improvementsText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
});