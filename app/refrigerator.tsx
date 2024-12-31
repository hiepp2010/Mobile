import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { RotateCw, ShoppingCart, UtensilsCrossed } from 'lucide-react-native';

export default function RefrigeratorPage() {
  const { statistics, loading, error, loadStatistics } = useStatistics();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadStatistics();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setRefreshing(false);
    }
  }, [loadStatistics]);

  const StatCard = ({ label, value }: { label: string; value: number }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

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
          onPress={() => loadStatistics()}
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
        <Text style={styles.title}>Refrigerator</Text>
      </View>

      {statistics.length === 0 ? (
        <View style={styles.emptyState}>
          <ShoppingCart size={48} color="#666" />
          <Text style={styles.emptyStateText}>No food statistics available</Text>
          <Text style={styles.emptyStateSubtext}>
            Start by adding foods to your shopping list
          </Text>
        </View>
      ) : (
        statistics.map((stat) => (
          <View key={stat.id} style={styles.foodCard}>
            <View style={styles.foodHeader}>
              <Text style={styles.foodName}>{stat.foodName}</Text>
              <View style={[
                styles.statusBadge,
                stat.need_to_buy > 0 ? styles.warningBadge : styles.okBadge
              ]}>
                <Text style={styles.statusText}>
                  {stat.need_to_buy > 0 ? 'Need to Buy' : 'In Stock'}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <StatCard label="Total Bought" value={stat.total_bought} />
              <StatCard label="Remaining" value={stat.remaining} />
              <StatCard label="Used in Meals" value={stat.total_use_in_meal} />
              <StatCard label="Need to Buy" value={stat.need_to_buy} />
            </View>

            {stat.need_to_buy > 0 && (
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <ShoppingCart size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Add to Shopping List</Text>
                </TouchableOpacity>
              </View>
            )}
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
  foodCard: {
    margin: 10,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  okBadge: {
    backgroundColor: '#4CAF50',
  },
  warningBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
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

