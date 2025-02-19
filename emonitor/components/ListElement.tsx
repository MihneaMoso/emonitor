import { StyleSheet, Image, Linking } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';
import React from 'react';
import { registerBackgroundTask } from '@/utils/backgroundTasks';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const intervals = [
  { label: '1 hour', value: 3600 },
  { label: '2 hours', value: 7200 },
  { label: '4 hours', value: 14400 },
];

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
}

export function ListElement({ productUrl, price, prp, fdp, discount, currency, imageUrl, title, onDelete }: ListElementProps) {
  const [checkInterval, setCheckInterval] = useState(3600); // Default to 1 hour

  const handleIntervalChange = (value: number) => {
    setCheckInterval(value);
    registerBackgroundTask(value);
  };

  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <Pressable onPress={() => Linking.openURL(productUrl)}>
          <ThemedText type="link" style={styles.linkText}>{productUrl}</ThemedText>
        </Pressable>
        <ThemedText>Current Price: <ThemedText style={styles.price}>{price}</ThemedText></ThemedText>
        <ThemedText>Discount: {discount}</ThemedText>
        <ThemedText>PRP(recommended sales price): {prp}</ThemedText>
        <ThemedText>Fastest Delivery Price: {fdp}</ThemedText>
        <ThemedText>Currency: {currency}</ThemedText>
        <Picker
          selectedValue={checkInterval}
          onValueChange={handleIntervalChange}
          style={styles.picker}
        >
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
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  infoContainer: {
    marginLeft: 16,
    flex: 1,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#0066CC'
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  picker: {
    width: 150,
    marginTop: 10
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  }
});
