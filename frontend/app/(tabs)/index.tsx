import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { AuthContext, AuthContextType } from '../../src/context/AuthContext';
import { api } from '../../src/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleDailyMotivation } from '../../src/hooks/useNotifications';

const gradients = [
  ['rgba(124, 92, 252, 0.15)', 'rgba(192, 132, 252, 0.08)'],
  ['rgba(244, 114, 182, 0.15)', 'rgba(251, 191, 36, 0.08)'],
  ['rgba(74, 222, 128, 0.15)', 'rgba(34, 211, 238, 0.08)'],
  ['rgba(251, 191, 36, 0.15)', 'rgba(244, 114, 182, 0.08)'],
  ['rgba(34, 211, 238, 0.15)', 'rgba(124, 92, 252, 0.08)'],
];

const accentColors = ['#7c5cfc', '#f472b6', '#4ade80', '#fbbf24', '#22d3ee'];

interface Quote {
  _id: string;
  text: string;
  author?: string;
}

export default function DashboardScreen() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      const data = await api.quotes.getAll();
      console.log(`Successfully fetched ${data?.length || 0} quotes`);
      setQuotes(data);
      
      // Schedule the next daily motivation with an original quote from the server
      if (data && data.length > 0) {
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        await scheduleDailyMotivation(randomQuote.text);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quotes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchQuotes();
  };

  const renderQuote = ({ item, index }: { item: Quote; index: number }) => {
    const accent = accentColors[index % accentColors.length];
    // Basic fallback styling for gradient feel without heavy deps
    return (
      <View style={[styles.card, { backgroundColor: gradients[index % gradients.length][0] }]}>
        <Text style={[styles.quoteMark, { color: accent }]}>❝</Text>
        <Text style={styles.quoteText}>{item.text}</Text>
        {item.author ? (
          <View style={styles.authorRow}>
            <View style={[styles.dash, { backgroundColor: accent }]} />
            <Text style={styles.authorText}>{item.author}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7c5cfc" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, <Text style={styles.highlight}>{user?.name || 'User'}</Text> 👋
        </Text>
        <Text style={styles.subtitle}>Here are today's motivational quotes for you.</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={(item) => item._id}
          renderItem={renderQuote}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>No Quotes Yet</Text>
              <Text style={styles.emptyText}>Quotes will appear here once they're added.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f13',
  },
  center: {
    flex: 1,
    backgroundColor: '#0f0f13',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  highlight: {
    color: '#7c5cfc',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  list: {
    padding: 16,
    paddingBottom: 100, // padding for bottom tabs
  },
  card: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  quoteMark: {
    fontSize: 48,
    opacity: 0.5,
    marginBottom: -20,
    marginTop: -10,
  },
  quoteText: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 28,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dash: {
    height: 2,
    width: 20,
    marginRight: 8,
  },
  authorText: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
    borderRadius: 8,
  },
  errorText: {
    color: '#ff4d4f',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
  },
});
