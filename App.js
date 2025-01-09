import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import AddContact from './screens/AddContact';
import ContactList from './screens/ContactList';
import { colors } from './constants/GlobalStyles';
import EditContact from './screens/EditContact';
// import LoginScreen from './screens/LoginScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.Black,
    tabBarLabelStyle: {
      fontSize: 12,
    },
    tabBarStyle: {
      height: 60,
    },
  }}>
    <Tab.Screen
      name="Add Contact"
      component={AddContact}
      options={{
        tabBarIcon: ({ color }) => <Icon name='home' size={25} color={color} />,
      }}
    />
    <Tab.Screen
      name="Contacts"
      component={ContactList}
      options={{
        tabBarIcon: ({ color }) => <Icon name='person' size={25} color={color} />,
      }}
    />
  </Tab.Navigator>
}



export default function App() {
  return (
    <>
      {/* <LoginScreen /> */}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Contacts' component={BottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name='EditContact' component={EditContact} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}

