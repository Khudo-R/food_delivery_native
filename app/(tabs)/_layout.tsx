import { Slot, Redirect } from "expo-router"

export default function _Layout() {
  const isAuthenticated = true; // Replace with your auth logic
  if (!isAuthenticated) return <Redirect href="/sign-in" /> 
  return <Slot />
}