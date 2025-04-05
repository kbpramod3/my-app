import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import CircleButton from '@/components/CircleButton';

interface user {
  name: string;
  email: string;
  password: string;
}
export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUserProfile();
  },[]);

  const loadUserProfile = async() => {
    try {
      const users = await AsyncStorage.getItem('users');
      const loggedInEmail = await AsyncStorage.getItem('loggedInEmail')
      
      if (users && loggedInEmail){
        const userList = users ? JSON.parse(users) : [];
        const user = userList.find((u: user) => u.email === loggedInEmail);

        if (user){
          setName(user.name);
          setPassword(user.password);
        }
      }
    } catch (error) {
      console.log("Error")
    }
  };

  const updateProfile = async() => {
    try {
      const users = await AsyncStorage.getItem('users');
      const loggedInEmail = await AsyncStorage.getItem('loggedInEmail')
      
      if (users && loggedInEmail){
        let  userList = users ? JSON.parse(users) : [];
        userList = userList.map((user:user )=> user.email === loggedInEmail?{...user,name,password}: user);
        
        await AsyncStorage.setItem('users', JSON.stringify(userList));
        Alert.alert("Success", "Profile updated successfully!");
      }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }

  const updateProfileIcon = async() => {
    
  }

  return (
    <View style={styles.Container}>
      <Text style={styles.modalTitle}>Edit Profile</Text>
      <TouchableOpacity style={styles.profileIcon} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="account-circle" size={150} color="black" />
      </TouchableOpacity>
      <Modal animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalContainer, {backgroundColor: 'black',}]}>
          <Text style={[styles.modalTitle,{color: 'white'}]}>Profile photo</Text>

          <View style={styles.buttonContainer}>
          <CircleButton onPress={() => alert('hi')}></CircleButton>
          <CircleButton onPress={() => alert('hi')}></CircleButton>
          </View>

        </View>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={() => updateProfile()} />
        <Button title="Cancel" color="red" onPress={() => router.back()}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  Container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 0.25,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    width: '80%', // Control modal width
    alignSelf: 'center', // Ensure it doesn't take full width
    justifyContent: 'center', 
    alignItems: 'center', // Center content inside modal
    position: 'absolute', 
    top: '60%', // Center modal vertically
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileIcon: {
    alignSelf: 'center',
    width: 'auto',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  optionsContainer: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
