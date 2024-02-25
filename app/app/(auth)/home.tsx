import {
  useCurrentUser,
  useSignup,
} from '@/hooks/user';
import {
  useAuth,
} from '@clerk/clerk-expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const HomePage = () => {
  const { signOut } = useAuth();

  const { user, isLoading, refetch } = useCurrentUser();
  const { mutateAsync } = useSignup();
  return (
    <View style={styles.container}>
      {isLoading ? <Text>Loading</Text> : <Text>{JSON.stringify(user)}</Text>}
      <Text onPress={() => refetch()}>fetch</Text>
      <Text
        onPress={async () => {
          await mutateAsync({
            firstName: 'Parker 2',
          });
        }}
      >
        Basic Mutation
      </Text>
      <Text onPress={() => signOut()}>sign out</Text>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
