import { CustomInputProps } from '@/type'
import { View, Text, TextInput } from 'react-native'
import { useState } from 'react'
import cn from 'clsx'

const CustomInput = ({
  placeholder = 'Enter text',
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType="default"
}: CustomInputProps) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <View className="w-full">
      <Text className="label">{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        placeholderTextColor="#888"
        className={cn('input', isFocus ? 'border-primary' : 'border-gray-300')}
      />
    </View>
  )
}

export default CustomInput