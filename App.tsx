import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Game from './src/app/Game';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => (
  <View style={styles.container}>
    <StatusBar hidden />
    <Game />
  </View>
);

export default App;
