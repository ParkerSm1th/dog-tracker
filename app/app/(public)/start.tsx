import {
  useRouter,
} from 'expo-router';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInLeft,
} from 'react-native-reanimated';

const Start = () => {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInLeft}>
      <View className='pt-40 mx-6 flex flex-col justify-between h-full pb-4'>
        <View className='flex flex-col gap-2'>
          <Text className='text-4xl'>🐶</Text>
          <Text className='text-4xl text-white font-bold'>Welcome</Text>
          <Text className='text-3xl text-gray-400 font-normal max-w-[280px]'>
            Get ready to keep track of your dog
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            router.push('/login');
          }}
          className='w-full bg-[#272727] rounded-xl font-bold flex items-center'
        >
          <Text className='p-2 py-4 text-center text-white w-full text-xl font-bold'>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Start;
