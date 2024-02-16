import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, TextInput } from "react-native";
import { useDispatch } from 'react-redux';
import { login } from './login.js';
import { logout } from './actions.js';

export default function PostScreen ({ navigation }) {

  const dispatch = useDispatch();

  {/*임시로 추가한 아이디 저장*/}
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    login(id, password, dispatch);
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  {/*임시로 추가한 아이디 저장*/}

  


  return (
    <ScrollView style={{ flex: 1 }}>
      <Text>PostScreen</Text>

      {/*임시로 추가한 아이디 입력란*/}
      <TextInput
        placeholder="Enter ID"
        value={id}
        onChangeText={text => setId(text)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={true}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
      />
      <Button
        title="Login"
        onPress={handleLogin}
      />
      <Button
        title="Logout"
        onPress={handleLogout}
      />
      {/*임시로 추가한 아이디 입력란*/}

      <Button
        title="Go To Profile"
        onPress={() => navigation.navigate('Profile')} 
      />
      <Button
        title="Go To Match"
        onPress={() => navigation.navigate('Match')} 
      />
      <Button
        title="Go To Walk"
        onPress={() => navigation.navigate('Walk')} 
      />
    </ScrollView>
  );
};