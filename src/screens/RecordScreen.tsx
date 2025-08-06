import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, spacing, radius, shadows, useTheme } from '../theme';

const { width, height } = Dimensions.get('window');

type RecordingState = 'setup' | 'recording' | 'recorded' | 'review';

export default function RecordScreen() {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>('setup');
  const [countdown, setCountdown] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showTagModal, setShowTagModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const cameraRef = useRef<Camera>(null);
  const recordingInterval = useRef<NodeJS.Timeout>();
  const countdownInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  const startCountdown = () => {
    setCountdown(3);
    setRecordingState('recording');
    
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current!);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      try {
        const video = await cameraRef.current.recordAsync();
        console.log('Recording saved to:', video.uri);
      } catch (error) {
        console.error('Recording failed:', error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      setRecordingState('review');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const saveSession = () => {
    // Save session logic here
    Alert.alert('Success', 'Session saved to library!');
    resetRecording();
  };

  const uploadForAnalysis = () => {
    // Upload for analysis logic here
    Alert.alert('Success', 'Session uploaded for AI analysis!');
    resetRecording();
  };

  const resetRecording = () => {
    setRecordingState('setup');
    setRecordingTime(0);
    setCountdown(0);
    setNotes('');
    setTags([]);
    setNewTag('');
  };

  const renderCameraGuide = () => (
    <View style={styles.guideOverlay}>
      <View style={styles.guideContainer}>
        <View style={styles.phoneFrame} />
        <Text style={styles.guideTitle}>Position Your Phone</Text>
        <Text style={styles.guideText}>
          • Place phone horizontally about 6-8 feet away{'\n'}
          • Keep the court baseline in view{'\n'}
          • Ensure good lighting{'\n'}
          • Check that you're clearly visible
        </Text>
      </View>
    </View>
  );

  const renderRecordingOverlay = () => (
    <View style={styles.recordingOverlay}>
      {countdown > 0 && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}
      
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>
            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      )}
    </View>
  );

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      {recordingState === 'setup' && (
        <>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
          >
            <Ionicons name="camera-reverse" size={24} color={colors.foreground} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recordButton} onPress={startCountdown}>
            <View style={styles.recordButtonInner} />
          </TouchableOpacity>
          
          <View style={styles.placeholder} />
        </>
      )}
      
      {recordingState === 'recording' && isRecording && (
        <>
          <View style={styles.placeholder} />
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <View style={styles.stopButtonInner} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </>
      )}
    </View>
  );

  const renderReviewModal = () => (
    <Modal visible={recordingState === 'review'} animationType="slide">
      <View style={styles.reviewContainer}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Session Recorded!</Text>
          <TouchableOpacity onPress={resetRecording}>
            <Ionicons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoPreview}>
          <Text style={styles.previewText}>Video Preview</Text>
          <Text style={styles.previewDuration}>
            Duration: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
          </Text>
        </View>
        
        <View style={styles.sessionDetails}>
          <Text style={styles.sectionLabel}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes about this session..."
            placeholderTextColor={colors.mutedForeground}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
          
          <View style={styles.tagsSection}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add tag..."
                placeholderTextColor={colors.mutedForeground}
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Ionicons name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Ionicons name="close" size={14} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.reviewActions}>
          <TouchableOpacity style={styles.saveButton} onPress={saveSession}>
            <Ionicons name="folder-outline" size={20} color={colors.secondaryForeground} />
            <Text style={styles.saveButtonText}>Save to Library</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.analyzeButton} onPress={uploadForAnalysis}>
            <Ionicons name="analytics" size={20} color={colors.primaryForeground} />
            <Text style={styles.analyzeButtonText}>Upload for AI Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={colors.mutedForeground} />
        <Text style={styles.permissionText}>Camera access is required to record sessions</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        {recordingState === 'setup' && renderCameraGuide()}
        {recordingState === 'recording' && renderRecordingOverlay()}
      </Camera>
      
      {renderControls()}
      {renderReviewModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing[4],
  },
  permissionText: {
    fontSize: fontSizes.lg,
    color: colors.foreground,
    textAlign: 'center',
    marginVertical: spacing[4],
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
  },
  permissionButtonText: {
    color: colors.primaryForeground,
    fontSize: fontSizes.base,
    fontWeight: '600',
  },
  guideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideContainer: {
    backgroundColor: colors.card,
    padding: spacing[6],
    borderRadius: radius.lg,
    margin: spacing[4],
    alignItems: 'center',
  },
  phoneFrame: {
    width: 60,
    height: 100,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: radius.md,
    marginBottom: spacing[4],
  },
  guideTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing[3],
  },
  guideText: {
    fontSize: fontSizes.base,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
  },
  recordingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(243, 148, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: fontSizes['5xl'],
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 60,
    left: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    marginRight: spacing[2],
  },
  recordingText: {
    color: 'white',
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonInner: {
    width: 40,
    height: 40,
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 50,
  },
  reviewContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reviewTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.foreground,
  },
  videoPreview: {
    height: 200,
    backgroundColor: colors.muted,
    margin: spacing[4],
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: fontSizes.lg,
    color: colors.mutedForeground,
    marginBottom: spacing[2],
  },
  previewDuration: {
    fontSize: fontSizes.base,
    color: colors.primary,
    fontWeight: '600',
  },
  sessionDetails: {
    padding: spacing[4],
  },
  sectionLabel: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing[2],
  },
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing[3],
    fontSize: fontSizes.base,
    color: colors.foreground,
    minHeight: 80,
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagsSection: {
    marginBottom: spacing[4],
  },
  addTagContainer: {
    flexDirection: 'row',
    marginBottom: spacing[3],
  },
  tagInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing[3],
    fontSize: fontSizes.base,
    color: colors.foreground,
    marginRight: spacing[2],
    borderWidth: 1,
    borderColor: colors.border,
  },
  addTagButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing[3],
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    marginRight: spacing[2],
    marginBottom: spacing[2],
  },
  tagText: {
    fontSize: fontSizes.sm,
    color: colors.secondaryForeground,
    marginRight: spacing[1],
  },
  reviewActions: {
    padding: spacing[4],
    gap: spacing[3],
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: spacing[4],
    borderRadius: radius.md,
  },
  saveButtonText: {
    fontSize: fontSizes.base,
    color: colors.secondaryForeground,
    fontWeight: '600',
    marginLeft: spacing[2],
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing[4],
    borderRadius: radius.md,
  },
  analyzeButtonText: {
    fontSize: fontSizes.base,
    color: colors.primaryForeground,
    fontWeight: '600',
    marginLeft: spacing[2],
  },
});
