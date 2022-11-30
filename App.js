import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from './src/Redux/store/Store';
import AuthLoadingScreen from './src/Screen/Loading/AuthLoadingScreen';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Provider store={store}>
        <PaperProvider>
        <StatusBar hidden={false} backgroundColor="rgba(0, 0, 0, 0.2)" />
          <AuthLoadingScreen />
        </PaperProvider>
      </Provider>
    </SafeAreaView>
  );
}

export default App;