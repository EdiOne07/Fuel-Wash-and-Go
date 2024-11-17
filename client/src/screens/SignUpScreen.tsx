import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import CustomInput from '../components/CustomInput/CustomInput';
import { registerUser } from '../utils/api';
import { validateRegistrationInputs } from '../utils/validation';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!validateRegistrationInputs(email, username, location, password)) {
      setError('Please ensure all fields are valid.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(email, username, location, password);
      alert('Registration successful');
    } catch (err: any) {
      setError(err.message || 'Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <CustomInput value={email} onChange={setEmail} placeholder="Email" />
      <CustomInput value={username} onChange={setUsername} placeholder="Username" />
      <CustomInput value={location} onChange={setLocation} placeholder="Location" />
      <CustomInput value={password} onChange={setPassword} placeholder="Password" secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 8,
    marginBottom: 16,
  },
});

export default SignUpScreen;
