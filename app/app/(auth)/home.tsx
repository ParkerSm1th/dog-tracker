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
  const { getToken, signOut } = useAuth();

  const fetchDataFromExternalResource = async () => {
    const token = await getToken();
    // fetch your data
    console.log(token);
  };

  return (
    <View style={styles.container}>
      <Text onPress={fetchDataFromExternalResource}>home</Text>
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
