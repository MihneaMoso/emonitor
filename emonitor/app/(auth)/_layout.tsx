import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function UnAuthenticatedLayout() {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Redirect href={"/"} />;
    }

    return (
        <Stack screenOptions={{ headerShown: false, title: "Log in/sign up" }}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
        </Stack>
    );
}