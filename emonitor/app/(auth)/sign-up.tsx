import * as React from 'react';
import { Text, TextInput, Button, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet } from 'react-native';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState('');
    const colorScheme = useColorScheme();

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return;

        console.log(emailAddress, password);

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            });

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true);
            setError('');
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            //console.error(JSON.stringify(err, null, 2));
            setError(err.errors[0].message || 'Failed to sign up');
        }
    };

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    if (pendingVerification) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Verify your email</ThemedText>
                <TextInput
                    style={[styles.input, {
                        color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                        backgroundColor: colorScheme === 'dark' ? '#353636' : '#FFFFFF'
                    }]}
                    value={code}
                    placeholder="Verification code"
                    placeholderTextColor={colorScheme === 'dark' ? '#808080' : '#666666'}
                    onChangeText={setCode}
                />
                <Pressable style={styles.signUpButton} onPress={onVerifyPress}>
                    <ThemedText style={styles.buttonText}>Verify Email</ThemedText>
                </Pressable>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Create Account</ThemedText>

            {error ? (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : null}

            <TextInput
                style={[styles.input, {
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                    backgroundColor: colorScheme === 'dark' ? '#353636' : '#FFFFFF'
                }]}
                hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter Email"
                placeholderTextColor={colorScheme === 'dark' ? '#808080' : '#666666'}
                onChangeText={setEmailAddress}
            />

            <TextInput
                style={[styles.input, {
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                    backgroundColor: colorScheme === 'dark' ? '#353636' : '#FFFFFF'
                }]}
                hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                value={password}
                placeholder="Password"
                placeholderTextColor={colorScheme === 'dark' ? '#808080' : '#666666'}
                secureTextEntry={true}
                onChangeText={setPassword}
            />

            <Pressable
                style={({pressed}) => [
                    styles.signUpButton,
                    pressed && styles.buttonPressed
                ]}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                onPress={onSignUpPress}>
                <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
            </Pressable>

            <View style={styles.footer}>
                <ThemedText>Already have an account? </ThemedText>
                <Link href="/sign-in" style={styles.link}>
                    <ThemedText style={styles.linkText}>Sign in</ThemedText>
                </Link>
            </View>
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
    },
    signUpButton: {
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
    errorText: {
        color: '#FF3B30',
        marginBottom: 10,
        textAlign: 'center'
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }]
    }
});