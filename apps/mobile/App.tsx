import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { WebView } from 'react-native-webview';
import { setStatusBarHidden } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { PermissionsAndroid, StyleSheet } from 'react-native';

const App = () => {
  const hideNavBar = () => {
    NavigationBar.setBackgroundColorAsync('transparent');
    NavigationBar.setPositionAsync('absolute'); // content doesnt move up when navbar visible
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
    setStatusBarHidden(true, 'none');
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      // If app is being used, hide nav bar
      if (nextAppState === 'active') hideNavBar();
    };

    const appStateSubscription = AppState.addEventListener(
      // Subscribe to app state changes
      'change',
      handleAppStateChange,
    );

    // Clean up the event listener when the component unmounts
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Access Permission',
      message:
        'To be able to play Master Hoarder GO!, we need your permission to access your location. We will use it only for gameplay purposes.',
      buttonPositive: 'Okay!',
      buttonNegative: 'Not okay!',
    },
  );

  return (
    <WebView
      style={styles.container}
      source={{ uri: 'https://app-outdoria.masterhoarder.site' }}
      geolocationEnabled={true}
    />
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
  },
});
