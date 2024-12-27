import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import CustomInput from "../components/CustomInput/CustomInput";
import { validateRegistrationInputs } from "../utils/validation";
import { apiUrl } from "../utils"; // Ensure this points to your backend URL

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!validateRegistrationInputs(email, name, password)) {
      setError("Please ensure all fields are valid.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Invalid input. Please check your details.");
        } else {
          throw new Error("Failed to register user. Please try again later."+""+response.status);
        }
      }

      const data = await response.json();
      Alert.alert("Success", "Registration successful!");
      navigation.navigate("Login"); 
    } catch (err: any) {
      setError(err.message || "Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <CustomInput value={email} onChange={setEmail} placeholder="Email" />
      <CustomInput value={name} onChange={setName} placeholder="Username" />
      <CustomInput value={password} onChange={setPassword} placeholder="Password" secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 8,
    marginBottom: 16,
    textAlign: "center",
  },
});

export default SignUpScreen;