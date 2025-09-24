import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../src/api';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function UserLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const resp = await api.login({ email, password });
      if (resp.token) {
        navigation.replace('App');
      } else {
        Alert.alert('Login failed');
      }
    } catch (err) {
      Alert.alert('Login error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.link}>Create a new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: wp('6%'), justifyContent: 'center' },
  title: { fontSize: wp('6%'), fontWeight: 'bold', marginBottom: hp('2%') },
  input: { backgroundColor: '#fff', padding: wp('3%'), borderRadius: 8, marginBottom: hp('1%') },
  button: { backgroundColor: '#45cca3', padding: wp('3%'), borderRadius: 8, alignItems: 'center', marginVertical: hp('1%') },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#45cca3', marginTop: hp('1%') },
});
