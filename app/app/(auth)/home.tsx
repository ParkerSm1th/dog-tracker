import {
  useCurrentUser,
  useSignup,
} from '@/hooks/user';
import {
  useAuth,
} from '@clerk/clerk-expo';
import {
  Link,
} from 'expo-router';
import React from 'react';
import {
  Text,
  View,
} from 'react-native';

const HomePage = () => {
  const { signOut } = useAuth();

  const { user, isLoading, refetch } = useCurrentUser();
  const { mutateAsync } = useSignup();
  return (
    <View className='text-white p-4'>
      <Text className='text-white'>Authenticated Home</Text>
      {isLoading
        ? <Text>Loading</Text>
        : <Text className='text-white'>{JSON.stringify(user)}</Text>}
      <Text className='text-white' onPress={() => refetch()}>fetch</Text>
      <Text
        className='text-white'
        onPress={async () => {
          await mutateAsync({
            firstName: 'Parker',
          });
        }}
      >
        Basic Mutation
      </Text>
      <Link href='/info' className='text-white'>
        Onboarding
      </Link>
      <Text className='text-white' onPress={() => signOut()}>sign out</Text>
    </View>
  );
};

export default HomePage;
