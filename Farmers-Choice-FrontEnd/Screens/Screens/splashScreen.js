import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
 
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('App');
    }, 5000); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo1.png')} style={styles.logo} />
      <Text style={styles.title}>Farmers Choice</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#45cca3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
