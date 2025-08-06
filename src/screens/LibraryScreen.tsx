import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, spacing, radius, shadows, useTheme } from '../theme';
import { mockSessions, mockAnalyses, mockDrills } from '../data/mockData';
import { VideoSession, Analysis, Drill } from '../types';

type TabType = 'sessions' | 'analyses' | 'drills';

export default function LibraryScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('sessions');

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'sessions', label: 'My Sessions', icon: 'videocam-outline' },
        { key: 'analyses', label: 'My Analyses', icon: 'analytics-outline' },
        { key: 'drills', label: 'Saved Drills', icon: 'fitness-outline' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab,
          ]}
          onPress={() => setActiveTab(tab.key as TabType)}
        >
          <Ionicons
            name={tab.icon as keyof typeof Ionicons.glyphMap}
            size={20}
            color={activeTab === tab.key ? colors.primary : colors.mutedForeground}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.key && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSessionCard = ({ item }: { item: VideoSession }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.cardThumbnail} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardDate}>
              {item.date.toLocaleDateString()}
            </Text>
            <Text style={styles.cardDuration}>
              {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="analytics-outline" size={16} color={colors.primary} />
            <Text style={styles.actionButtonText}>
              {item.analyzed ? 'View Analysis' : 'Analyze'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="share-outline" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="ellipsis-horizontal" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAnalysisCard = ({ item }: { item: Analysis }) => {
    const session = mockSessions.find(s => s.id === item.sessionId);
    if (!session) return null;

    return (
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: session.thumbnail }} style={styles.cardThumbnail} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{session.title}</Text>
            <View style={styles.statusBadge}>
              <View style={[
                styles.statusDot,
                { backgroundColor: item.status === 'completed' ? colors.primary : colors.mutedForeground }
              ]} />
              <Text style={styles.statusText}>
                {item.status === 'completed' ? 'Complete' : 'Processing'}
              </Text>
            </View>
          </View>
          
          {item.results && (
            <View style={styles.analysisResults}>
              <Text style={styles.strokeType}>{item.results.strokeType}</Text>
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Power</Text>
                  <Text style={styles.metricValue}>{item.results.biomechanics.powerTransfer}%</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Consistency</Text>
                  <Text style={styles.metricValue}>{item.results.biomechanics.consistency}%</Text>
                </View>
              </View>
            </View>
          )}
          
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="eye-outline" size={16} color={colors.primary} />
              <Text style={styles.actionButtonText}>View Results</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction}>
              <Ionicons name="share-outline" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDrillCard = ({ item }: { item: Drill }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.cardThumbnail} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={[
              styles.difficultyText,
              { color: item.difficulty === 'Beginner' ? colors.primary :
                       item.difficulty === 'Intermediate' ? '#f39c12' : '#e74c3c' }
            ]}>
              {item.difficulty}
            </Text>
          </View>
        </View>
        
        <Text style={styles.drillDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.drillMeta}>
          <View style={styles.drillMetaItem}>
            <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
            <Text style={styles.drillMetaText}>{item.duration} min</Text>
          </View>
          <View style={styles.drillMetaItem}>
            <Ionicons name="fitness-outline" size={14} color={colors.mutedForeground} />
            <Text style={styles.drillMetaText}>{item.focusArea[0]}</Text>
          </View>
        </View>
        
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="play-outline" size={16} color={colors.primary} />
            <Text style={styles.actionButtonText}>Start Drill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="heart-outline" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'sessions':
        return (
          <FlatList
            data={mockSessions}
            renderItem={renderSessionCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'analyses':
        return (
          <FlatList
            data={mockAnalyses}
            renderItem={renderAnalysisCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'drills':
        return (
          <FlatList
            data={mockDrills}
            renderItem={renderDrillCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderTabBar()}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginLeft: spacing[1],
    fontWeight: '500',
  },
  activeTabLabel: {
    color: colors.primary,
  },
  listContent: {
    padding: spacing[4],
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing[4],
    overflow: 'hidden',
    ...shadows.md,
  },
  cardThumbnail: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
    flex: 1,
    marginRight: spacing[2],
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  cardDate: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
  },
  cardDuration: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginTop: spacing[1],
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing[3],
  },
  tag: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    marginRight: spacing[2],
    marginBottom: spacing[1],
  },
  tagText: {
    fontSize: fontSizes.xs,
    color: colors.accentForeground,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    flex: 1,
    marginRight: spacing[2],
  },
  actionButtonText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    marginLeft: spacing[1],
    fontWeight: '500',
  },
  secondaryAction: {
    padding: spacing[2],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing[1],
  },
  statusText: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  analysisResults: {
    marginBottom: spacing[3],
  },
  strokeType: {
    fontSize: fontSizes.base,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    marginBottom: spacing[1],
  },
  metricValue: {
    fontSize: fontSizes.lg,
    color: colors.foreground,
    fontWeight: '600',
  },
  difficultyBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },
  difficultyText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  drillDescription: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginBottom: spacing[3],
    lineHeight: 20,
  },
  drillMeta: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[3],
  },
  drillMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drillMetaText: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    marginLeft: spacing[1],
  },
});
