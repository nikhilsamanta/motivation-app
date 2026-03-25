import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { AuthContext, AuthContextType } from '../../src/context/AuthContext';
import { api } from '../../src/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout, refreshProfile } = useContext(AuthContext) as AuthContextType;
  const [nameForm, setNameForm] = useState(user?.name || '');
  const [passwordForm, setPasswordForm] = useState('');
  
  const [nameMsg, setNameMsg] = useState({ type: '', text: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false);

  const handleTestNotification = async () => {
    setLoadingTest(true);
    try {
        // Fetch a real quote from the server to test with
        const quotesData = await api.quotes.getAll();
        const randomText = quotesData && quotesData.length > 0 
            ? quotesData[Math.floor(Math.random() * quotesData.length)].text 
            : "Keep going, you're doing great!";

        const { sendImmediateTestNotification } = require('../../src/hooks/useNotifications');
        await sendImmediateTestNotification(randomText);
        alert('Test notification with a real quote sent!');
    } catch (e: any) {
        alert('Failed to send test: ' + (e.message || 'Unknown error'));
    } finally {
        setLoadingTest(false);
    }
  };

  const handleNameUpdate = async () => {
    setNameMsg({ type: '', text: '' });
    setLoadingName(true);
    try {
      await api.auth.updateName(nameForm);
      await refreshProfile();
      setNameMsg({ type: 'success', text: 'Name updated successfully!' });
    } catch (e: any) {
      setNameMsg({ type: 'error', text: e.message || 'Failed to update name' });
    } finally {
      setLoadingName(false);
    }
  };

  const handlePasswordChange = async () => {
    setPassMsg({ type: '', text: '' });
    if (passwordForm.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setLoadingPass(true);
    try {
      await api.auth.changePassword(passwordForm);
      setPassMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm('');
    } catch (e: any) {
      setPassMsg({ type: 'error', text: e.message || 'Failed to change password' });
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account settings</Text>

        <View style={styles.card}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || '?'}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              {user?.referralCode && (
                <View style={styles.referralBadge}>
                  <Text style={styles.referralText}>Code: <Text style={styles.highlight}>{user.referralCode}</Text></Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Change Name</Text>
          {nameMsg.text ? (
            <View style={[styles.msgBox, nameMsg.type === 'error' ? styles.msgError : styles.msgSuccess]}>
              <Text style={nameMsg.type === 'error' ? styles.errText : styles.succText}>{nameMsg.text}</Text>
            </View>
          ) : null}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={nameForm}
            onChangeText={setNameForm}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handleNameUpdate} disabled={loadingName}>
            {loadingName ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Name</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Change Password</Text>
          {passMsg.text ? (
            <View style={[styles.msgBox, passMsg.type === 'error' ? styles.msgError : styles.msgSuccess]}>
              <Text style={passMsg.type === 'error' ? styles.errText : styles.succText}>{passMsg.text}</Text>
            </View>
          ) : null}
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Min 6 characters"
            placeholderTextColor="#888"
            secureTextEntry
            value={passwordForm}
            onChangeText={setPasswordForm}
          />
          <TouchableOpacity style={styles.button} onPress={handlePasswordChange} disabled={loadingPass}>
            {loadingPass ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Change Password</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { borderColor: '#7c5cfc', marginBottom: 12 }]} 
          onPress={handleTestNotification} 
          disabled={loadingTest}
        >
          {loadingTest ? <ActivityIndicator color="#7c5cfc" /> : <Text style={[styles.logoutText, { color: '#7c5cfc' }]}>Test Push Notification</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f13',
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(124, 92, 252, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7c5cfc',
  },
  avatarText: {
    fontSize: 24,
    color: '#7c5cfc',
    fontWeight: 'bold',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    color: '#aaa',
    marginTop: 2,
  },
  referralBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  referralText: {
    color: '#ddd',
    fontSize: 12,
  },
  highlight: {
    color: '#7c5cfc',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  label: {
    color: '#ddd',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#7c5cfc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  msgBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  msgError: {
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
  },
  msgSuccess: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  errText: { color: '#ff4d4f' },
  succText: { color: '#4ade80' },
  logoutButton: {
    marginTop: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4d4f',
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff4d4f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
