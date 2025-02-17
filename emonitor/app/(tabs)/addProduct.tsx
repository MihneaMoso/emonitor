import { StyleSheet, Image, Platform } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { Pressable } from 'react-native';
import { ProductsList } from '@/components/ProductsList';
import { Product } from "@/components/ProductsList";

export default function addProductScreen() {
  const colorScheme = useColorScheme();
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [submittedUrl, setSubmittedUrl] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  }

  const getProductInfo = (link: string): Product => {
    // TODO: implement
    // For now, just return a dummy product
    const product: Product = {
      id: '',
      url: link,
      currentPrice: 0,
      prp: 0,
      fdp: 0,
      discount: 0,
      currency: '',
      imageUrl: '',
      title: ''
    };
    return product;
  }

  const handleSubmit = () => {
    if (!error && link) {
      setSubmittedUrl(link);
      const product = getProductInfo(link);
      addProduct(product);
    }
  };

  const validateLink = (text: string) => {
    setLink(text);
    
    // Check if link is empty
    if (!text.trim()) {
      setError('Please enter a link');
      return;
    }

    // Check if link is from supported sites
    if (!text.includes('emag.ro') && !text.includes('altex.ro') && text !== '') {
      setError('Only emag.ro and altex.ro links are supported');
      return;
    }

    // Check if it's a valid URL
    try {
      // add 'https://' if it's not there
      if (!text.startsWith('https://') || !text.startsWith('http://')) {
        text = 'https://' + text;
      }
      new URL(text);
      setError('');
    } catch {
      setError('Please enter a valid URL');
    }
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#B3D8A8', dark: '#3D8D7A' }}
      headerImage={
        <Image source={{}} />
      }>
      <ThemedText style={styles.titleContainer}>
        <ThemedText type="title">Add Product</ThemedText>
      </ThemedText>
      <ThemedView style={styles.formContainer}>
        <TextInput
          style={[styles.input,
            {
              color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
              backgroundColor: colorScheme === 'dark' ? '#353636' : '#FFFFFF'
            }
          ]}
          placeholder="Enter product link"
          placeholderTextColor={colorScheme === 'dark' ? '#808080' : '#666666'}
          value={link}
          onChangeText={validateLink}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}
        <Pressable
          style={[styles.submitButton,
            {
              backgroundColor: colorScheme === 'dark' ? '#3D8D7A' : '#B3D8A8',
            }
          ]}
          onPress={handleSubmit}
        >
          <ThemedText style={styles.buttonText}>Submit</ThemedText>
        </Pressable>
        <ProductsList products={products}></ProductsList>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 16,
    gap: 8,
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  formContainer: {
    width: "50%",
    padding: 16,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  }
});
