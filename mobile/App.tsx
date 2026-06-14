import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { getMovioWebUrl } from './src/config/getMovioWebUrl';

const movioWebUrl = getMovioWebUrl();

export default function App() {
  if (!movioWebUrl) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.centered}>
          <StatusBar style="dark" />
          <Text style={styles.title}>Movio mobile chưa được cấu hình URL.</Text>
          <Text style={styles.description}>
            Tạo file mobile/.env và đặt EXPO_PUBLIC_MOVIO_WEB_URL bằng LAN URL của Vite,
            ví dụ: http://192.168.1.20:5173
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <WebView
          source={{ uri: movioWebUrl }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#1F8D3F" />
              <Text style={styles.loadingText}>Đang mở Movio...</Text>
            </View>
          )}
          renderError={() => (
            <View style={styles.centered}>
              <Text style={styles.title}>Không mở được Movio web.</Text>
              <Text style={styles.description}>
                Kiểm tra điện thoại và máy tính có cùng Wi-Fi không, rồi chạy npm run web:lan.
              </Text>
            </View>
          )}
          allowsBackForwardNavigationGestures
          javaScriptEnabled
          domStorageEnabled
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E8'
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFF7E8'
  },
  loader: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7E8'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#7a3f12'
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#7a3f12',
    textAlign: 'center'
  },
  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#6b6257',
    textAlign: 'center'
  }
});
