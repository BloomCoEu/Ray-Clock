import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { appwriteConfig } from '@/lib/appwrite-service';
import { useAppStore } from '@/lib/store';
import type { Settings, User } from '@/lib/types';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const setSettings = useAppStore((state) => state.setSettings);

  const handleSubmit = async () => {
    if (!appwriteConfig.isValid) {
      Alert.alert(
        'Appwrite not configured',
        `Missing env vars: ${appwriteConfig.missingKeys.join(', ')}`
      );
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setIsLoading(true);
      
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || `${isLogin ? 'Login' : 'Signup'} failed. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    const demoUser: User = {
      $id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
    };
    const demoSettings: Settings = {
      userId: demoUser.$id,
      defaultTime: 15,
      accentColor: '#10B981',
      theme: 'auto',
      smartTimeDetection: true,
      pieTimerEnabled: false,
    };
    setUser(demoUser);
    setSettings(demoSettings);
    onLoginSuccess();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>⏰ Ray Clock</Text>
          <Text style={styles.subtitle}>Time management made simple</Text>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  placeholderTextColor="#999"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchButtonText}>
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Log in'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            {!appwriteConfig.isValid && (
              <View style={styles.configWarning}>
                <Text style={styles.configTitle}>Appwrite config missing</Text>
                <Text style={styles.configText}>
                  {appwriteConfig.missingKeys.join(', ')}
                </Text>
              </View>
            )}
            {!appwriteConfig.isValid && (
              <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
                <Text style={styles.previewButtonText}>Continue in demo mode</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.footerText}>
              Note: You need to configure Appwrite first
            </Text>
            <Text style={styles.footerLink}>
              See setup instructions in the repository
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  switchButtonText: {
    color: '#10B981',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
  },
  previewButton: {
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  previewButtonText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  configWarning: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  configTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 4,
  },
  configText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerLink: {
    fontSize: 12,
    color: '#10B981',
    textAlign: 'center',
  },
});
