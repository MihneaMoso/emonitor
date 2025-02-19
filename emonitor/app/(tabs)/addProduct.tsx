import { StyleSheet, Image, Platform } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useColorScheme, ActivityIndicator } from 'react-native';
import { Pressable } from 'react-native';
import { ProductsList } from '@/components/ProductsList';
import { Product } from "@/components/ProductsList";
import { supportedSites } from '../config/supportedSites';
// import { DEV_URL } from '@env';
import { devHost } from '../config/hosts';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerBackgroundTask } from '@/utils/backgroundTasks';


export default function addProductScreen() {
  const colorScheme = useColorScheme();
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  // const [loading, setLoading] = useState(true);
  const [submittedUrl, setSubmittedUrl] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  const saveProducts = async (products: Product[]) => {
    try {
      await AsyncStorage.setItem('savedProducts', JSON.stringify(products));
    } catch (error) {
      setError('Failed to save products');
    }
  };

  const loadSavedProducts = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem('savedProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      setError('Failed to load saved products');
    }
  };

  const getProductInfo = async (link: string): Promise<Product> => {
    let url_str = `${devHost}/product/`;

    if (link.includes("emag.ro")) {
      url_str += "emag";
    } else if (link.includes("altex.ro")) {
      url_str += "altex";
    } else {
      setError('Invalid URL');
    }
    // product_str will be the rest of the URL after https://www.emag.ro/ or https://www.altex.ro/, not including the domain or url parameters
    const product_str = new URL(link).pathname;
    url_str += product_str;
    //console.log(url_str);
    const response = await fetch(url_str, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
    if (!response.ok) {
      setError('Error fetching product information');
      return {
        id: "error",
        url: link,
        price: 0,
        prp: 0,
        fdp: 0,
        discount: 0,
        currency: '',
        title: '',
        imageUrl: '',
      };
    }
    // convert the received json to a Product object
    const data: Product = await response.json();
    //console.log(data);
    const product: Product = {
      id: data.id || '',
      url: link,
      price: data.price,
      prp: data.prp == null ? data.price : data.prp,
      fdp: data.fdp == null ? data.price : data.fdp,
      discount: data.discount || 0,
      currency: data.currency || '',
      title: data.title || '',
      imageUrl: data.imageUrl || '',
    };
    return product;
  }

  const addProduct = async (newProduct: Product) => {
    if (newProduct.id === "error") {
      return;
    }
    if (products.some(product => product.id === newProduct.id)) {
      setError('This product is already in your list');
      return;
    }
    const updatedProducts = [...products, newProduct];
    setProducts([...products, newProduct]);
    saveProducts(updatedProducts);

    await registerBackgroundTask(3600);
  }

  useEffect(() => {
    loadSavedProducts();
  }, []);

  const handleSubmit = async () => {
    if (!error && link) {
      setSubmittedUrl(link);
      const product = await getProductInfo(link);
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
    let processedText = text;
    // add 'https://' if it's not there
    if (!processedText.startsWith('https://') && !processedText.startsWith('http://')) {
      processedText = 'https://' + processedText;
    }
    // Check if it's a valid URL
    try {
      new URL(processedText);
      setError('');
    } catch {
      setError('Please enter a valid URL');
      return;
    }
    // Check if the first part of the link (the domain) is in the supportedSites.ts file
    // get the domain in the link
    const domain = new URL(processedText).hostname;;
    // check if domain is in the supported_sites.txt file
    if (!supportedSites.includes(domain) && processedText !== '') {
      setError('Check your spelling or check supported sites');
      return;
    }

    setError('');
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#B3D8A8', dark: '#3D8D7A' }}
      headerImage={
        <Image source={{}} />
      }>
      {error ? (
        <ThemedText style={[styles.errorText, styles.topError]}>{error}</ThemedText>
      ) : null}
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
          <ThemedText style={styles.buttonText}>Add</ThemedText>
        </Pressable>
        <ProductsList
          products={products}
          setProducts={setProducts}
          saveProducts={saveProducts}
        />
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
  },
  topError: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: -10
  }
});
