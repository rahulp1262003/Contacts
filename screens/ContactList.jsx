import { StyleSheet, Text, View } from "react-native"

function ContactList() {
  return (
    <View style={styles.rootContainer}>
        <Text>Contacts</Text>
    </View>
  )
}

export default ContactList

const styles = StyleSheet.create({
    rootContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});