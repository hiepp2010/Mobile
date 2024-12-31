import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useNutrition } from '../hooks/useNutrition';
import { format, subDays } from 'date-fns';
import { RotateCw, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from 'react-native';
import React from 'react';

export default function NutritionPage() {
  const { stats, loading, error, loadNutritionStats } = useNutrition();
  const [refreshing, setRefreshing] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState(subDays(new Date(), 7));
  const [toDate, setToDate] = useState(new Date());

  const loadStats = useCallback(() => {
    loadNutritionStats({
      fromDate: format(fromDate, 'yyyy-MM-dd'),
      toDate: format(toDate, 'yyyy-MM-dd'),
    });
  }, [loadNutritionStats, fromDate, toDate]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadStats();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setRefreshing(false);
    }
  }, [loadStats]);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const chartData = stats ? {
    labels: ["Calories", "Protein", "Carbs", "Fats", "Vitamins", "Minerals"],
    datasets: [{
      data: [
        stats.totalCalories,
        stats.totalProtein,
        stats.totalCarbohydrates,
        stats.totalFats,
        stats.totalVitamins,
        stats.totalMinerals,
      ]
    }]
  } : null;

  const StatCard = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}{unit}</Text>
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
          onPress={loadStats}
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
        <Text style={styles.title}>Nutrition Statistics</Text>
      </View>

      <View style={styles.dateSelectors}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowFromDatePicker(true)}
        >
          <Calendar size={20} color="#007AFF" />
          <Text style={styles.dateButtonText}>
            From: {format(fromDate, 'MMM d, yyyy')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowToDatePicker(true)}
        >
          <Calendar size={20} color="#007AFF" />
          <Text style={styles.dateButtonText}>
            To: {format(toDate, 'MMM d, yyyy')}
          </Text>
        </TouchableOpacity>
      </View>

      {stats && (
        <>
          <View style={styles.statsGrid}>
            <StatCard label="Total Calories" value={stats.totalCalories} unit="kcal" />
            <StatCard label="Protein" value={stats.totalProtein} unit="g" />
            <StatCard label="Carbohydrates" value={stats.totalCarbohydrates} unit="g" />
            <StatCard label="Fats" value={stats.totalFats} unit="g" />
            <StatCard label="Vitamins" value={stats.totalVitamins} unit="mg" />
            <StatCard label="Minerals" value={stats.totalMinerals} unit="mg" />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Nutrition Overview</Text>
            {chartData && (
              <BarChart
                data={chartData}
                width={Dimensions.get("window").width - 32}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                showValuesOnTopOfBars
                fromZero
                style={styles.chart}
              />
            )}
          </View>
        </>
      )}

      {showFromDatePicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowFromDatePicker(false);
            if (date && event.type === 'set') {
              setFromDate(date);
            }
          }}
          maximumDate={toDate}
        />
      )}

      {showToDatePicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowToDatePicker(false);
            if (date && event.type === 'set') {
              setToDate(date);
            }
          }}
          minimumDate={fromDate}
          maximumDate={new Date()}
        />
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
  dateSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    gap: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
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
  chartContainer: {
    padding: 16,
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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

