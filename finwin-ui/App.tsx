import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import Home from './screens/Home';
import Settings from './screens/Settings';
import SmartGoals from './screens/SmartGoals';
import RegisterScreen from './screens/RegisterScreen';
import { Ionicons } from '@expo/vector-icons';
import AddGoals from './screens/AddGoals';
import './lib/i18n';
import FinanceLog from './components/FinanceLog';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

type FooterTabsProps = {
  navigation: DrawerNavigationProp<any>;
};

const FooterTabs = ({ navigation }: FooterTabsProps) => (
  <Tab.Navigator
    screenOptions={{
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          onPress={() => navigation.toggleDrawer()}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerShown: true,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
      },
      tabBarActiveTintColor: '#1e2a78',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: true,
        headerTitle: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="AddGoals"
      component={AddGoals}
      options={{
        headerShown: true,
        headerTitle: 'Add a New Goal',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="SmartGoals"
      component={SmartGoals}
      options={{
        headerShown: true,
        headerTitle: 'Goals',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="trophy-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Dashboard"
      component={require('./components/Dashboard').default}
      options={{
        headerShown: true,
        headerTitle: 'Dashboard',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="pie-chart-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Explore"
      component={require('./components/Explore').default}
      options={{
        headerShown: true,
        headerTitle: 'Explore',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="FinanceLog"
      component={FinanceLog}
      options={{
        headerShown: true,
        headerTitle: 'Finance Log',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="cash-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={Settings}
      options={{
        headerShown: true,
        headerTitle: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="All"
      component={AllTab}
      options={{
        headerShown: true,
        headerTitle: 'All Entries',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="list-outline" color={color} size={size} />
        ),
      }}
    />
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
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="gray" />
        </TouchableOpacity>
        <Ionicons name="person-circle-outline" size={60} color="#1e2a78" />
        <Text style={styles.name}>{session?.user?.user_metadata?.name || 'FinWin User'}</Text>
        <Text style={styles.email}>{session?.user?.email}</Text>
      </View>
      <DrawerItem
        label="Home"
        icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Main', { screen: 'Home' })}
      />
      <DrawerItem
        label="Smart Goals"
        icon={({ color, size }) => <Ionicons name="trophy-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Main', { screen: 'SmartGoals' })}
      />
      <DrawerItem
        label="Finance Log"
        icon={({ color, size }) => <Ionicons name="cash-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Main', { screen: 'FinanceLog' })}
      />
    </DrawerContentScrollView>
  );
};

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AllTab = () => {
  const [entries, setEntries] = useState<FinanceLogEntry[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('financeLogEntry');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  const deleteEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem('financeLogEntry', JSON.stringify(updatedEntries));
  };

  return (
    <FlatList
      data={entries}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.entryType}</Text>
          <Text style={styles.cell}>{item.amount}</Text>
          <Text style={styles.cell}>{new Date(item.date).toLocaleDateString()}</Text>
          <Text style={styles.cell}>{item.category}</Text>
          <TouchableOpacity onPress={() => deleteEntry(index)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

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
        <ActivityIndicator size="large" color="#1e2a78" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session && session.user ? (
        <Drawer.Navigator
          screenOptions={{
            drawerType: 'front',
            headerShown: false,
            gestureEnabled: false,
          }}
          drawerContent={(props) => (
            <CustomDrawerContent {...props} session={session} onLogout={handleLogout} />
          )}
        >
          <Drawer.Screen name="Main" component={FooterTabs} options={{ headerShown: false }} />
        </Drawer.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  logoutButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
