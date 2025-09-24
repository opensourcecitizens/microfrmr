import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../src/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function CreateAccount({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const resp = await api.register({ name, email, password });
      // If server returns a token, persist it and navigate into the app
      if (resp && resp.token) {
        await AsyncStorage.setItem('token', resp.token);
        navigation.replace('App');
        return;
      }
      Alert.alert('Account created');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Failed to create account', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
