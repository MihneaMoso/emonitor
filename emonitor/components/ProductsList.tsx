import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ListElement } from './ListElement';

export interface Product {
  id: string;
  url: string;
  currentPrice: number;
  prp: number;
  fdp: number;
  discount: number;
  currency: string;
  imageUrl: string;
  title: string;
}

export function ProductsList({ products }: { products: Product[] }) {
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ListElement
            productUrl={item.url}
            currentPrice={item.currentPrice}
            prp={item.prp}
            fdp={item.fdp}
            discount={item.discount}
            currency={item.currency}
            imageUrl={item.imageUrl}
            title={item.title}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  }
});
