import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, CircleHelp as HelpCircle, Star, Bell, Shield, CreditCard, LogOut, ChevronRight, Crown, Users, BookOpen, MessageSquare, Share2 } from 'lucide-react-native';

const menuItems = [
  {
    id: 'profile',
    title: 'Profile Settings',
    subtitle: 'Manage your personal information',
    icon: User,
    color: '#34D399',
    action: () => {}
  },
  {
    id: 'subscription',
    title: 'Premium Subscription',
    subtitle: 'Unlock advanced features',
    icon: Crown,
    color: '#F59E0B',
    action: () => {}
  },
  {
    id: 'coaching',
    title: 'Find a Coach',
    subtitle: 'Connect with professional coaches',
    icon: Users,
    color: '#3B82F6',
    action: () => {}
  },
  {
    id: 'tutorials',
    title: 'Tutorials & Tips',
    subtitle: 'Learn tennis techniques',
    icon: BookOpen,
    color: '#8B5CF6',
    action: () => {}
  }
];

const settingsItems = [
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Push notifications and alerts',
    icon: Bell,
    hasSwitch: true,
    enabled: true
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    subtitle: 'Manage your data and privacy',
    icon: Shield,
    hasSwitch: false
  },
  {
    id: 'billing',
    title: 'Billing & Payments',
    subtitle: 'Manage subscription and payments',
    icon: CreditCard,
    hasSwitch: false
  }
];

const supportItems = [
  {
    id: 'help',
    title: 'Help Center',
    subtitle: 'Get answers to common questions',
    icon: HelpCircle,
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    subtitle: 'Help us improve SwingMatch',
    icon: MessageSquare,
  },
  {
    id: 'rate',
    title: 'Rate App',
    subtitle: 'Leave a review on the App Store',
    icon: Star,
  },
  {
    id: 'share',
    title: 'Share SwingMatch',
    subtitle: 'Tell your friends about the app',
    icon: Share2,
  }
];

export default function More() {
  const renderProfileHeader = () => (
    <LinearGradient
      colors={['#34D399', '#059669']}
      style={styles.profileHeader}
    >
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg' }}
          style={styles.profileImage}
        />
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>Alex Johnson</Text>
          <Text style={styles.profileLevel}>Intermediate Player</Text>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>8.2</Text>
              <Text style={styles.profileStatLabel}>Avg Score</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>47</Text>
              <Text style={styles.profileStatLabel}>Sessions</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>23</Text>
              <Text style={styles.profileStatLabel}>Achievements</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderMenuSection = (title, items, hasSwitch = false) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuContainer}>
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` || 'rgba(107, 114, 128, 0.1)' }]}>
                  <IconComponent size={20} color={item.color || '#6B7280'} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              
              {item.hasSwitch ? (
                <Switch
                  value={item.enabled}
                  onValueChange={() => {}}
                  trackColor={{ false: '#E5E7EB', true: '#34D399' }}
                  thumbColor={item.enabled ? '#FFFFFF' : '#FFFFFF'}
                />
              ) : (
                <ChevronRight size={20} color="#D1D5DB" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        
        {renderMenuSection('Quick Actions', menuItems)}
        {renderMenuSection('Settings', settingsItems, true)}
        {renderMenuSection('Support', supportItems)}
        
        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton}>
            <LogOut size={20} color="#DC2626" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        
        {/* App Version */}
        <View style={styles.appVersion}>
          <Text style={styles.versionText}>SwingMatch v1.0.0</Text>
          <Text style={styles.versionSubtext}>Build 2024.01.15</Text>
        </View>
        
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 24,
    marginBottom: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 16,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  profileStatLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  signOutButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
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
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginLeft: 8,
  },
  appVersion: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  versionSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  bottomSpacer: {
    height: 32,
  },
});