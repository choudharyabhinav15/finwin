import type { NavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  AddGoals: undefined;
  SmartGoals: undefined;
  Settings: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
export type RootTabNavigationProp = NavigationProp<RootTabParamList>;
