import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert } from 'react-native'
import { useState } from 'react';
import { firebase } from '../config.js';

import { colors } from "../constants/GlobalStyles";

function AddContact() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const AddData = () => {

        const { firstName, lastName, email, phone } = formData;

        if (!firstName || !lastName || !email || !phone) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        const reference = firebase.database().ref('/contacts');

        const newContact = {
            firstName,
            lastName,
            email,
            phone,
        };

        reference
            .push(newContact)
            .then(() => {
                
                Alert.alert("Success", "Contact added successfully!");
                setFormData({ firstName: '', lastName: '', email: '', phone: '' });
            })
            .catch((error) => {
                console.error('Error pushing data:', error.message);
                Alert.alert("Error", "Failed to add contact: " + error.message);
            });
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.rootContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Create Contact</Text>
                </View>
                <View>
                    <View style={styles.form}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder='First Name'
                            selectionColor={colors.Black}
                            value={formData.firstName}
                            onChangeText={(text) => handleInputChange('firstName', text)}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder='Last Name'
                            selectionColor={colors.Black}
                            inputMode='email'
                            textContentType='emailAddress'
                            value={formData.lastName}
                            onChangeText={(text) => handleInputChange('lastName', text)}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder='Email'
                            selectionColor={colors.Black} keyboardType='email-address'
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder='Phone'
                            maxLength={10}
                            keyboardType='numeric'
                            selectionColor={colors.Black}
                            value={formData.phone}
                            onChangeText={(text) => handleInputChange('phone', text)}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            android_ripple={{ color: colors.Ripple }}
                            onPress={AddData}
                        >
                            <View style={{ width: '100%' }}>
                                <Text style={styles.buttonText}>Add</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default AddContact

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rootContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 80
    },
    form: {
        width: '80%',
    },
    titleContainer: {
        marginBottom: 50
    },
    title: {
        fontSize: 40
    },
    label: {
        fontSize: 15,
        paddingLeft: 10,
        paddingVertical: 10
    },
    inputText: {
        padding: 15,
        borderWidth: 1,
        borderColor: colors.lightGray,
        fontSize: 17,
        borderRadius: 15,
        overflow: 'hidden'
    },
    buttonContainer: {
        overflow: 'hidden',
        borderRadius: 18,
        maxWidth: '80%',
        marginTop: 20,
        backgroundColor: colors.Black,
    },
    buttonText: {
        color: colors.White,
        paddingVertical: 17,
        paddingHorizontal: 22,
        fontSize: 20,
        textAlign: 'center',
    }
});