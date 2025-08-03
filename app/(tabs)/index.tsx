//gfvdvdv
import { Ionicons } from '@expo/vector-icons';
import { onValue, ref } from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { CircularProgress } from 'react-native-circular-progress';
import { database } from '../../firebase';

const HomeScreen = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null); // No default, use database value
  const [humidity, setHumidity] = useState<number | null>(null);
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('N/A');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const sensorRef = ref(database, 'sensor');

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Firebase Data:', JSON.stringify(data, null, 2));
        setTemperature(data.temperature || null);
        setSoilMoisture(data.soil_moisture || null); // Updated to match 'soil_moisture'
        setHumidity(data.humidity || null);
        setTempHistory((prev) => [...prev.slice(-5), data.temperature || 0].slice(-5));
        setLastUpdate(new Date().toLocaleString());
      } else {
        setTemperature(null);
        setSoilMoisture(null);
        setHumidity(null);
        setLastUpdate('N/A');
        console.log('No data available at sensor path');
      }
      setLoading(false);
    }, (err) => {
      setError(`Firebase Error: ${err.message} (Code: ${err.code})`);
      console.log('Error fetching data:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => {
          setLoading(true);
          setError(null);
        }}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={() => {
          setLoading(true);
          setError(null);
        }}>
          <Ionicons name="refresh-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.timestamp}>Last update: {lastUpdate}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weather</Text>
        <View style={styles.weatherBody}>
          <Ionicons name="sunny" size={64} color="#FFC700" />
          <View>
            <Text style={styles.weatherTemp}>31°C</Text>
            <Text style={styles.weatherDesc}>Probability rain: 15%</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Temperature</Text>
          <View style={styles.gaugeContainer}>
            <CircularProgress
              size={120}
              width={12}
              fill={temperature ? (temperature / 50) * 100 : 0}
              tintColor="#00e0ff"
              backgroundColor="#3d5875">
              {
                (fill) => (
                  <Text style={styles.gaugeText}>
                    {temperature !== null ? `${temperature}°C` : 'N/A'}
                  </Text>
                )
              }
            </CircularProgress>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Soil Moisture</Text>
          <View style={styles.gaugeContainer}>
            <CircularProgress
              size={120}
              width={12}
              fill={soilMoisture !== null ? soilMoisture : 0} // Use actual value or 0
              tintColor="#795548"
              backgroundColor="#D7CCC8">
              {
                (fill) => (
                  <Text style={styles.gaugeText}>
                    {soilMoisture !== null ? `${soilMoisture}%` : 'N/A'}
                  </Text>
                )
              }
            </CircularProgress>
          </View>
        </View>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Humidity</Text>
          <View style={styles.gaugeContainer}>
            <CircularProgress
              size={120}
              width={12}
              fill={humidity !== null ? humidity : 0} // Use actual value or 0
              tintColor="#2196F3"
              backgroundColor="#BBDEFB">
              {
                (fill) => (
                  <Text style={styles.gaugeText}>
                    {humidity !== null ? `${humidity}%` : 'N/A'}
                  </Text>
                )
              }
            </CircularProgress>
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Consumption</Text>
        <BarChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{ data: [20, 45, 28, 80, 99] }]
          }}
          width={Dimensions.get('window').width - 64}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Temperature History</Text>
        <LineChart
          data={{
            labels: ["-4m", "-3m", "-2m", "-1m", "Now"],
            datasets: [{ data: tempHistory.length > 1 ? tempHistory : [0, 0, 0, 0, 0] }]
          }}
          width={Dimensions.get('window').width - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F0F4F7',
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F7',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 32
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333'
  },
  timestamp: {
    width: '100%',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  halfCard: {
    width: '48%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  gaugeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  weatherBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333'
  },
  weatherDesc: {
    fontSize: 16,
    color: '#666'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;