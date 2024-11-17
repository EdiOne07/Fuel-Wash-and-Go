import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface CustomInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ value, onChange, placeholder, secureTextEntry = false }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
});

export default CustomInput;
