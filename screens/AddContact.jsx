import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert } from 'react-native'
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { firebase } from '../config.js';
import { colors } from "../constants/GlobalStyles";

function AddContact() {

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required')
            .min(2, 'First Name must be at least 2 characters')
            .matches(/^[A-Za-z]+$/, 'First Name cannot contain numbers'),
        lastName: Yup.string()
            .required('Last Name is required')
            .min(2, 'Last Name must be at least 2 characters')
            .matches(/^[A-Za-z]+$/, 'Last Name cannot contain numbers'),
        email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
            .required('Phone number is required'),
    });

    const AddData = (values, resetForm) => {

        const reference = firebase.database().ref('/contacts');

        const newContact = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
        };

        reference
            .push(newContact)
            .then(() => {

                Alert.alert("Success", "Contact added successfully!");
                resetForm();
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
                <Formik
                    initialValues={{ firstName: '', lastName: '', email: '', phone: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => AddData(values, resetForm)}
                    validateOnBlur={true} 
                    validateOnChange={false}
                >

                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

                        <View>
                            <View style={styles.form}>
                                <Text style={styles.label}>First Name</Text>
                                <TextInput
                                    style={[styles.inputText, touched.firstName && errors.firstName && styles.invalidInput]}
                                    placeholder='First Name'
                                    selectionColor={colors.Black}
                                    onChangeText={handleChange('firstName')}
                                    onBlur={handleBlur('firstName')}
                                    value={values.firstName}
                                />
                                {touched.firstName && errors.firstName && (
                                    <Text style={styles.error}>{errors.firstName}</Text>
                                )}
                            </View>
                            <View style={styles.form}>
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    style={[styles.inputText, touched.lastName && errors.lastName && styles.invalidInput,]}
                                    placeholder='Last Name'
                                    selectionColor={colors.Black}
                                    inputMode='text'
                                    onChangeText={handleChange('lastName')}
                                    onBlur={handleBlur('lastName')}
                                    value={values.lastName}
                                />
                                {touched.lastName && errors.lastName && (
                                    <Text style={styles.error}>{errors.lastName}</Text>
                                )}
                            </View>
                            <View style={styles.form}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={[styles.inputText, touched.email && errors.email && styles.invalidInput]}
                                    placeholder='Email'
                                    selectionColor={colors.Black} keyboardType='email-address'
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.error}>{errors.email}</Text>
                                )}
                            </View>
                            <View style={styles.form}>
                                <Text style={styles.label}>Phone</Text>
                                <TextInput
                                    style={[styles.inputText, touched.phone && errors.phone && styles.invalidInput]}
                                    placeholder='Phone'
                                    maxLength={10}
                                    keyboardType='numeric'
                                    selectionColor={colors.Black}
                                    onChangeText={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                    value={values.phone}
                                />
                                {touched.phone && errors.phone && (
                                    <Text style={styles.error}>{errors.phone}</Text>
                                )}
                            </View>
                            <View style={styles.buttonContainer}>
                                <Pressable
                                    android_ripple={{ color: colors.Ripple }}
                                    onPress={handleSubmit}
                                >
                                    <View style={{ width: '100%' }}>
                                        <Text style={styles.buttonText}>Add</Text>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    )}

                </Formik>
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
    },
    error: {
        color: 'red',
        marginTop: 3,
        paddingLeft: 10
    },
    invalidInput: {
        borderColor: 'red',
        backgroundColor: colors.ErrorBackground,
    },
});