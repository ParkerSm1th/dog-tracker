import type {
  TextInputProps,
} from 'react-native';
import {
  TextInput,
} from 'react-native';

export const OnboardingInput = (props: TextInputProps) => (
  <TextInput
    {...props}
    style={{
      paddingLeft: 10,
      lineHeight: 20,
    }}
    textAlignVertical='top'
    placeholderTextColor={'#d1d5db'}
    className={'bg-[#272727] rounded-xl py-4 pb-3 text-white placeholder:text-gray-300 text-xl'}
  />
);
