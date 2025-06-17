import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Target, TrendingUp, Users, ArrowRight, CircleCheck as CheckCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: 1,
    title: 'AI-Powered Analysis',
    subtitle: 'Advanced stroke analysis using computer vision',
    description: 'Record your tennis strokes and get instant feedback with detailed biomechanical analysis powered by AI.',
    icon: Target,
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg'
  },
  {
    id: 2,
    title: 'Compare with Pros',
    subtitle: 'Learn from the best players in the world',
    description: 'Side-by-side comparison with professional players to understand optimal technique and timing.',
    icon: Users,
    image: 'https://images.pexels.com/photos/622279/pexels-photo-622279.jpeg'
  },
  {
    id: 3,
    title: 'Track Your Progress',
    subtitle: 'See your improvement over time',
    description: 'Detailed analytics and progress tracking to monitor your development and celebrate achievements.',
    icon: TrendingUp,
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg'
  }
];

const skillLevels = [
  { id: 'beginner', title: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', title: 'Intermediate', description: 'Playing for a while' },
  { id: 'advanced', title: 'Advanced', description: 'Competitive player' },
  { id: 'professional', title: 'Professional', title: 'Tournament level' }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [selectedHand, setSelectedHand] = useState('');

  const handleNext = () => {
    if (currentStep < onboardingSteps.length + 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkipToMain = () => {
    router.replace('/(tabs)');
  };

  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <LinearGradient
        colors={['#34D399', '#059669']}
        style={styles.welcomeHeader}
      >
        <View style={styles.logoContainer}>
          <Play size={40} color="white" />
          <Text style={styles.logoText}>SwingMatch</Text>
        </View>
        <Text style={styles.welcomeTitle}>Welcome to the future of tennis coaching</Text>
        <Text style={styles.welcomeSubtitle}>AI-powered analysis, professional comparisons, and personalized improvement</Text>
      </LinearGradient>
      
      <View style={styles.welcomeContent}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleSkipToMain}>
          <Text style={styles.secondaryButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeatureStep = () => {
    const step = onboardingSteps[currentStep - 1];
    const IconComponent = step.icon;
    
    return (
      <View style={styles.stepContainer}>
        <Image source={{ uri: step.image }} style={styles.featureImage} />
        <View style={styles.featureContent}>
          <View style={styles.iconContainer}>
            <IconComponent size={32} color="#34D399" />
          </View>
          <Text style={styles.featureTitle}>{step.title}</Text>
          <Text style={styles.featureSubtitle}>{step.subtitle}</Text>
          <Text style={styles.featureDescription}>{step.description}</Text>
        </View>
      </View>
    );
  };

  const renderSkillLevelStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.selectionHeader}>
        <Text style={styles.selectionTitle}>What's your skill level?</Text>
        <Text style={styles.selectionSubtitle}>This helps us personalize your experience</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {skillLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.optionCard,
              selectedSkillLevel === level.id && styles.selectedOption
            ]}
            onPress={() => setSelectedSkillLevel(level.id)}
          >
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionTitle,
                selectedSkillLevel === level.id && styles.selectedOptionText
              ]}>
                {level.title}
              </Text>
              <Text style={[
                styles.optionDescription,
                selectedSkillLevel === level.id && styles.selectedOptionDescription
              ]}>
                {level.description}
              </Text>
            </View>
            {selectedSkillLevel === level.id && (
              <CheckCircle size={24} color="#34D399" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderHandednessStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.selectionHeader}>
        <Text style={styles.selectionTitle}>Which hand do you play with?</Text>
        <Text style={styles.selectionSubtitle}>For better stroke analysis accuracy</Text>
      </View>
      
      <View style={styles.handednessContainer}>
        <TouchableOpacity
          style={[
            styles.handOption,
            selectedHand === 'right' && styles.selectedHand
          ]}
          onPress={() => setSelectedHand('right')}
        >
          <Text style={[
            styles.handText,
            selectedHand === 'right' && styles.selectedHandText
          ]}>
            Right Hand
          </Text>
          {selectedHand === 'right' && (
            <CheckCircle size={24} color="#34D399" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.handOption,
            selectedHand === 'left' && styles.selectedHand
          ]}
          onPress={() => setSelectedHand('left')}
        >
          <Text style={[
            styles.handText,
            selectedHand === 'left' && styles.selectedHandText
          ]}>
            Left Hand
          </Text>
          {selectedHand === 'left' && (
            <CheckCircle size={24} color="#34D399" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStepIndicator = () => {
    const totalSteps = onboardingSteps.length + 3; // features + skill + handedness + welcome
    
    return (
      <View style={styles.stepIndicator}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              index <= currentStep && styles.activeDot
            ]}
          />
        ))}
      </View>
    );
  };

  const canProceed = () => {
    if (currentStep === onboardingSteps.length + 1) return selectedSkillLevel !== '';
    if (currentStep === onboardingSteps.length + 2) return selectedHand !== '';
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentStep === 0 && renderWelcomeStep()}
        {currentStep >= 1 && currentStep <= onboardingSteps.length && renderFeatureStep()}
        {currentStep === onboardingSteps.length + 1 && renderSkillLevelStep()}
        {currentStep === onboardingSteps.length + 2 && renderHandednessStep()}
      </ScrollView>
      
      {currentStep > 0 && (
        <View style={styles.bottomSection}>
          {renderStepIndicator()}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !canProceed() && styles.disabledButton
              ]}
              onPress={handleNext}
              disabled={!canProceed()}
            >
              <Text style={styles.continueButtonText}>
                {currentStep === onboardingSteps.length + 2 ? 'Complete Setup' : 'Continue'}
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    minHeight: height * 0.8,
  },
  welcomeHeader: {
    padding: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginLeft: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  primaryButton: {
    backgroundColor: '#34D399',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginRight: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  featureImage: {
    width: width,
    height: height * 0.4,
    resizeMode: 'cover',
  },
  featureContent: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#34D399',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  selectionHeader: {
    padding: 32,
    alignItems: 'center',
  },
  selectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    padding: 20,
  },
  optionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderColor: '#34D399',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#059669',
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  selectedOptionDescription: {
    color: '#047857',
  },
  handednessContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  handOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedHand: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderColor: '#34D399',
  },
  handText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  selectedHandText: {
    color: '#059669',
  },
  bottomSection: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#34D399',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#34D399',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginRight: 8,
  },
});