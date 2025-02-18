import { StyleSheet, Image, Linking } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Pressable } from 'react-native';

interface ListElementProps {
  productUrl: string;
  price: number;
  prp: number;
  fdp: number;
  discount: number;
  currency: string;
  title: string;
  imageUrl: string;
}

export function ListElement({ productUrl, price, prp, fdp, discount, currency, imageUrl, title }: ListElementProps) {
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
  }
});
