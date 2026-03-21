import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      
      {/* 🔥 CONTAINER QUE RESOLVE */}
      <View style={{ flex: 1, width: "100%" }}>
        <Stack
          screenOptions={{
            headerShown: false
          }}
        />
      </View>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}