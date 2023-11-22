import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {RootStackParamList} from '../types/Screen';
import {Home} from '../Screens/Home';
import {Scanner} from '../Screens/Scanner';
import {Host} from '../Screens/Host';

const MainStack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}}>
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen name="Scanner" component={Scanner} />
      <MainStack.Screen name="Host" component={Host} />
    </MainStack.Navigator>
  );
};
