import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, Avatar, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';
import AddData from './screens/AddData';
import RegisterScreen from './screens/RegisterScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const FooterTabs = ({ navigation }: any) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 5 },
      tabBarActiveTintColor: '#5b00ff',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Dashboard" children={() => <Dashboard navigation={navigation} />} />
    <Tab.Screen name="AddData" children={() => <AddData navigation={navigation} />} />
    <Tab.Screen name="Settings" children={() => <Settings navigation={navigation} />} />
  </Tab.Navigator>
);

const CustomDrawerContent = (props: any) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.profileSection}>
      <Avatar.Icon size={60} icon="account" style={{ backgroundColor: '#5b00ff' }} />
      <Text style={styles.name}>{props.user?.name}</Text>
      <Text style={styles.email}>{props.user?.email}</Text>
    </View>
    <DrawerItem label="Dashboard" icon={() => <Avatar.Icon size={24} icon="view-dashboard" style={styles.drawerIcon} />} onPress={() => props.navigation.navigate('Dashboard')} />
    <DrawerItem label="Add Data" icon={() => <Avatar.Icon size={24} icon="plus-box" style={styles.drawerIcon} />} onPress={() => props.navigation.navigate('AddData')} />
    <DrawerItem label="Settings" icon={() => <Avatar.Icon size={24} icon="cog" style={styles.drawerIcon} />} onPress={() => props.navigation.navigate('Settings')} />
    <DrawerItem label="Logout" icon={() => <Avatar.Icon size={24} icon="logout" style={styles.drawerIcon} />} onPress={props.onLogout} />
  </DrawerContentScrollView>
);

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          setUser(JSON.parse(userDataString));
          setLoggedIn(true);
        }
      } catch (e) {
        console.error('Failed to load user session.', e);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setLoggedIn(false);
    } catch (e) {
      console.error('Failed to clear user session.', e);
    }
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
        {loggedIn ? (
          <Drawer.Navigator
            screenOptions={{ drawerType: 'slide', headerShown: false }}
            drawerContent={(props) => <CustomDrawerContent {...props} user={user} onLogout={handleLogout} />}
          >
            <Drawer.Screen name="Home" component={FooterTabs} options={{ headerShown: false }} />
          </Drawer.Navigator>
        ) : showRegister ? (
          <RegisterScreen
            onRegister={() => setShowRegister(false)}
            onNavigateLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginScreen
            onLogin={async (userData) => {
              try {
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setLoggedIn(true);
              } catch (e) {
                console.error('Failed to save user session.', e);
              }
            }}
            onNavigateRegister={() => setShowRegister(true)}
          />
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
