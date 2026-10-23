import { Redirect, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAuthenticatedSession, type AuthenticatedSession } from '../../api/session';
import { RideColors } from '../../constants/theme';

export default function DashboardLayout() {
  const [session, setSession] = useState<AuthenticatedSession | null | undefined>();
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    getAuthenticatedSession()
      .then((value) => {
        if (active) setSession(value);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Unable to read your sign-in session.');
        setSession(null);
      });
    return () => {
      active = false;
    };
  }, [retryKey]);

  if (session === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={RideColors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text accessibilityRole="alert" style={styles.message}>{error}</Text>
        <Text accessibilityRole="button" onPress={() => {
          setError('');
          setSession(undefined);
          setRetryKey((key) => key + 1);
        }} style={styles.retry}>
          Retry
        </Text>
      </View>
    );
  }

  if (!session) return <Redirect href="/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: RideColors.background },
  message: { color: RideColors.text, textAlign: 'center', lineHeight: 21 },
  retry: { color: RideColors.accent, fontWeight: '800', marginTop: 18, padding: 12 },
});
