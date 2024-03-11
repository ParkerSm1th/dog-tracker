import {
  Stack,
} from 'expo-router';
import React from 'react';

export const ProtectedScreen = () => {
  <Stack>
    <Stack.Screen name='home' />
    <Stack.Screen name='info' />
  </Stack>;
};
