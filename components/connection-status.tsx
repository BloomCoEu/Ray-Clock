import { useState, useEffect, useCallback } from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { connectionService } from '@/lib/appwrite-service';

interface ConnectionStatusProps {
  accentColor?: string;
}

export function ConnectionStatus({ accentColor = '#10B981' }: ConnectionStatusProps) {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    error: string | null;
    missingKeys: string[];
  } | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await connectionService.validateConnection();
      setStatus(result);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  if (isChecking) {
    return (
      <XStack
        alignItems="center"
        gap="$2"
        padding="$3"
        backgroundColor="$gray3"
        borderRadius="$3"
      >
        <Ionicons name="sync" size={16} color="#666" />
        <Text fontSize="$2" color="$gray11">Checking connection...</Text>
      </XStack>
    );
  }

  if (!status) {
    return null;
  }

  if (status.isConnected) {
    return (
      <XStack
        alignItems="center"
        gap="$2"
        padding="$3"
        backgroundColor="$green2"
        borderRadius="$3"
        borderWidth={1}
        borderColor="$green6"
      >
        <Ionicons name="checkmark-circle" size={16} color={accentColor} />
        <Text fontSize="$2" color="$green11" fontWeight="500">
          Connected to Appwrite
        </Text>
      </XStack>
    );
  }

  return (
    <YStack
      gap="$2"
      padding="$3"
      backgroundColor="$orange2"
      borderRadius="$3"
      borderWidth={1}
      borderColor="$orange6"
    >
      <XStack alignItems="center" gap="$2">
        <Ionicons name="warning" size={16} color="#f97316" />
        <Text fontSize="$2" color="$orange11" fontWeight="500">
          Appwrite Not Connected
        </Text>
      </XStack>
      {status.missingKeys.length > 0 && (
        <Text fontSize="$1" color="$orange11">
          Missing configuration: {status.missingKeys.join(', ')}
        </Text>
      )}
      {status.error && (
        <Text fontSize="$1" color="$orange11">
          {status.error}
        </Text>
      )}
      <Text fontSize="$1" color="$orange11">
        Please check your .env file and follow the setup guide in APPWRITE_SETUP.md
      </Text>
    </YStack>
  );
}
