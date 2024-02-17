import {
  ClerkProvider,
  useAuth,
} from '@clerk/clerk-expo';
import {
  Slot,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  useEffect,
} from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const tokenCache = {
  async getToken(token: string) {
    try {
      return SecureStore.getItemAsync(token);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      throw new Error('Could not save token');
    }
  },
};

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inProtectedRoute = segments[0] === '(auth)';

    if (isSignedIn && !inProtectedRoute) {
      router.push('/home');
    } else if (!isSignedIn) {
      router.push('/login');
    }
  }, [isSignedIn, isLoaded, router, segments]);

  return <Slot />;
};

const RootLayoutNav = () => (
  <ClerkProvider
    publishableKey={CLERK_PUBLISHABLE_KEY!}
    tokenCache={tokenCache}
  >
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={'#000'}
        barStyle={'dark-content'}
      />
      <InitialLayout />
    </SafeAreaView>
  </ClerkProvider>
);

export default RootLayoutNav;
