import { Redirect, Stack, usePathname } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAuthenticatedSession, type AuthenticatedSession } from '../../api/session';
import { RideColors } from '../../constants/theme';

export default function DashboardLayout() {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthenticatedSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSession(await getAuthenticatedSession());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to read your sign-in session.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  if (loading) {
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
        <Text accessibilityRole="button" onPress={() => void loadSession()} style={styles.retry}>
          Retry
        </Text>
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  const requiredRole = pathname.startsWith('/dashboards/Drivers')
    ? 'driver'
    : 'passenger';
  if (session.role !== requiredRole) {
    return <Redirect href={session.role === 'driver'
      ? '/dashboards/Drivers/driver-dashboard'
      : '/dashboards/passenger/passenger-dashboard'} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: RideColors.background },
  message: { color: RideColors.text, textAlign: 'center', lineHeight: 21 },
  retry: { color: RideColors.accent, fontWeight: '800', marginTop: 18, padding: 12 },
});
