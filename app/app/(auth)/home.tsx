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
  const { getToken } = useAuth();

  const fetchDataFromExternalResource = async () => {
    const token = await getToken();
    // fetch your data
    console.log(token);
  };

  return (
    <View style={styles.container}>
      <Text onPress={fetchDataFromExternalResource}>home</Text>
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
