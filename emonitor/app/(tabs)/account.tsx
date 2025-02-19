import ParallaxScrollView from '@/components/ParallaxScrollView';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { useUser } from '@clerk/clerk-expo';
import { Pressable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function AccountScreen() {
    const colorScheme = useColorScheme();
    const { signOut } = useAuth();
    const { isLoaded, isSignedIn, user } = useUser();
    if (!isLoaded) {
        return null;
    }
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="minus"
                    style={styles.headerImage}
                />
            }
        >
            <ThemedView style={styles.container}>
                {isSignedIn && user ? (
                    <>
                        <Image
                            source={{ uri: user.imageUrl }}
                            style={styles.profileImage}
                        />
                        <ThemedText style={styles.name}>{user.fullName}</ThemedText>
                        <ThemedText>{user.primaryEmailAddress?.emailAddress}</ThemedText>
                        <Pressable
                            onPress={() => signOut()}
                            style={styles.signOutButton}
                        >
                            <ThemedText>Sign Out</ThemedText>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Ionicons
                            name="person-circle-outline"
                            size={120}
                            color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
                        />
                        <ThemedText style={styles.signInText}>
                            Sign in to save your products in the cloud
                        </ThemedText>
                        <Pressable
                            onPress={() => router.push('/(auth)/sign-in')}
                            style={styles.signInButton}
                        >
                            <ThemedText>Sign In</ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={() => router.push('/(auth)/sign-up')}
                            style={styles.signInButton}
                        >
                            <ThemedText>Sign Up</ThemedText>
                        </Pressable>
                    </>
                )}
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerImage: {
        marginTop: 10,
    },
    container: {
        alignItems: 'center',
        padding: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    signInText: {
        fontSize: 18,
        marginTop: 16,
        width: '90%',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    signOutButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
    },
    signInButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    }
})