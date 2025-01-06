import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';

import AddContact from './screens/AddContact';
import ContactList from './screens/ContactList';
import { colors } from './constants/GlobalStyles';
// import LoginScreen from './screens/LoginScreen';
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.Black,
    tabBarLabelStyle:{
      fontSize: 12,
    },
    tabBarStyle:{
      height: 60,
      position: 'relative',
      top: 4,
    },
  }}>
    <Tab.Screen
      name="Add Contact"
      component={AddContact}
      options={{
        tabBarIcon: ({color}) => <Icon name='home' size={25} color={color}  />,  
      }}
    />
    <Tab.Screen
      name="Contacts"
      component={ContactList}
      options={{
        tabBarIcon: ({color})=> <Icon name='person' size={25} color={color} />,
      }}
    />
  </Tab.Navigator>
}

export default function App() {
  return (
    <>
      {/* <LoginScreen /> */}
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}

