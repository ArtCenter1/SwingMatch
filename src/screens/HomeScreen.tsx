import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, spacing, radius, shadows, useTheme } from '../theme';
import { mockUser, mockCommunityPosts } from '../data/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, toggleTheme, isDark } = useTheme();
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{mockUser.name}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
            <Ionicons 
              name={isDark ? "sunny-outline" : "moon-outline"} 
              size={24} 
              color={colors.foreground} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPrimaryCTA = () => (
    <TouchableOpacity style={styles.primaryCTA}>
      <View style={styles.ctaContent}>
        <View style={styles.ctaIcon}>
          <Ionicons name="videocam" size={32} color={colors.primaryForeground} />
        </View>
        <View style={styles.ctaText}>
          <Text style={styles.ctaTitle}>Start New Recording Session</Text>
          <Text style={styles.ctaSubtitle}>Capture your stroke for AI analysis</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.primaryForeground} />
      </View>
    </TouchableOpacity>
  );

  const renderActivitySummary = () => (
    <View style={styles.activityContainer}>
      <Text style={styles.sectionTitle}>Your Activity</Text>
      <View style={styles.activityCards}>
        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="videocam" size={20} color={colors.primary} />
          </View>
          <Text style={styles.activityNumber}>12</Text>
          <Text style={styles.activityLabel}>Sessions</Text>
        </View>
        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="analytics" size={20} color={colors.primary} />
          </View>
          <Text style={styles.activityNumber}>8</Text>
          <Text style={styles.activityLabel}>Analyses</Text>
        </View>
        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="fitness" size={20} color={colors.primary} />
          </View>
          <Text style={styles.activityNumber}>15</Text>
          <Text style={styles.activityLabel}>Drills Done</Text>
        </View>
        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="flame" size={20} color={colors.primary} />
          </View>
          <Text style={styles.activityNumber}>7</Text>
          <Text style={styles.activityLabel}>Day Streak</Text>
        </View>
      </View>
    </View>
  );

  const renderCommunityFeed = () => (
    <View style={styles.communityContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Community Highlights</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {mockCommunityPosts.map((post) => (
        <TouchableOpacity key={post.id} style={styles.communityCard}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.user.avatar }} style={styles.postAvatar} />
            <View style={styles.postUserInfo}>
              <Text style={styles.postUserName}>{post.user.name}</Text>
              <Text style={styles.postTime}>
                {post.timestamp.toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <Image source={{ uri: post.session.thumbnail }} style={styles.postThumbnail} />
          
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>{post.session.title}</Text>
            {post.analysis && (
              <View style={styles.analysisTag}>
                <Ionicons name="analytics" size={12} color={colors.primary} />
                <Text style={styles.analysisText}>AI Analysis Complete</Text>
              </View>
            )}
          </View>
          
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={20} color={colors.mutedForeground} />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.mutedForeground} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderHeader()}
      {renderPrimaryCTA()}
      {renderActivitySummary()}
      {renderCommunityFeed()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: fontSizes.base,
    color: colors.mutedForeground,
  },
  userName: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.foreground,
    marginTop: spacing[1],
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconButton: {
    padding: spacing[2],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  primaryCTA: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[6],
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    ...shadows.md,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  ctaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.primaryForeground,
    marginBottom: spacing[1],
  },
  ctaSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.primaryForeground,
    opacity: 0.8,
  },
  activityContainer: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing[4],
  },
  activityCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing[4],
    alignItems: 'center',
    marginHorizontal: spacing[1],
    ...shadows.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  activityNumber: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.foreground,
  },
  activityLabel: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  communityContainer: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  seeAllText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  communityCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing[4],
    ...shadows.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    paddingBottom: spacing[3],
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing[3],
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.foreground,
  },
  postTime: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
  },
  postThumbnail: {
    width: '100%',
    height: 200,
    marginBottom: spacing[3],
  },
  postContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  postTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing[2],
  },
  analysisTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  analysisText: {
    fontSize: fontSizes.xs,
    color: colors.primary,
    marginLeft: spacing[1],
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing[3],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing[6],
  },
  actionText: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginLeft: spacing[1],
  },
});
