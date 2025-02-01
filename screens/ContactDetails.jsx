import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ContactDetails = ({ route, navigation }) => {
    const { contact } = route.params;
    
    return (
        <View style={styles.detailsContainer}>
            {/* Profile */}
            <View style={styles.profileContainer}></View>
            {/* Details */}
            <View style={styles.details}>
                <View >
                    <Text style={styles.name}>{contact.firstName + ' ' + contact.lastName}</Text>
                    <Text style={styles.phone}>{contact.phone}</Text>
                    <Text style={styles.email}>{contact.email}</Text>
                </View>
            </View>
        </View>
    )
}

export default ContactDetails
const styles = StyleSheet.create({
    detailsContainer: {
        flex: 1,
    },
    profileContainer: {
        height: '20%',
        backgroundColor: 'lightblue',
    },
    details:{
        flex: 1,
        padding: 20,
        alignItems: 'center'
    },
    name:{
        fontSize: 25,
        fontWeight:'500',
        textAlign: 'center',
        paddingBottom: 7
    },
    phone:{
        fontSize: 20,
        fontWeight:'500',
        color: 'gray',
        textAlign: 'center',
        paddingBottom: 7
    },
    email:{
        fontSize: 18,
        fontWeight:'500',
        color: '#a1a1a1ff',
        textAlign: 'center',
        paddingBottom: 7
    }
})