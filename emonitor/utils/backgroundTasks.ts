import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/components/ProductsList';
import { devHost } from '@/app/config/hosts';
import { Platform } from 'react-native';

const PRICE_CHECK_TASK = 'PRICE_CHECK_TASK';

const getProductInfo = async (link: string) => {
    let url_str = `${devHost}/product/`;

    if (link.includes("emag.ro")) {
        url_str += "emag";
    } else if (link.includes("altex.ro")) {
        url_str += "altex";
    }

    const product_str = new URL(link).pathname;
    url_str += product_str;

    const response = await fetch(url_str);
    const data: Product = await response.json();

    return {
        id: data.id,
        url: link,
        price: data.price,
        prp: data.prp,
        fdp: data.fdp,
        discount: data.discount,
        currency: data.currency,
        imageUrl: data.imageUrl,
        title: data.title
    };
};

TaskManager.defineTask(PRICE_CHECK_TASK, async () => {
    const products = await AsyncStorage.getItem('savedProducts');
    if (!products) return BackgroundFetch.BackgroundFetchResult.NoData;

    const parsedProducts = JSON.parse(products);
    for (const product of parsedProducts) {
        const newData = await getProductInfo(product.url);
        if (newData.price !== product.price) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Price Changed!',
                    body: `${product.title} price changed from ${product.price} to ${newData.price}`,
                },
                trigger: null,
            });
        }
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
});


export async function registerBackgroundTask(interval: number) {
    // notifications aren't available on web
    if (Platform.OS === "web") {
        return;
    }

    await BackgroundFetch.registerTaskAsync(PRICE_CHECK_TASK, {
        minimumInterval: interval, // interval in seconds
        stopOnTerminate: false,
        startOnBoot: true,
    });
}
