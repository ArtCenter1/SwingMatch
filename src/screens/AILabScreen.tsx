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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, spacing, radius, shadows, useTheme } from '../theme';
import { mockSessions, mockProPlayers, mockAnalyses } from '../data/mockData';
import { VideoSession, ProPlayer } from '../types';

const { width } = Dimensions.get('window');

type AnalysisType = 'stroke_analysis' | 'pro_comparison' | 'pro_emulation';

export default function AILabScreen() {
  const { colors } = useTheme();
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType | null>(null);
  const [selectedSession, setSelectedSession] = useState<VideoSession | null>(null);
  const [selectedPro, setSelectedPro] = useState<ProPlayer | null>(null);
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [showProPicker, setShowProPicker] = useState(false);

  const analysisOptions = [
    {
      type: 'stroke_analysis' as AnalysisType,
      title: 'Stroke Analysis',
      description: 'AI-powered biomechanical analysis of your technique',
      icon: 'analytics',
      color: colors.primary,
    },
    {
      type: 'pro_comparison' as AnalysisType,
      title: 'Pro Comparison',
      description: 'Compare your technique to professional players',
      icon: 'people',
      color: '#3498db',
    },
    {
      type: 'pro_emulation' as AnalysisType,
      title: 'Pro Emulation',
      description: 'Generate corrected version emulating pro technique',
      icon: 'star',
      color: '#9b59b6',
    },
  ];

  const renderDashboard = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Lab</Text>
        <Text style={styles.headerSubtitle}>
          Advanced AI analysis for tennis technique improvement
        </Text>
      </View>

      <View style={styles.analysisOptions}>
        {analysisOptions.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[styles.analysisCard, { borderLeftColor: option.color }]}
            onPress={() => handleAnalysisSelection(option.type)}
          >
            <View style={[styles.analysisIcon, { backgroundColor: option.color }]}>
              <Ionicons
                name={option.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color="white"
              />
            </View>
            <View style={styles.analysisContent}>
              <Text style={styles.analysisTitle}>{option.title}</Text>
              <Text style={styles.analysisDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.recentAnalyses}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Analyses</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {mockAnalyses.map((analysis) => {
          const session = mockSessions.find(s => s.id === analysis.sessionId);
          if (!session) return null;
          
          return (
            <TouchableOpacity key={analysis.id} style={styles.analysisResultCard}>
              <Image source={{ uri: session.thumbnail }} style={styles.resultThumbnail} />
              <View style={styles.resultContent}>
                <Text style={styles.resultTitle}>{session.title}</Text>
                <Text style={styles.resultType}>
                  {analysis.type.replace('_', ' ').toUpperCase()}
                </Text>
                <View style={styles.resultMeta}>
                  <View style={[styles.statusDot, {
                    backgroundColor: analysis.status === 'completed' ? colors.primary : colors.mutedForeground
                  }]} />
                  <Text style={styles.resultStatus}>
                    {analysis.status === 'completed' ? 'Complete' : 'Processing'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.proLibraryPreview}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pro Player Library</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Browse All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mockProPlayers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.proCard}>
              <Image source={{ uri: item.avatar }} style={styles.proAvatar} />
              <Text style={styles.proName}>{item.name}</Text>
              <Text style={styles.proStyle}>{item.playingStyle}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.proList}
        />
      </View>
    </ScrollView>
  );

  const handleAnalysisSelection = (type: AnalysisType) => {
    setSelectedAnalysis(type);
    setShowSessionPicker(true);
  };

  const handleSessionSelection = (session: VideoSession) => {
    setSelectedSession(session);
    setShowSessionPicker(false);
    
    if (selectedAnalysis === 'stroke_analysis') {
      startStrokeAnalysis(session);
    } else {
      setShowProPicker(true);
    }
  };

  const handleProSelection = (pro: ProPlayer) => {
    setSelectedPro(pro);
    setShowProPicker(false);
    
    if (selectedAnalysis === 'pro_comparison') {
      startProComparison(selectedSession!, pro);
    } else if (selectedAnalysis === 'pro_emulation') {
      startProEmulation(selectedSession!, pro);
    }
  };

  const startStrokeAnalysis = (session: VideoSession) => {
    // Start stroke analysis
    console.log('Starting stroke analysis for:', session.title);
    // Reset selections
    setSelectedAnalysis(null);
    setSelectedSession(null);
  };

  const startProComparison = (session: VideoSession, pro: ProPlayer) => {
    // Start pro comparison
    console.log('Starting pro comparison:', session.title, 'vs', pro.name);
    // Reset selections
    setSelectedAnalysis(null);
    setSelectedSession(null);
    setSelectedPro(null);
  };

  const startProEmulation = (session: VideoSession, pro: ProPlayer) => {
    // Start pro emulation
    console.log('Starting pro emulation:', session.title, 'emulating', pro.name);
    // Reset selections
    setSelectedAnalysis(null);
    setSelectedSession(null);
    setSelectedPro(null);
  };

  const renderSessionPicker = () => (
    <Modal visible={showSessionPicker} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Session</Text>
          <TouchableOpacity onPress={() => setShowSessionPicker(false)}>
            <Ionicons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mockSessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sessionPickerCard}
              onPress={() => handleSessionSelection(item)}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.pickerThumbnail} />
              <View style={styles.pickerContent}>
                <Text style={styles.pickerTitle}>{item.title}</Text>
                <Text style={styles.pickerDate}>
                  {item.date.toLocaleDateString()}
                </Text>
                <View style={styles.pickerTags}>
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <View key={index} style={styles.pickerTag}>
                      <Text style={styles.pickerTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );

  const renderProPicker = () => (
    <Modal visible={showProPicker} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Professional Player</Text>
          <TouchableOpacity onPress={() => setShowProPicker(false)}>
            <Ionicons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mockProPlayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.proPickerCard}
              onPress={() => handleProSelection(item)}
            >
              <Image source={{ uri: item.avatar }} style={styles.proPickerAvatar} />
              <View style={styles.pickerContent}>
                <Text style={styles.pickerTitle}>{item.name}</Text>
                <Text style={styles.proPickerStyle}>{item.playingStyle}</Text>
                <View style={styles.proCharacteristics}>
                  {item.physicalCharacteristics.slice(0, 2).map((char, index) => (
                    <Text key={index} style={styles.characteristicText}>
                      {char}
                    </Text>
                  ))}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderDashboard()}
      {renderSessionPicker()}
      {renderProPicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing[4],
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSizes['3xl'],
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: fontSizes.base,
    color: colors.mutedForeground,
  },
  analysisOptions: {
    padding: spacing[4],
  },
  analysisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    borderLeftWidth: 4,
    ...shadows.md,
  },
  analysisIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  analysisContent: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  analysisDescription: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
  },
  recentAnalyses: {
    padding: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.foreground,
  },
  seeAllText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  analysisResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing[3],
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  resultThumbnail: {
    width: 60,
    height: 40,
    borderRadius: radius.sm,
    marginRight: spacing[3],
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  resultType: {
    fontSize: fontSizes.xs,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing[1],
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing[1],
  },
  resultStatus: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
  },
  proLibraryPreview: {
    padding: spacing[4],
  },
  proList: {
    paddingLeft: spacing[4],
  },
  proCard: {
    alignItems: 'center',
    marginRight: spacing[4],
    width: 100,
  },
  proAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: spacing[2],
  },
  proName: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  proStyle: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    textAlign: 'center',
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
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.foreground,
  },
  sessionPickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerThumbnail: {
    width: 80,
    height: 60,
    borderRadius: radius.md,
    marginRight: spacing[3],
  },
  pickerContent: {
    flex: 1,
  },
  pickerTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  pickerDate: {
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    marginBottom: spacing[2],
  },
  pickerTags: {
    flexDirection: 'row',
  },
  pickerTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    marginRight: spacing[2],
  },
  pickerTagText: {
    fontSize: fontSizes.xs,
    color: colors.accentForeground,
  },
  proPickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  proPickerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing[3],
  },
  proPickerStyle: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing[2],
  },
  proCharacteristics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  characteristicText: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
    marginRight: spacing[2],
  },
});
