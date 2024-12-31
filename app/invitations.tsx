import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useInvitation } from '../hooks/useInvitation';
import { format } from 'date-fns';
import { Users, Check, X, RotateCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '../config/routes';

export default function InvitationsPage() {
  const router = useRouter();
  const { invitations, loading, error, loadInvitations, acceptInvitation } = useInvitation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadInvitations();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setRefreshing(false);
    }
  }, [loadInvitations]);

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      await acceptInvitation(invitationId);
      Alert.alert(
        'Success',
        'Invitation accepted successfully',
        [
          {
            text: 'View Group',
            onPress: () => router.push(ROUTES.GROUPS),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to accept invitation');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => loadInvitations()}
        >
          <RotateCw size={20} color="#007AFF" />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Group Invitations</Text>
      </View>

      {invitations.length === 0 ? (
        <View style={styles.emptyState}>
          <Users size={48} color="#666" />
          <Text style={styles.emptyStateText}>No pending invitations</Text>
          <Text style={styles.emptyStateSubtext}>
            When someone invites you to join their group, you'll see it here
          </Text>
        </View>
      ) : (
        invitations.map((invitation) => (
          <View key={invitation.id} style={styles.invitationCard}>
            <View style={styles.invitationHeader}>
              <Text style={styles.groupName}>{invitation.group.name}</Text>
              {/* <Text style={styles.invitationDate}>
                {format(new Date(invitation.created_at), 'yyyy-MM-dd')}
              </Text> */}
            </View>
            
            <View style={styles.invitationDetails}>
              {/* <Text style={styles.inviterInfo}>
                Invited by {invitation.inviter.name || invitation.inviter.username}
              </Text> */}
              {invitation.group.description && (
                <Text style={styles.groupDescription}>
                  {invitation.group.description}
                </Text>
              )}
              <Text style={styles.groupStats}>
                {invitation.group.participants} participant{invitation.group.participants !== 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAcceptInvitation(invitation.id)}
              >
                <Check size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Accept</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => {
                  // Rejection functionality would go here
                  Alert.alert('Coming Soon', 'Rejection functionality is not yet implemented');
                }}
              >
                <X size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  invitationCard: {
    margin: 10,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  invitationDate: {
    fontSize: 12,
    color: '#666',
  },
  invitationDetails: {
    marginBottom: 16,
  },
  inviterInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  groupStats: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 8,
    marginTop: 12,
  },
  retryText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

