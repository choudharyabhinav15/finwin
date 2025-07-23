import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Platform } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import dashboardData from './dashboard-data.json';
import incomeData from './income-data.json';
import DateTimePicker from '@react-native-community/datetimepicker';

// For web date picker
let WebDatePicker: any = null;
if (Platform.OS === 'web') {
  try {
    WebDatePicker = require('react-datepicker').default;
    require('react-datepicker/dist/react-datepicker.css');
  } catch (e) {
    // react-datepicker not installed
    WebDatePicker = null;
  }
}

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(91, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false,
};

const FILTERS = [
  { label: '1 Month', value: 1 },
  { label: '2 Months', value: 2 },
  { label: '6 Months', value: 6 },
  { label: '1 Year', value: 12 },
  { label: 'Custom', value: 'custom' },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0); // 0: Spending, 1: Income
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState(1); // months
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  // Track if user has clicked Apply in custom mode
  const [customApplied, setCustomApplied] = useState(false);

  useEffect(() => {
    setData(tabIndex === 0 ? dashboardData : incomeData);
    setSelected(null);
    setLoading(false);
  }, [tabIndex]);

  // Reset customApplied when filter changes away from custom
  useEffect(() => {
    if (!customMode) setCustomApplied(false);
  }, [customMode, filter]);

  // Date filter logic
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth() - (typeof filter === 'number' ? filter : 1), now.getDate());

  // Memoize filteredData so it updates when dependencies change
  const filteredData = useMemo(() => {
    const filterFrom = customMode && customApplied && fromDate ? fromDate : defaultFrom;
    const filterTo = customMode && customApplied && toDate ? toDate : now;
    return data.filter(item => {
      const dateField = tabIndex === 0 ? item.Date : item.date;
      const itemDate = new Date(dateField);
      return itemDate >= filterFrom && itemDate <= filterTo;
    });
  }, [data, customMode, customApplied, fromDate, toDate, filter, tabIndex]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#5b00ff" />;
  }

  if (!data.length) {
    return <Text style={styles.error}>{t('No data found.')}</Text>;
  }

  // Aggregate by category/source
  const keyField = tabIndex === 0 ? 'Category' : 'Source';
  const categoryMap = {};
  filteredData.forEach(item => {
    const key = item[keyField];
    if (!categoryMap[key]) {
      categoryMap[key] = 0;
    }
    categoryMap[key] += Number(item.amount);
  });
  const colorPalette = [
    '#5b00ff', '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#00C49A', '#FF6F61', '#FFD700'
  ];
  // Pie chart data with category and total amount in label
  const pieData = Object.keys(categoryMap).map((cat, idx) => ({
    name: `${cat} (₹${categoryMap[cat]})`,
    rawName: cat,
    amount: categoryMap[cat],
    color: colorPalette[idx % colorPalette.length],
    legendFontColor: '#333',
    legendFontSize: 15,
  }));

  // Drilldown: when a pie section is clicked, show all entries for that category/source in a table
  const selectedCategory = selected || (pieData.length ? pieData[0] : null);
  const drilldownData = selectedCategory
    ? filteredData.filter(item => item[keyField] === selectedCategory.rawName)
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tabIndex === 0 ? t('Spending Breakdown') : t('Income Breakdown')}</Text>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tabIndex === 0 && styles.tabBtnActive]}
          onPress={() => setTabIndex(0)}
        >
          <Text style={[styles.tabBtnText, tabIndex === 0 && styles.tabBtnTextActive]}>{t('Spending')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tabIndex === 1 && styles.tabBtnActive]}
          onPress={() => setTabIndex(1)}
        >
          <Text style={[styles.tabBtnText, tabIndex === 1 && styles.tabBtnTextActive]}>{t('Income')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterBtn, filter === f.value && styles.filterBtnActive]}
            onPress={() => {
              setFilter(f.value);
              setCustomMode(f.value === 'custom');
              if (f.value !== 'custom') {
                setFromDate(null);
                setToDate(null);
              }
            }}
          >
            <Text style={styles.filterBtnText}>{t(f.label)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Show date pickers and apply button only if custom is selected */}
      {customMode && (
        <View style={styles.customDateRow}>
          <View style={styles.dateInputWrapper}>
            <Text style={styles.filterBtnText}>{t('From')}</Text>
            {Platform.OS === 'web' && WebDatePicker ? (
              <WebDatePicker
                selected={fromDate || defaultFrom}
                onChange={date => setFromDate(date)}
                maxDate={toDate || now}
                dateFormat="yyyy-MM-dd"
                className="web-datepicker"
                style={{ width: 150 }}
              />
            ) : (
              <DateTimePicker
                value={fromDate || defaultFrom}
                mode="date"
                display="default"
                onChange={(_, date) => {
                  if (date) setFromDate(date);
                }}
                maximumDate={toDate || now}
                style={{ width: 150 }}
              />
            )}
          </View>
          <View style={styles.dateInputWrapper}>
            <Text style={styles.filterBtnText}>{t('To')}</Text>
            {Platform.OS === 'web' && WebDatePicker ? (
              <WebDatePicker
                selected={toDate || now}
                onChange={date => setToDate(date)}
                minDate={fromDate || defaultFrom}
                maxDate={now}
                dateFormat="yyyy-MM-dd"
                className="web-datepicker"
                style={{ width: 150 }}
              />
            ) : (
              <DateTimePicker
                value={toDate || now}
                mode="date"
                display="default"
                onChange={(_, date) => {
                  if (date) setToDate(date);
                }}
                minimumDate={fromDate || defaultFrom}
                maximumDate={now}
                style={{ width: 150 }}
              />
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, styles.applyBtn]}
            onPress={() => {
              setCustomApplied(true);
            }}
            disabled={!fromDate || !toDate}
          >
            <Text style={styles.filterBtnText}>{t('Apply')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Centered Pie Chart */}
      <View style={styles.centeredChartRow}>
        <PieChart
          data={pieData}
          width={screenWidth * 0.6}
          height={260}
          chartConfig={{
            ...chartConfig,
            propsForLabels: { fontSize: 15, fontWeight: 'bold' },
          }}
          accessor={'amount'}
          backgroundColor={'transparent'}
          paddingLeft={16}
          absolute
          hasLegend={false}
          avoidFalseZero
          onDataPointClick={({ index }) => setSelected(pieData[index])}
        />
      </View>
      {/* Category list below the chart */}
      <View style={styles.valueListRowCentered}>
        {pieData.map((item, idx) => (
          <View key={item.rawName} style={styles.valueListItemCentered}>
            <View style={[styles.valueDot, { backgroundColor: item.color }]} />
            <Text style={styles.valueListText}>{item.rawName}: ₹{item.amount}</Text>
          </View>
        ))}
      </View>
      {selectedCategory && (
        <View style={styles.highlight}>
          <Text style={styles.category}>{selectedCategory.rawName}</Text>
          <Text style={styles.amount}>₹{selectedCategory.amount}</Text>
        </View>
      )}
      {/* Drilldown Table */}
      {selectedCategory && drilldownData.length > 0 && (
        <View style={styles.drilldownTable}>
          <Text style={styles.drilldownTitle}>Details for {selectedCategory.rawName}</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Amount</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Date</Text>
          </View>
          {drilldownData.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>₹{item.amount}</Text>
              <Text style={styles.tableCell}>{tabIndex === 0 ? item.Date : item.date}</Text>
            </View>
          ))}
          <Text style={styles.drilldownFooter}>
            Showing {drilldownData.length} records from {drilldownData.length > 0 ? (tabIndex === 0 ? drilldownData[0].Date : drilldownData[0].date) : ''} to {drilldownData.length > 0 ? (tabIndex === 0 ? drilldownData[drilldownData.length-1].Date : drilldownData[drilldownData.length-1].date) : ''}
          </Text>
        </View>
      )}
      <FlatList
        data={pieData}
        keyExtractor={(item) => item.rawName}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={[styles.colorDot, { backgroundColor: item.color || '#ccc' }]} />
            <Text style={styles.listCategory}>{item.name}</Text>
            <Text style={styles.listAmount}>₹{item.amount}</Text>
          </View>
        )}
        style={{ marginTop: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5b00ff',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  tabBtnActive: {
    backgroundColor: '#5b00ff',
  },
  tabBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  filterBtnActive: {
    backgroundColor: '#5b00ff',
  },
  filterBtnText: {
    color: '#333',
    fontWeight: '500',
  },
  highlight: {
    marginTop: 24,
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5b00ff',
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '90%',
    alignSelf: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  listCategory: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5b00ff',
  },
  drilldownTable: {
    marginTop: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  drilldownTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#5b00ff',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 2,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
  },
  drilldownFooter: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  centeredChartRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  valueListRowCentered: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    elevation: 1,
  },
  valueListItemCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  valueDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  valueListText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  customDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    zIndex: 10, // Ensure datepickers are above chart
    elevation: 10, // For Android
    position: 'relative',
  },
  applyBtn: {
    backgroundColor: '#00b894', // Changed to a green shade
    marginLeft: 8,
  },
  dateInputWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 4,
    zIndex: 20, // Ensure each picker is above chart
    elevation: 20, // For Android
    position: 'relative',
    backgroundColor: '#fff', // Optional: helps on web
  },
});


export default Dashboard;
