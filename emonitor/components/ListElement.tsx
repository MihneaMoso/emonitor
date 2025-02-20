import { StyleSheet, Image, Linking } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import React from 'react';
import { registerBackgroundTask } from '@/utils/backgroundTasks';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ListElementProps {
  productUrl: string;
  price: number;
  prp: number;
  fdp: number;
  discount: number;
  currency: string;
  title: string;
  imageUrl: string;
  onDelete: () => void;
  loading?: boolean;
}

export function ListElement({ productUrl, price, prp, fdp, discount, currency, imageUrl, title, onDelete, loading }: ListElementProps) {
  const [checkInterval, setCheckInterval] = useState(3600); // Default to 1 hour
  const colorScheme = useColorScheme();

  const handleIntervalChange = (value: number) => {
    setCheckInterval(value);
    registerBackgroundTask(value);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <ThemedView style={styles.infoContainer}>
        <ThemedText
          type="subtitle"
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {title}</ThemedText>
        <Pressable
          onPress={() => Linking.openURL(productUrl)}>
          <ThemedText
            type="link"
            style={styles.linkText}
            ellipsizeMode='tail'
            numberOfLines={1}
          >{productUrl}</ThemedText>
        </Pressable>
        <ThemedText style={styles.productInfo}>Current Price: <ThemedText style={styles.price}>{price}</ThemedText></ThemedText>
        <ThemedText style={styles.productInfo}>Discount: {discount}</ThemedText>
        <ThemedText style={styles.productInfo}>PRP: {prp}</ThemedText>
        <ThemedText style={styles.productInfo}>Fastest Delivery Price: {fdp}</ThemedText>
        <ThemedText style={styles.productInfo}>Currency: {currency}</ThemedText>
        <Picker
          selectedValue={checkInterval}
          onValueChange={handleIntervalChange}
          style={[styles.picker, {
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          }]}
          dropdownIconColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        >
          <Picker.Item label="1 minute" value={60} />
          <Picker.Item label="5 minutes" value={300} />
          <Picker.Item label="1 hour" value={3600} />
          <Picker.Item label="2 hours" value={7200} />
          <Picker.Item label="4 hours" value={14400} />
        </Picker>
        <Pressable
          onPress={onDelete}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInfo: {
    marginVertical: 2,
    flexWrap: 'wrap'
  },
  productImage: {
    width: 60,
    height: 80,
    borderRadius: 4,
  },
  infoContainer: {
    marginLeft: 12,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 40,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#0066CC',
    flexWrap: 'wrap',
    width: '100%',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 4,
  },
  picker: {
    width: '100%',
    height: 50,
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'transparent',
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
