import {
View, Text, Button, Alert
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import CustomInput from '@/components/CustomInput'
import CustomButton from '@/components/CustomButton'
import { signIn } from '@/lib/appwrite'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const submit = async () => {
    const { email, password } = form;
    if (!email || !password) return Alert.alert('Error', 'Please enter password and email');
    setIsSubmitting(true);
    try {
      await signIn({ email, password });
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  const updateFormData = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }


  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder='Enter your email'
        value={form.email}
        onChangeText={(text) => updateFormData('email', text)}
        label="email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder='Enter your password'
        value={form.password}
        onChangeText={(text) => updateFormData('password', text)}
        label="password"
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className="flex-row justify-center gap-2 mt-5">
        <Text className="base-regular text-gray-100">Don&apos;t have an account?</Text>
        <Link href="/sign-up" className="base-bold text-primary">Sign Up</Link>
      </View>
    </View>
  )
}

export default SignIn