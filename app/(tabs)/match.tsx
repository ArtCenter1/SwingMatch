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
import { 
  Map,
  List,
  MapPin,
  Star,
  MessageCircle,
  UserPlus,
  Filter,
  Search
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function MatchScreen() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [isAvailable, setIsAvailable] = useState(false);

  const nearbyPlayers = [
    {
      id: 1,
      name: 'Emma Wilson',
      skill: 'Intermediate',
      distance: '0.8 miles',
      rating: 4.8,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOnline: true,
      lastActive: 'Active now',
      playStyle: 'Aggressive baseline',
    },
    {
      id: 2,
      name: 'David Park',
      skill: 'Advanced',
      distance: '1.2 miles',
      rating: 4.9,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOnline: false,
      lastActive: '2 hours ago',
      playStyle: 'All-court player',
    },
    {
      id: 3,
      name: 'Sofia Martinez',
      skill: 'Intermediate',
      distance: '2.1 miles',
      rating: 4.7,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      isOnline: true,
      lastActive: 'Active now',
      playStyle: 'Serve & volley',
    },
  ];

  const renderPlayerCard = (player: any) => (
    <TouchableOpacity key={player.id} style={styles.playerCard}>
      <View style={styles.playerHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: player.avatar }} style={styles.avatar} />
          {player.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <View style={styles.playerMeta}>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD60A" strokeWidth={2} />
              <Text style={styles.ratingText}>{player.rating}</Text>
            </View>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.skillText}>{player.skill}</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={14} color="#8E8E93" strokeWidth={2} />
            <Text style={styles.distanceText}>{player.distance}</Text>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.lastActiveText}>{player.lastActive}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.playStyleText}>{player.playStyle}</Text>
      
      <View style={styles.playerActions}>
        <TouchableOpacity style={styles.messageButton}>
          <MessageCircle size={16} color="#007AFF" strokeWidth={2} />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.connectButton}>
          <UserPlus size={16} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Players</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color="#1C1C1E" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={24} color="#1C1C1E" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Availability Toggle */}
      <View style={styles.availabilitySection}>
        <TouchableOpacity
          style={[
            styles.availabilityToggle,
            isAvailable && styles.availabilityToggleActive,
          ]}
          onPress={() => setIsAvailable(!isAvailable)}>
          <View style={[
            styles.availabilityDot,
            isAvailable && styles.availabilityDotActive,
          ]} />
          <Text style={[
            styles.availabilityText,
            isAvailable && styles.availabilityTextActive,
          ]}>
            {isAvailable ? "I'm available to play" : "Set yourself as available"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'map' && styles.viewModeButtonActive,
          ]}
          onPress={() => setViewMode('map')}>
          <Map size={16} color={viewMode === 'map' ? '#FFFFFF' : '#8E8E93'} strokeWidth={2} />
          <Text style={[
            styles.viewModeText,
            viewMode === 'map' && styles.viewModeTextActive,
          ]}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'list' && styles.viewModeButtonActive,
          ]}
          onPress={() => setViewMode('list')}>
          <List size={16} color={viewMode === 'list' ? '#FFFFFF' : '#8E8E93'} strokeWidth={2} />
          <Text style={[
            styles.viewModeText,
            viewMode === 'list' && styles.viewModeTextActive,
          ]}>List</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color="#8E8E93" strokeWidth={2} />
            <Text style={styles.mapPlaceholderText}>Map view coming soon</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              Interactive map with nearby players and courts
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
          <View style={styles.playersContainer}>
            <Text style={styles.playersCount}>{nearbyPlayers.length} players nearby</Text>
            {nearbyPlayers.map(renderPlayerCard)}
          </View>
        </ScrollView>
      )}
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
  availabilitySection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  availabilityToggleActive: {
    backgroundColor: '#E8F5E8',
  },
  availabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8E8E93',
  },
  availabilityDotActive: {
    backgroundColor: '#34C759',
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  availabilityTextActive: {
    color: '#34C759',
  },
  viewModeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  viewModeButtonActive: {
    backgroundColor: '#FF6B35',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  playersList: {
    flex: 1,
  },
  playersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  playersCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 16,
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  playerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  metaSeparator: {
    fontSize: 14,
    color: '#8E8E93',
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  lastActiveText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  playStyleText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
    marginBottom: 16,
  },
  playerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    gap: 8,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  connectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    gap: 8,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});