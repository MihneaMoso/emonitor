import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ListElement } from './ListElement';

export interface Product {
  id: string;
  url: string;
  price: number;
  prp: number;
  fdp: number;
  discount: number;
  currency: string;
  title: string;
  imageUrl: string;
}

export function ProductsList({ products }: { products: Product[] }) {
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ListElement
            productUrl={item.url}
            price={item.price}
            prp={item.prp}
            fdp={item.fdp}
            discount={item.discount}
            currency={item.currency}
            title={item.title}
            imageUrl={item.imageUrl}
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
