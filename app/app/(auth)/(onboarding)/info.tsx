import {
  useAuth,
  useUser,
} from '@clerk/clerk-expo';
import clsx from 'clsx';
import {
  useRouter,
} from 'expo-router';
import React, {
  useMemo,
  useState,
} from 'react';
import {
  Controller,
  useForm,
} from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInRight,
} from 'react-native-reanimated';
import type {
  CreateUserDto,
} from '../../../../common/models';
import {
  OnboardingInput,
} from '../../../components/ui/OnboardingInput';
import {
  useSignup,
} from '../../../hooks/user';

const Info = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    clearErrors,
    watch,
  } = useForm<CreateUserDto>({
    defaultValues: {
      id: user?.id,
      firstName: '',
      lastName: '',
      phoneNumber: user?.phoneNumbers[0].toString() || '',
    },
  });

  const firstNameValue = watch('firstName', '');
  const lastNameValue = watch('lastName', '');

  const { mutateAsync } = useSignup();

  const onSubmit = async (data: CreateUserDto) => {
    setLoading(true);
    try {
      await mutateAsync(data);
      router.push('/home');
    } finally {
      setLoading(false);
    }
  };

  const nextDisabled = useMemo(
    () => loading || firstNameValue.length === 0 || lastNameValue.length === 0,
    [
      loading,
      firstNameValue,
      lastNameValue,
    ],
  );
  return (
    <Animated.View entering={FadeInRight}>
      <KeyboardAvoidingView behavior='padding'>
        <View className='pt-40 mx-6 flex flex-col justify-between h-full pb-16'>
          <View className='flex flex-col gap-2'>
            <Text className='text-4xl text-white font-bold w-[320px]'>
              Let's get to know you
            </Text>
          </View>
          <View className='gap-4'>
            <Controller
              control={control}
              rules={{
                required: 'First Name is required',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <OnboardingInput
                  placeholder={'First Name'}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    clearErrors('firstName');
                  }}
                  value={value}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  autoComplete='given-name'
                />
              )}
              name='firstName'
            />
            <Controller
              control={control}
              rules={{
                required: 'Last Name is required',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <OnboardingInput
                  placeholder={'Last Name'}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    clearErrors('lastName');
                  }}
                  value={value}
                  autoComplete='family-name'
                />
              )}
              name='lastName'
            />
            <View className='flex flex-row w-full justify-between gap-2'>
              <TouchableOpacity
                onPress={() => {
                  signOut();
                }}
                className={'bg-[#272727] rounded-xl font-bold flex items-center w-24'}
              >
                <Text className='p-2 py-4 text-center text-white w-full text-xl font-bold'>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={clsx('bg-[#272727] rounded-xl font-bold flex items-center w-24', {
                  'opacity-50': nextDisabled,
                })}
                onPress={handleSubmit(onSubmit)}
              >
                {loading
                  ? (
                    <View className='items-center py-4'>
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

export default Info;
