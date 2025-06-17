import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { X, FlipHorizontal, Circle, Square, Settings, Zap, CircleCheck as CheckCircle, CircleHelp as HelpCircle, Wifi } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const strokeTypes = [
  { id: 'forehand', name: 'Forehand', color: '#34D399' },
  { id: 'backhand', name: 'Backhand', color: '#3B82F6' },
  { id: 'serve', name: 'Serve', color: '#8B5CF6' },
  { id: 'volley', name: 'Volley', color: '#F59E0B' },
];

export default function Record() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedStroke, setSelectedStroke] = useState('forehand');
  const [recordingMode, setRecordingMode] = useState<'audio-guided' | 'manual'>('audio-guided');
  const [showSettings, setShowSettings] = useState(false);
  const [courtDetected, setCourtDetected] = useState(true);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Circle size={48} color="#34D399" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            SwingMatch needs camera access to record and analyze your tennis strokes.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording duration
    setTimeout(() => {
      setIsRecording(false);
      Alert.alert(
        'Recording Complete',
        'Your stroke has been recorded and will be analyzed.',
        [
          { text: 'Record Another', style: 'cancel' },
          { text: 'View Analysis', onPress: () => {} }
        ]
      );
    }, 3000);
  };

  const renderCourtOverlay = () => (
    <View style={styles.overlayContainer}>
      {/* Court boundary overlay */}
      <View style={styles.courtOverlay}>
        <View style={[styles.courtBoundary, courtDetected && styles.courtDetected]} />
        <View style={styles.centerLine} />
        <View style={styles.serviceBoxes}>
          <View style={styles.serviceBox} />
          <View style={styles.serviceBox} />
        </View>
      </View>
      
      {/* Position indicator */}
      <View style={styles.positionIndicator}>
        {courtDetected ? (
          <CheckCircle size={20} color="#34D399" />
        ) : (
          <HelpCircle size={20} color="#F59E0B" />
        )}
        <Text style={[
          styles.positionText,
          { color: courtDetected ? '#34D399' : '#F59E0B' }
        ]}>
          {courtDetected ? 'Perfect Position' : 'Adjust Position'}
        </Text>
      </View>
    </View>
  );

  const renderRecordingUI = () => (
    <View style={styles.recordingOverlay}>
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>RECORDING</Text>
          <Text style={styles.recordingTimer}>00:03</Text>
        </View>
      )}
      
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.controlButton}>
          <X size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              recordingMode === 'audio-guided' && styles.activeModeButton
            ]}
            onPress={() => setRecordingMode('audio-guided')}
          >
            <Text style={[
              styles.modeText,
              recordingMode === 'audio-guided' && styles.activeModeText
            ]}>
              Audio-Guided
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              recordingMode === 'manual' && styles.activeModeButton
            ]}
            onPress={() => setRecordingMode('manual')}
          >
            <Text style={[
              styles.modeText,
              recordingMode === 'manual' && styles.activeModeText
            ]}>
              Manual
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setShowSettings(!showSettings)}
        >
          <Settings size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBottomControls = () => (
    <View style={styles.bottomControls}>
      {/* Stroke type selector */}
      <View style={styles.strokeSelector}>
        {strokeTypes.map((stroke) => (
          <TouchableOpacity
            key={stroke.id}
            style={[
              styles.strokeButton,
              selectedStroke === stroke.id && { backgroundColor: stroke.color }
            ]}
            onPress={() => setSelectedStroke(stroke.id)}
          >
            <Text style={[
              styles.strokeButtonText,
              selectedStroke === stroke.id && styles.activeStrokeText
            ]}>
              {stroke.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Camera controls */}
      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.tutorialButton}>
          <HelpCircle size={24} color="white" />
          <Text style={styles.tutorialText}>Tutorial</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={startRecording}
          disabled={isRecording}
        >
          {isRecording ? (
            <Square size={32} color="white" />
          ) : (
            <Circle size={32} color="white" />
          )}
        </TouchableOpacity>
        
        <View style={styles.rightControls}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <FlipHorizontal size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.zoomText}>1.0x</Text>
        </View>
      </View>
      
      {/* Connection status */}
      <View style={styles.connectionStatus}>
        <Wifi size={16} color="#34D399" />
        <Text style={styles.connectionText}>Remote Connected</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        {renderCourtOverlay()}
        {renderRecordingUI()}
      </CameraView>
      {renderBottomControls()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  permissionIcon: {
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#34D399',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courtOverlay: {
    position: 'relative',
    width: width * 0.8,
    height: height * 0.4,
  },
  courtBoundary: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
  },
  courtDetected: {
    borderColor: '#34D399',
    borderWidth: 3,
  },
  centerLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  serviceBoxes: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    right: '25%',
    bottom: '25%',
    flexDirection: 'row',
  },
  serviceBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
  },
  positionIndicator: {
    position: 'absolute',
    top: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  positionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  recordingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginRight: 8,
  },
  recordingTimer: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 4,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeModeButton: {
    backgroundColor: 'rgba(52, 211, 153, 0.9)',
  },
  modeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeModeText: {
    color: 'white',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  strokeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  strokeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  strokeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeStrokeText: {
    color: 'white',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tutorialButton: {
    alignItems: 'center',
    width: 60,
  },
  tutorialText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginTop: 4,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordingButton: {
    backgroundColor: 'rgba(220, 38, 38, 1)',
  },
  rightControls: {
    alignItems: 'center',
    width: 60,
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  zoomText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#34D399',
    marginLeft: 6,
  },
});