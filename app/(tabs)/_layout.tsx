import useAuthStore from "@/store/auth.store";
import { TabBarIconProps } from "@/type";
import { View, Image, Text } from "react-native";
import { Slot, Redirect, Tabs } from "expo-router"
import cn from "clsx";
import { images } from "@/constants";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="tab-icon">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? '#FE8C00' : '#5D5F6D'}
      />
    <Text className={cn('text-sm font-bold', focused ? 'text-primary' : 'text-gray-200')}>
      {title}
    </Text>
  </View>
)

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();

  const tabs = [
    {
      name: "index",
      title: "Home",
      icon: images.home
    },
    {
      name: "search",
      title: "Search",
      icon: images.search
    },
    {
      name: "cart",
      title: "Cart",
      icon: images.bag
    },
    {
      name: "profile",
      title: "Profile",
      icon: images.person
    }
  ] as const;

  if (!isAuthenticated) return <Redirect href="/sign-in" /> 
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderBottomEndRadius: 50,
          borderBottomStartRadius: 50,
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,
          marginHorizontal: 20,
          height: 80,
          position: 'absolute',
          bottom: 40,
          backgroundColor: 'white',
          shadowColor: '#1a1a1a',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5
        }
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} icon={tab.icon} title={tab.title} />),
          }}
        />
      ))}
    </Tabs>
  )
}