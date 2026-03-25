import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { api } from '../../src/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';

export default function ReferScreen() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.auth.getReferrals();
      setStats(data);
    } catch (e) {
      console.log('Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const copyToClipboard = async () => {
    if (user?.referralCode) {
      await Clipboard.setStringAsync(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareCode = async () => {
    if (user?.referralCode) {
      const message = `Hey! Join me on MotiVerse for daily motivational quotes. Use my referral code: ${user.referralCode}`;
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          // Sharing text directly in expo-sharing requires saving to a file first occasionally, 
          // or we can use the React Native Share API which is simpler for text.
          import('react-native').then(({ Share }) => {
            Share.share({
              message,
            });
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>Refer a Friend</Text>
        <Text style={styles.headerSubtitle}>Share wisdom and grow the community</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🤝</Text>
          <Text style={styles.heroTitle}>Invite your friends</Text>
          <Text style={styles.heroText}>Give your friends a daily dose of motivation. Share your unique code and see who joins!</Text>
          
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.code}>{user?.referralCode || 'N/A'}</Text>
              <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard}>
                <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.shareBtn} onPress={shareCode}>
            <Text style={styles.shareBtnText}>Share Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Impact</Text>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.referralCount || 0}</Text>
            <Text style={styles.statLabel}>Friends Joined</Text>
          </View>
          
          {stats?.referredUsers?.length > 0 && (
            <View style={styles.userList}>
              <Text style={styles.listTitle}>Recent Signups</Text>
              {stats.referredUsers.map((rUser, idx) => (
                <View key={idx} style={styles.userRow}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>{rUser.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{rUser.name}</Text>
                    <Text style={styles.userDate}>{new Date(rUser.createdAt).toLocaleDateString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 24,
  },
  heroCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(124, 92, 252, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.3)',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroText: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  codeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  codeLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  codeBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  code: {
    flex: 1,
    padding: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  copyBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderLeftWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  copyText: {
    color: '#fff',
    fontWeight: '600',
  },
  shareBtn: {
    backgroundColor: '#7c5cfc',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7c5cfc',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  userList: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  userDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
});
