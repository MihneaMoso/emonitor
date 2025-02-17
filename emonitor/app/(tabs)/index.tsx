import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {Link} from  'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#B3D8A8', dark: '#3D8D7A' }} headerImage={<Image source={{}} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Brief Description</ThemedText>
        <ThemedText>
          Emonitor is a price tracking app that supports Romanian sites such as <ThemedText type="defaultSemiBold" > emag.ro </ThemedText> and <ThemedText type="defaultSemiBold">altex.ro</ThemedText> .
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">How to use the app</ThemedText>
        <ThemedText>
          Tap the <ThemedText type="defaultSemiBold"><Link href="/(tabs)/addProduct"> Add Product </Link> </ThemedText> button to add a new product.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Enter the link to your product</ThemedText>
        <ThemedText>
          And choose when you want to be alerted when there are price changes.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 24
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  }
});
