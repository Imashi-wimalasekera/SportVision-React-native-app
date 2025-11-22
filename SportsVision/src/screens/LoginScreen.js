import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login, saveAuthToStorage } from '../store/authSlice';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const validate = () => {
    if (!username || username.length < 3) return 'Username must be at least 3 characters';
    if (!password || password.length < 4) return 'Password must be at least 4 characters';
    return null;
  };

  const onSubmit = () => {
    const v = validate();
    if (v) return setError(v);
    const user = { username };
    dispatch(login(user));
    dispatch(saveAuthToStorage(user));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SportVision — Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Login" onPress={onSubmit} />
      <View style={styles.row}>
        <Text>New? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 6 },
  row: { flexDirection: 'row', marginTop: 12 },
  link: { color: '#007aff' },
  error: { color: 'red', marginBottom: 8 },
});
