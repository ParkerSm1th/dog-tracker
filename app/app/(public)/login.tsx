import {
  useSignIn,
  useSignUp,
} from '@clerk/clerk-expo';
import type {
  PhoneCodeFactor,
  SignInFirstFactor,
} from '@clerk/types';
import React, {
  useState,
} from 'react';
import {
  Button,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignupLoaded } = useSignUp();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || !isSignupLoaded) {
      return;
    }
    setLoading(true);
    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: phoneNumber,
      });

      // Filter the returned array to find the 'phone_code' entry
      const isPhoneCodeFactor = (
        factor: SignInFirstFactor,
      ): factor is PhoneCodeFactor => factor.strategy === 'phone_code';
      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        // Grab the phoneNumberId
        const { phoneNumberId } = phoneCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId,
        });

        // Set 'verifying' true to display second form and capture the OTP code
        setLoading(false);
        setPendingVerification(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.errors[0].code === 'form_identifier_not_found') {
        setSigningUp(true);
        await signUp.create({
          phoneNumber,
        });

        await signUp.preparePhoneNumberVerification();
        setPendingVerification(true);
        return;
      }
      // eslint-disable-next-line no-alert
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !isSignupLoaded) {
      return;
    }
    setLoading(true);
    try {
      if (signingUp) {
        await signUp.attemptPhoneNumberVerification({
          code: verificationCode,
        });

        await setSignUpActive({ session: signUp.createdSessionId });
        return;
      }
      const completeSignIn = await signIn.attemptFirstFactor({
        code: verificationCode,
        strategy: 'phone_code',
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line no-alert
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onResetPress = () => {
    if (!isLoaded || !isSignupLoaded) {
      return;
    }
    setPendingVerification(false);
    setVerificationCode('');
    setPhoneNumber('');
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

      {pendingVerification
        ? (
          <>
            <TextInput
              autoCapitalize='none'
              placeholder='12345'
              value={verificationCode}
              onChangeText={setVerificationCode}
              style={styles.inputField}
              inputMode='numeric'
            />

            <Button onPress={onVerifyPress} title='Verify Code' color={'#6c47ff'} />
            <Button onPress={onResetPress} title='Re-enter phone number' color={'#6c47ff'} />
          </>
        )
        : (
          <>
            <TextInput
              autoCapitalize='none'
              placeholder='(555-555-5555)'
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.inputField}
              inputMode='tel'
            />

            <Button onPress={onSignInPress} title='Login' color={'#6c47ff'} />
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    margin: 8,
    alignItems: 'center',
  },
});

export default Login;
