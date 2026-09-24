import React, {useCallback, useState} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from './src/components/SplashScreen';
import TodoScreen from './src/screens/TodoScreen';
import {colors} from './src/theme';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={showSplash ? 'light-content' : 'dark-content'}
        backgroundColor={showSplash ? colors.primary : colors.background}
      />
      {showSplash ? <SplashScreen onFinish={hideSplash} /> : <TodoScreen />}
    </SafeAreaProvider>
  );
}
