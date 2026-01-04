import { View, Text, Button } from 'react-native'
import { router } from 'expo-router'

const SingUp = () => {
  return (
    <View>
      <Text>Sign Up</Text>
      <Button title='Sign In' onPress={() => router.push('/(auth)/sign-in')} />
    </View>
  )
}

export default SingUp