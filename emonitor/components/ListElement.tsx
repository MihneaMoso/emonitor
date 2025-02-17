import { StyleSheet, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface ListElementProps {
  productUrl: string;
  currentPrice: number;
  prp: number;
  fdp: number;
  discount: number;
  currency: string;
  imageUrl: string;
  title: string;
}

export function ListElement({ productUrl, currentPrice,prp,fdp,discount,currency, imageUrl, title }: ListElementProps) {
  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText type="link">{productUrl}</ThemedText>
        <ThemedText>Current Price: ${currentPrice}</ThemedText>
        <ThemedText>Discount: ${discount}</ThemedText>
        <ThemedText>PRP(recommended sales price): ${prp}</ThemedText>
        <ThemedText>Fastest Delivery Price: ${fdp}</ThemedText>
        <ThemedText>Currency: ${currency}</ThemedText>
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
  }
});
