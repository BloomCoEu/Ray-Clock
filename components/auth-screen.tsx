import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { YStack, Text, Button, Input } from 'tamagui';
import { useAuth } from '@/hooks/use-auth';
import { appwriteConfig } from '@/lib/appwrite-service';

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack flex={1} justifyContent="center" paddingHorizontal="$6" paddingVertical="$10" backgroundColor="white">
          <Text fontSize={48} fontWeight="700" textAlign="center" marginBottom="$2">
            ⏰ Ray Clock
          </Text>
          <Text fontSize="$5" color="$gray11" textAlign="center" marginBottom="$10">
            Time management made simple
          </Text>

          <YStack gap="$5" marginBottom="$8">
            {!isLogin && (
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$gray12">Name</Text>
                <Input
                  size="$4"
                  placeholder="Your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  borderColor="$gray5"
                  borderWidth={1}
                />
              </YStack>
            )}

            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$gray12">Email</Text>
              <Input
                size="$4"
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                borderColor="$gray5"
                borderWidth={1}
              />
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$4" fontWeight="600" color="$gray12">Password</Text>
              <Input
                size="$4"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                borderColor="$gray5"
                borderWidth={1}
              />
            </YStack>

            <Button
              size="$5"
              backgroundColor="$green10"
              onPress={handleSubmit}
              disabled={isLoading}
              opacity={isLoading ? 0.6 : 1}
              marginTop="$2"
            >
              <Text color="white" fontWeight="600" fontSize="$5">
                {isLoading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
              </Text>
            </Button>

            <Button
              size="$3"
              backgroundColor="transparent"
              onPress={() => setIsLogin(!isLogin)}
              marginTop="$4"
            >
              <Text color="$green10">
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Log in'}
              </Text>
            </Button>
          </YStack>

          <YStack alignItems="center">
            {!appwriteConfig.isValid && (
              <YStack
                backgroundColor="#FEF3C7"
                borderColor="#F59E0B"
                borderWidth={1}
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$3"
                marginBottom="$3"
              >
                <Text fontSize="$2" fontWeight="600" color="#92400E" textAlign="center" marginBottom="$1">
                  Appwrite config missing
                </Text>
                <Text fontSize="$2" color="#92400E" textAlign="center">
                  {appwriteConfig.missingKeys.join(', ')}
                </Text>
              </YStack>
            )}
            <Text fontSize="$2" color="$gray10" textAlign="center" marginBottom="$1">
              Note: You need to configure Appwrite first
            </Text>
            <Text fontSize="$2" color="$green10" textAlign="center">
              See setup instructions in the repository
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
