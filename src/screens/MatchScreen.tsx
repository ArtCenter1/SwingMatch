import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { fontSizes, spacing, radius, shadows, useTheme } from '../theme';
import { mockNearbyPlayers, mockUser, mockMatchRequests } from '../data/mockData';
import { User, MatchRequest } from '../types';

type ViewType = 'map' | 'list';

export default function MatchScreen() {
  const { colors, toggleTheme, isDark } = useTheme();
  const [viewType, setViewType] = useState<ViewType>('map');
  const [isAvailable, setIsAvailable] = useState(mockUser.isAvailable || false);
  const [selectedPlayer, setSelectedPlayer] = useState<User | null>(null);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('All');

  const skillLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Professional'];

  const filteredPlayers = mockNearbyPlayers.filter(player => 
    skillFilter === 'All' || player.skillLevel === skillFilter
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Find Players</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Ionicons 
              name={isDark ? "sunny-outline" : "moon-outline"} 
              size={20} 
              color={colors.foreground} 
            />
          </TouchableOpacity>
          <View style={styles.availabilityToggle}>
            <Text style={styles.availabilityLabel}>Available</Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewType === 'map' && styles.activeToggle]}
          onPress={() => setViewType('map')}
        >
          <Ionicons
            name="map-outline"
            size={20}
            color={viewType === 'map' ? colors.primary : colors.mutedForeground}
          />
          <Text style={[
            styles.toggleText,
            viewType === 'map' && styles.activeToggleText
          ]}>
            Map
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, viewType === 'list' && styles.activeToggle]}
          onPress={() => setViewType('list')}
        >
          <Ionicons
            name="list-outline"
            size={20}
            color={viewType === 'list' ? colors.primary : colors.mutedForeground}
          />
          <Text style={[
            styles.toggleText,
            viewType === 'list' && styles.activeToggleText
          ]}>
            List
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilters = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
      contentContainerStyle={styles.filtersContent}
    >
      {skillLevels.map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.filterChip,
            skillFilter === level && styles.activeFilter
          ]}
          onPress={() => setSkillFilter(level)}
        >
          <Text style={[
            styles.filterText,
            skillFilter === level && styles.activeFilterText
          ]}>
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: mockUser.location?.latitude || 37.7749,
          longitude: mockUser.location?.longitude || -122.4194,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* User location */}
        <Marker
          coordinate={{
            latitude: mockUser.location?.latitude || 37.7749,
            longitude: mockUser.location?.longitude || -122.4194,
          }}
          title="You"
          pinColor={colors.primary}
        />
        
        {/* Nearby players */}
        {filteredPlayers.map((player) => (
          <Marker
            key={player.id}
            coordinate={{
              latitude: player.location?.latitude || 37.7749,
              longitude: player.location?.longitude || -122.4194,
            }}
            title={player.name}
            description={`${player.skillLevel} • ${player.handedness}-handed`}
            onPress={() => {
              setSelectedPlayer(player);
              setShowPlayerProfile(true);
            }}
          >
            <View style={[
              styles.playerMarker,
              { borderColor: player.isAvailable ? colors.primary : colors.mutedForeground }
            ]}>
              <Image source={{ uri: player.avatar }} style={styles.markerAvatar} />
              {player.isAvailable && <View style={styles.availabilityDot} />}
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );

  const renderPlayerCard = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.playerCard}
      onPress={() => {
        setSelectedPlayer(item);
        setShowPlayerProfile(true);
      }}
    >
      <View style={styles.playerCardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.playerAvatar} />
        <View style={styles.playerInfo}>
          <View style={styles.playerNameRow}>
            <Text style={styles.playerName}>{item.name}</Text>
            {item.isAvailable && <View style={styles.onlineDot} />}
          </View>
          <Text style={styles.playerSkill}>{item.skillLevel}</Text>
          <Text style={styles.playerHandedness}>{item.handedness}-handed</Text>
        </View>
        <View style={styles.playerActions}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => {
              setSelectedPlayer(item);
              setShowChat(true);
            }}
          >
            <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.matchButton}>
            <Ionicons name="tennisball" size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.playerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4.2</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>23</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0.8</Text>
          <Text style={styles.statLabel}>Distance (mi)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListView = () => (
    <FlatList
      data={filteredPlayers}
      renderItem={renderPlayerCard}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );

  const renderPlayerProfile = () => (
    <Modal visible={showPlayerProfile} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowPlayerProfile(false)}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Player Profile</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {selectedPlayer && (
          <ScrollView style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: selectedPlayer.avatar }} style={styles.profileAvatar} />
              <Text style={styles.profileName}>{selectedPlayer.name}</Text>
              <Text style={styles.profileSkill}>{selectedPlayer.skillLevel}</Text>
              <View style={styles.profileBadges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{selectedPlayer.handedness}-handed</Text>
                </View>
                {selectedPlayer.isAvailable && (
                  <View style={[styles.badge, styles.availableBadge]}>
                    <Text style={styles.availableBadgeText}>Available Now</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.profileStats}>
              <View style={styles.profileStatCard}>
                <Text style={styles.profileStatValue}>4.2</Text>
                <Text style={styles.profileStatLabel}>Player Rating</Text>
              </View>
              <View style={styles.profileStatCard}>
                <Text style={styles.profileStatValue}>23</Text>
                <Text style={styles.profileStatLabel}>Matches Played</Text>
              </View>
              <View style={styles.profileStatCard}>
                <Text style={styles.profileStatValue}>89%</Text>
                <Text style={styles.profileStatLabel}>Show Up Rate</Text>
              </View>
            </View>

            <View style={styles.recentActivity}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityItem}>
                <Ionicons name="tennisball" size={16} color={colors.primary} />
                <Text style={styles.activityText}>Played with Sarah W. • 2 days ago</Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="trophy" size={16} color={colors.primary} />
                <Text style={styles.activityText}>Won local tournament • 1 week ago</Text>
              </View>
            </View>

            <View style={styles.profileActions}>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => {
                  setShowPlayerProfile(false);
                  setShowChat(true);
                }}
              >
                <Ionicons name="chatbubble" size={20} color={colors.primaryForeground} />
                <Text style={styles.chatButtonText}>Send Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.requestButton}>
                <Ionicons name="add" size={20} color={colors.primaryForeground} />
                <Text style={styles.requestButtonText}>Request Match</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  const renderChat = () => (
    <Modal visible={showChat} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowChat(false)}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {selectedPlayer?.name}
          </Text>
          <TouchableOpacity>
            <Ionicons name="videocam-outline" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.chatContainer}>
          <ScrollView style={styles.messagesContainer}>
            <View style={styles.messageReceived}>
              <Text style={styles.messageText}>Hey! Want to play this weekend?</Text>
              <Text style={styles.messageTime}>2:30 PM</Text>
            </View>
            <View style={styles.messageSent}>
              <Text style={styles.messageTextSent}>Absolutely! What time works for you?</Text>
              <Text style={styles.messageTimeSent}>2:32 PM</Text>
            </View>
          </ScrollView>

          <View style={styles.chatInput}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.mutedForeground}
              value={chatMessage}
              onChangeText={setChatMessage}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color={colors.primaryForeground} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}
      {viewType === 'map' ? renderMapView() : renderListView()}
      {renderPlayerProfile()}
      {renderChat()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.foreground,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    padding: spacing[2],
    marginRight: spacing[3],
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: fontSizes.sm,
    color: colors.foreground,
    marginRight: spacing[2],
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing[1],
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    borderRadius: radius.sm,
  },
  activeToggle: {
    backgroundColor: colors.card,
    ...shadows.sm,
  },
  toggleText: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginLeft: spacing[1],
    fontWeight: '500',
  },
  activeToggleText: {
    color: colors.primary,
  },
  filtersContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  filterChip: {
    backgroundColor: colors.muted,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    marginRight: spacing[2],
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.primaryForeground,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  playerMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  availabilityDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  listContent: {
    padding: spacing[4],
  },
  playerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.md,
  },
  playerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing[3],
  },
  playerInfo: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  playerName: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
    marginRight: spacing[2],
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  playerSkill: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing[1],
  },
  playerHandedness: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
  },
  playerActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    marginTop: spacing[1],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
  },
  profileContent: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: spacing[6],
    backgroundColor: colors.card,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing[3],
  },
  profileName: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  profileSkill: {
    fontSize: fontSizes.lg,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing[3],
  },
  profileBadges: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  badge: {
    backgroundColor: colors.muted,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },
  availableBadge: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  availableBadgeText: {
    fontSize: fontSizes.xs,
    color: colors.primaryForeground,
    fontWeight: '500',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing[4],
    backgroundColor: colors.card,
    marginTop: spacing[1],
  },
  profileStatCard: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.foreground,
  },
  profileStatLabel: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginTop: spacing[1],
  },
  recentActivity: {
    padding: spacing[4],
    backgroundColor: colors.card,
    marginTop: spacing[1],
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing[3],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  activityText: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginLeft: spacing[2],
  },
  profileActions: {
    flexDirection: 'row',
    padding: spacing[4],
    gap: spacing[3],
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: spacing[3],
    borderRadius: radius.md,
  },
  chatButtonText: {
    fontSize: fontSizes.base,
    color: colors.secondaryForeground,
    fontWeight: '600',
    marginLeft: spacing[2],
  },
  requestButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing[3],
    borderRadius: radius.md,
  },
  requestButtonText: {
    fontSize: fontSizes.base,
    color: colors.primaryForeground,
    fontWeight: '600',
    marginLeft: spacing[2],
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: spacing[4],
  },
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    padding: spacing[3],
    borderRadius: radius.lg,
    marginBottom: spacing[2],
    maxWidth: '80%',
  },
  messageSent: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    padding: spacing[3],
    borderRadius: radius.lg,
    marginBottom: spacing[2],
    maxWidth: '80%',
  },
  messageText: {
    fontSize: fontSizes.base,
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  messageTextSent: {
    fontSize: fontSizes.base,
    color: colors.primaryForeground,
    marginBottom: spacing[1],
  },
  messageTime: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
  },
  messageTimeSent: {
    fontSize: fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing[3],
    fontSize: fontSizes.base,
    color: colors.foreground,
    marginRight: spacing[2],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
