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
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Try again.");
      }

      Alert.alert("Success", "Registration successful!");
      navigation.navigate("Login");
    } catch (err: any) {
      // Show the specific error from the backend
      if (err.message.includes("Invalid email format")) {
        setError("Invalid email format. Example: user@example.com");
      } else if (err.message.includes("Name should contain only letters and spaces")) {
        setError("Name must only contain letters and spaces.");
      } else if (err.message.includes("Password must include")) {
        setError("Password must be at least 5 characters, include an uppercase letter, and a number.");
      } else if (err.message.includes("Email is already registered")) {
        setError("This email is already registered. Try logging in.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <CustomInput value={email} onChange={setEmail} placeholder="Email" />
      <CustomInput value={name} onChange={setName} placeholder="Name" />
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
