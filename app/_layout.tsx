import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { SidebarProvider } from '../context/SidebarContext';
import { View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // You can add custom fonts here if needed
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SidebarProvider>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            header: (props: NativeStackHeaderProps) => <Header {...props} />,
            headerShown: true,
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Login',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="register" 
            options={{ 
              title: 'Register',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="profile" 
            options={{ 
              title: 'Profile',
              headerShown: true,
              headerLeft: () => null,
            }} 
          />
          <Stack.Screen 
            name="foods" 
            options={{ 
              title: 'Food Management',
              headerShown: true,
              headerLeft: () => null,
            }} 
          />
          <Stack.Screen 
            name="shopping-list" 
            options={{ 
              title: 'Shopping List',
              headerShown: true,
              headerLeft: () => null,
            }} 
          />
          <Stack.Screen 
            name="meals" 
            options={{ 
              title: 'Meals',
              headerShown: true,
              headerLeft: () => null,
            }} 
          />
          <Stack.Screen 
            name="groups" 
            options={{ 
              title: 'Groups',
              headerShown: true,
              headerLeft: () => null,
            }} 
          />
          <Stack.Screen 
            name="group-details" 
            options={{ 
              title: 'Group Details',
              headerShown: true,
              headerLeft: () => null,
            }} 
          />
          <Stack.Screen 
  name="invitations" 
  options={{ 
    title: 'Invitations',
    headerShown: true,
    headerLeft: () => null,
  }} 
/>
<Stack.Screen 
  name="nutrition" 
  options={{ 
    title: 'Nutrition',
    headerShown: true,
    headerLeft: () => null,
  }} 
/>



        </Stack>
        <Sidebar />
      </View>
    </SidebarProvider>
  );
}

