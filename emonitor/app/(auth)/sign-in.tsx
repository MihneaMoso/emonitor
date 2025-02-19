import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, Button, View, StyleSheet } from 'react-native';
import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignInPage() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const colorScheme = useColorScheme();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');

    // Handle the submission of the sign-in form
    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) return;

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    }, [isLoaded, emailAddress, password]);

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Welcome Back</ThemedText>

            <TextInput
                style={[styles.input, {
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                    backgroundColor: colorScheme === 'dark' ? '#353636' : '#FFFFFF'
                }]}
                hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                placeholderTextColor={colorScheme === 'dark' ? '#808080' : '#666666'}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <TextInput
                style={[styles.input, {
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                    backgroundColor: colorScheme === 'dark' ? '#353636' : '#FFFFFF'
                }]}
                hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                value={password}
                placeholder="Enter password"
                secureTextEntry={true}
                placeholderTextColor={colorScheme === 'dark' ? '#808080' : '#666666'}
                onChangeText={(password) => setPassword(password)}
            />
            <Pressable
                style={({ pressed }) => [
                    styles.signInButton,
                    pressed && styles.buttonPressed
                ]}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                onPress={onSignInPress}>
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            </Pressable>
            <ThemedView style={styles.footer}>
                <ThemedText style={{ width: "50%" }}>Don't have an account?</ThemedText>
                <Link href="/sign-up" style={styles.link}>
                    <ThemedText style={styles.linkText}>Sign up</ThemedText>
                </Link>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '50%',
        padding: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        minHeight: 48,
        textAlignVertical: 'center'
    },
    signInButton: {
        width: '50%',
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    link: {
        marginLeft: 5,
    },
    linkText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }]
    }
});