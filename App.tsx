import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerContentComponentProps, DrawerNavigationProp } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Appbar } from 'react-native-paper';
import { Provider as PaperProvider, Avatar, Text, ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import Home from './screens/Home';
import Settings from './screens/Settings';
import AddData from './screens/AddData';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

type FooterTabsProps = {
  navigation: DrawerNavigationProp<any>;
};

const FooterTabs = ({ navigation }: FooterTabsProps) => (
  <Tab.Navigator
    screenOptions={{
      header: () => (
        <Appbar.Header>
          <Appbar.Action
            icon="menu"
            color="#000"
            onPress={() => navigation.openDrawer()}
          />
        </Appbar.Header>
      ),
      tabBarStyle: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 5 },
      tabBarActiveTintColor: '#5b00ff',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="AddData" component={AddData} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

interface CustomDrawerProps extends DrawerContentComponentProps {
  session: Session | null;
  onLogout: () => void;
}

const CustomDrawerContent = (props: CustomDrawerProps) => {
  const { session, onLogout } = props;
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileSection}>
        <Avatar.Icon size={60} icon="account" style={{ backgroundColor: '#5b00ff' }} />
        <Text style={styles.name}>{session?.user?.user_metadata?.name || 'FinWin User'}</Text>
        <Text style={styles.email}>{session?.user?.email}</Text>
      </View>
      <DrawerItem label="Home" icon={() => <Avatar.Icon size={24} icon="view-dashboard" style={styles.drawerIcon} />} onPress={() => props.navigation.navigate('Main', { screen: 'Home' })} />
      <DrawerItem label="Add Data" icon={() => <Avatar.Icon size={24} icon="plus-box" style={styles.drawerIcon} />} onPress={() => props.navigation.navigate('Main', { screen: 'AddData' })} />
      <DrawerItem label="Settings" icon={() => <Avatar.Icon size={24} icon="cog" style={styles.drawerIcon} />} onPress={() => props.navigation.navigate('Main', { screen: 'Settings' })} />
      <DrawerItem label="Logout" icon={() => <Avatar.Icon size={24} icon="logout" style={styles.drawerIcon} />} onPress={onLogout} />
    </DrawerContentScrollView>
  );
};

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        {session && session.user ? (
          <Drawer.Navigator
            screenOptions={{ drawerType: 'slide', headerShown: false }}
            drawerContent={(props) => <CustomDrawerContent {...props} session={session} onLogout={handleLogout} />}
          >
            <Drawer.Screen name="Main" component={FooterTabs} options={{ headerShown: false }} />
          </Drawer.Navigator>
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9'
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333'
  },
  email: {
    fontSize: 14,
    color: 'gray'
  },
  drawerIcon: {
    backgroundColor: '#f0f0f0'
  }
});
