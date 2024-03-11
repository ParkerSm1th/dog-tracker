import {
  useSignIn,
  useSignUp,
} from '@clerk/clerk-expo';
import type {
  PhoneCodeFactor,
  SignInFirstFactor,
} from '@clerk/types';
import clsx from 'clsx';
import {
  useRouter,
} from 'expo-router';
import React, {
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInRight,
} from 'react-native-reanimated';

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignupLoaded } = useSignUp();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const router = useRouter();

  const nextDisabled = useMemo(() => {
    if (loading) {
      return true;
    }
    if (pendingVerification) {
      return verificationCode.length < 6;
    }
    return phoneNumber.length < 10;
  }, [loading, pendingVerification, phoneNumber, verificationCode]);

  const onSignInPress = async () => {
    if (!isLoaded || !isSignupLoaded || nextDisabled) {
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

  const onVerifyPress = async (value?: string) => {
    if (!isLoaded || !isSignupLoaded) {
      return;
    }
    setLoading(true);
    try {
      if (signingUp) {
        await signUp.attemptPhoneNumberVerification({
          code: value ?? verificationCode,
        });

        await setSignUpActive({ session: signUp.createdSessionId });
        router.push('/info');
        return;
      }
      const completeSignIn = await signIn.attemptFirstFactor({
        code: value ?? verificationCode,
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

  return (
    <Animated.View entering={FadeInRight}>
      <KeyboardAvoidingView behavior='padding'>
        <View className='pt-40 mx-6 flex flex-col justify-between h-full pb-16'>
          <View className='flex flex-col gap-2'>
            <Text className='text-4xl text-white font-bold w-[320px]'>
              {pendingVerification
                ? 'Enter your verification code'
                : 'Let\'s start with a phone number'}
            </Text>
          </View>
          <View className='gap-4'>
            {pendingVerification
              ? (
                <TextInput
                  autoCapitalize='none'
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  value={verificationCode}
                  onChangeText={(value) => {
                    setVerificationCode(value);
                    if (value.length === 6) {
                      onVerifyPress(value);
                    }
                  }}
                  inputMode='numeric'
                  autoComplete='sms-otp'
                  key='verificationCode'
                  className='bg-[#272727] rounded-xl py-2 pb-2 text-white text-center text-2xl'
                />
              )
              : (
                <TextInput
                  autoCapitalize='none'
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  inputMode='tel'
                  autoComplete='tel'
                  key='phone'
                  className='bg-[#272727] rounded-xl py-2 pb-2 text-white text-center text-2xl'
                />
              )}
            <View className='flex flex-row w-full justify-between gap-2'>
              <TouchableOpacity
                onPress={() => router.push('/start')}
                className='bg-[#272727] rounded-xl font-bold flex items-center w-24'
              >
                <Text className='p-2 py-4 text-center text-white w-full text-xl font-bold'>
                  Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pendingVerification
                  ? () => {
                    if (nextDisabled) {
                      return;
                    }
                    // Must separate this out for auto-submit
                    onVerifyPress();
                  }
                  : onSignInPress}
                className={clsx('bg-[#272727] rounded-xl font-bold flex items-center w-24', {
                  'opacity-50': nextDisabled,
                })}
              >
                {loading
                  ? (
                    <View className='items-center pt-4'>
                      <ActivityIndicator color='white' />
                    </View>
                  )
                  : (
                    <Text className='p-2 py-4 text-center text-white w-full text-xl font-bold'>
                      Next
                    </Text>
                  )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default Login;
