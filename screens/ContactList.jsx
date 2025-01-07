import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native"
import { firebase } from '../config';
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/GlobalStyles";

function ContactList() {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reference = firebase.database().ref('/contacts');
    const onValueChange = reference.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setContacts(formattedData);
      } else {
        setContacts([]);
      }
      setLoading(false)
    })

    return () => reference.off('value', onValueChange);
  }, []);

  const renderedItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.details}>{item.phone}</Text>
    </View>
  )


  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.rootContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Contacts</Text>
        </View>
        <View style={styles.listItemContainer}>
          {loading
            ?
            (<ActivityIndicator size='large' color={colors.Black} />)
            : contacts.length > 0
              ?
              (
                <FlatList data={contacts} renderItem={renderedItem} keyExtractor={(item) => item.id} />
              )
              : (<Text>No Contacts Found</Text>)
          }
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ContactList

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  titleContainer: {
    marginVertical: 40
  },
  title: {
    fontSize: 40
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
  },
  card: {
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 18,
    backgroundColor: colors.White
  },
  listItemContainer: {
    flex: 1,
    width: '100%'
    // backgroundColor: 'red'
  },
});