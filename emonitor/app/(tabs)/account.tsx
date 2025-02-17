import ParallaxScrollView from '@/components/ParallaxScrollView';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AccountScreen() {
    return (
      <ParallaxScrollView
          headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
          headerImage={
              <IconSymbol
                  size={310}
                  color="#808080"
                  name="minus"
                  style={styles.headerImage}
              />
          }
      >
      </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerImage: {
        marginTop: 10,
    },
})