import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { colors } from "../constants/GlobalStyles";

function LoginScreen() {
    return (
        <View style={styles.rootContainer}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View>
                    <Text style={styles.title}>Contacts</Text>
                </View>
                <View style={{ width: '80%' }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.inputText} placeholder="Email" />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput style={styles.inputText} placeholder="Password" secureTextEntry={true} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={styles.button}
                            android_ripple={{ color: colors.Ripple }}
                        >
                            <View style={{ width: '100%' }}>
                                <Text style={styles.buttonText}>Login</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.White,
        // backgroundColor: 'red',

    },
    scrollView: {
        width: '100%',
        flexGrow: 1, 
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    title: {
        fontSize: 40,
        // marginBottom: '20%'
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        textAlign: 'left',
        fontSize: 15,
        paddingVertical: 10,
        paddingLeft: 10
    },
    inputText: {
        minWidth: '80%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 18,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.lightGray
    },
    buttonContainer: {
        overflow: 'hidden',
        borderRadius: 18,
        minWidth: '80%',
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