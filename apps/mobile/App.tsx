import * as React from 'react';
import { WebView } from 'react-native-webview';
import { setStatusBarHidden } from 'expo-status-bar';
import { PermissionsAndroid, StyleSheet } from 'react-native';

import * as NavigationBar from 'expo-navigation-bar';

const App = () => {
  NavigationBar.setVisibilityAsync('hidden');
  NavigationBar.setPositionAsync('relative');
  NavigationBar.setBehaviorAsync('inset-touch');
  setStatusBarHidden(true, 'none');

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
      source={{ uri: 'https://app.masterhoarder.site' }}
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
