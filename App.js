import { StatusBar } from 'expo-status-bar';
import AddContact from './screens/AddContact';
// import LoginScreen from './screens/LoginScreen';

export default function App() {
  return (
    <>
      {/* <LoginScreen /> */}
      <AddContact />
      <StatusBar style="auto" />
    </>
  );
}

