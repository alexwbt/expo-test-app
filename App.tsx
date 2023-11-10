import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Game from './src/app/Game';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => (
  <GestureHandlerRootView style={styles.container}>
    <StatusBar hidden />
    <Game />
  </GestureHandlerRootView>
);

export default App;
