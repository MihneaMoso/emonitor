import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ListElement } from './ListElement';
import { ThemedText } from './ThemedText';

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

interface ProductsListProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  saveProducts: (products: Product[]) => void;
}

export function ProductsList({ products, setProducts, saveProducts }: ProductsListProps) {
  const handleDelete = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };
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
            onDelete={() => { handleDelete(item.id) }}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ThemedText style={styles.title}>Your Products</ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  }
});
