import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer';
import { AuditData } from '@/types';

// Register fonts
Font.register({
  family: 'Times-Roman',
  src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times-New-Roman-Regular.ttf'
});

Font.register({
  family: 'Times-Bold',
  src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times-New-Roman-Bold.ttf'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 50,
    fontFamily: 'Times-Roman',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1 solid #000000',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLogo: {
    width: 70,
    height: 70,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    color: '#000000',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    marginTop: 5,
  },
  clientInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  clientInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  clientInfoLabel: {
    width: 100,
    fontSize: 11,
    color: '#666666',
    fontFamily: 'Times-Bold',
  },
  clientInfoValue: {
    flex: 1,
    fontSize: 11,
    color: '#000000',
  },
  section: {
    margin: '20 0',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: '0.5 solid #cccccc',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  summaryItem: {
    width: '48%',
    marginBottom: 15,
    marginRight: '2%',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
    fontFamily: 'Times-Bold',
  },
  summaryValue: {
    fontSize: 12,
    color: '#000000',
    fontFamily: 'Times-Bold',
  },
  table: {
    width: '100%',
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottom: '1 solid #000000',
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#000000',
    fontSize: 11,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    padding: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#333333',
  },
  recommendations: {
    marginTop: 20,
  },
  recommendationItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderLeft: '2 solid #000000',
  },
  recommendationNumber: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
    borderTop: '0.5 solid #cccccc',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 9,
    color: '#666666',
  }
});

interface AuditReportProps {
  data: AuditData;
}

// Calculate total energy consumption for each equipment type
const calculateTotalEnergy = (data: AuditData) => {
  // Air Conditioning calculation
  const acEnergy = data.airConditioning.reduce((total, item) => {
    const dailyHours = item.durationPerDay || 0;
    const monthlyDays = (item.daysPerWeek || 0) * 4; // Approximate monthly days
    const power = item.inputPower || 0;
    return total + (dailyHours * monthlyDays * power);
  }, 0);

  // Lighting calculation
  const lightingEnergy = data.lighting.reduce((total, item) => {
    const dailyHours = item.durationPerDay || 0;
    const monthlyDays = (item.daysPerWeek || 0) * 4; // Approximate monthly days
    const power = (item.power || 0) * (item.quantity || 1);
    const area = (item.roomLength || 0) * (item.roomWidth || 0);
    const powerDensity = area > 0 ? power / area : 0;
    
    return total + (dailyHours * monthlyDays * power);
  }, 0);

  // Other Equipment calculation
  const otherEnergy = data.otherEquipment.reduce((total, item) => {
    const dailyHours = item.durationPerDay || 0;
    const monthlyDays = (item.daysPerWeek || 0) * 4; // Approximate monthly days
    const power = (item.power || 0) * (item.quantity || 1);
    return total + (dailyHours * monthlyDays * power);
  }, 0);

  return {
    acEnergy: acEnergy / 1000, // Convert to kWh
    lightingEnergy: lightingEnergy / 1000,
    otherEnergy: otherEnergy / 1000,
    totalEnergy: (acEnergy + lightingEnergy + otherEnergy) / 1000,
  };
};

// Calculate energy efficiency metrics
const calculateEfficiencyMetrics = (data: AuditData) => {
  const totalArea = data.lighting.reduce((total, item) => {
    return total + ((item.roomLength || 0) * (item.roomWidth || 0));
  }, 0);

  const totalOccupancy = data.lighting.reduce((total, item) => {
    return total + (item.occupancy || 0);
  }, 0);

  const energyConsumption = calculateTotalEnergy(data);

  return {
    totalArea,
    totalOccupancy,
    energyPerArea: totalArea > 0 ? energyConsumption.totalEnergy / totalArea : 0,
    energyPerPerson: totalOccupancy > 0 ? energyConsumption.totalEnergy / totalOccupancy : 0,
  };
};

// Generate recommendations based on the data
const generateRecommendations = (data: AuditData, metrics: ReturnType<typeof calculateEfficiencyMetrics>) => {
  const recommendations: string[] = [];

  // Lighting recommendations
  const lightingPowerDensity = data.lighting.reduce((total, item) => {
    const area = (item.roomLength || 0) * (item.roomWidth || 0);
    const power = (item.power || 0) * (item.quantity || 1);
    return total + (area > 0 ? power / area : 0);
  }, 0) / data.lighting.length;

  if (lightingPowerDensity > 10) { // If power density is high
    recommendations.push("Consider upgrading to LED lighting to reduce power density and energy consumption.");
  }

  // Air Conditioning recommendations
  const acEfficiency = data.airConditioning.reduce((total, item) => total + (item.eer || 0), 0) / data.airConditioning.length;
  if (acEfficiency < 3) {
    recommendations.push("Consider upgrading air conditioning units to more energy-efficient models with higher EER ratings.");
  }

  // General recommendations based on metrics
  if (metrics.energyPerArea > 0.2) { // kWh per square meter
    recommendations.push("Implement energy management systems to optimize energy usage per area.");
  }

  if (metrics.energyPerPerson > 0.5) { // kWh per person
    recommendations.push("Consider implementing occupancy-based controls to reduce energy waste in low-occupancy periods.");
  }

  return recommendations;
};

const AuditReport = ({ data }: AuditReportProps) => {
  const energyConsumption = calculateTotalEnergy(data);
  const efficiencyMetrics = calculateEfficiencyMetrics(data);
  const recommendations = generateRecommendations(data, efficiencyMetrics);

  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                src="/ecg-logo.png"
                style={styles.headerLogo}
              />
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Energy Audit Report</Text>
                <Text style={styles.headerSubtitle}>Comprehensive Energy Analysis and Recommendations</Text>
              </View>
            </View>
          </View>

          {/* Client Information */}
          <View style={styles.clientInfo}>
            <View style={styles.clientInfoRow}>
              <Text style={styles.clientInfoLabel}>Client:</Text>
              <Text style={styles.clientInfoValue}>{data.audit.clientName}</Text>
            </View>
            <View style={styles.clientInfoRow}>
              <Text style={styles.clientInfoLabel}>Location:</Text>
              <Text style={styles.clientInfoValue}>{data.audit.locationFloor}</Text>
            </View>
            <View style={styles.clientInfoRow}>
              <Text style={styles.clientInfoLabel}>Branch:</Text>
              <Text style={styles.clientInfoValue}>{data.audit.envelopeBranch}</Text>
            </View>
            <View style={styles.clientInfoRow}>
              <Text style={styles.clientInfoLabel}>Auditor:</Text>
              <Text style={styles.clientInfoValue}>{data.audit.auditorName}</Text>
            </View>
            <View style={styles.clientInfoRow}>
              <Text style={styles.clientInfoLabel}>Date:</Text>
              <Text style={styles.clientInfoValue}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>

          {/* Energy Consumption Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Energy Consumption Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Air Conditioning</Text>
                <Text style={styles.summaryValue}>{energyConsumption.acEnergy.toFixed(2)} kWh/month</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Lighting</Text>
                <Text style={styles.summaryValue}>{energyConsumption.lightingEnergy.toFixed(2)} kWh/month</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Other Equipment</Text>
                <Text style={styles.summaryValue}>{energyConsumption.otherEnergy.toFixed(2)} kWh/month</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Energy Consumption</Text>
                <Text style={styles.summaryValue}>{energyConsumption.totalEnergy.toFixed(2)} kWh/month</Text>
              </View>
            </View>
          </View>

          {/* Equipment Inventory */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment Inventory</Text>
            
            {/* Air Conditioning */}
            <View style={styles.table}>
              <Text style={[styles.summaryLabel, { marginBottom: 10 }]}>Air Conditioning Units</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Room</Text>
                <Text style={styles.tableHeaderCell}>Power (W)</Text>
                <Text style={styles.tableHeaderCell}>Hours/Day</Text>
                <Text style={styles.tableHeaderCell}>EER</Text>
              </View>
              {data.airConditioning.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.roomName}</Text>
                  <Text style={styles.tableCell}>{item.inputPower}</Text>
                  <Text style={styles.tableCell}>{item.durationPerDay}</Text>
                  <Text style={styles.tableCell}>{item.eer}</Text>
                </View>
              ))}
            </View>

            {/* Lighting */}
            <View style={[styles.table, { marginTop: 20 }]}>
              <Text style={[styles.summaryLabel, { marginBottom: 10 }]}>Lighting Equipment</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Room</Text>
                <Text style={styles.tableHeaderCell}>Power (W)</Text>
                <Text style={styles.tableHeaderCell}>Quantity</Text>
                <Text style={styles.tableHeaderCell}>Hours/Day</Text>
              </View>
              {data.lighting.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.roomName}</Text>
                  <Text style={styles.tableCell}>{item.power * item.quantity}</Text>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                  <Text style={styles.tableCell}>{item.durationPerDay}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Energy Efficiency Recommendations</Text>
            <View style={styles.recommendations}>
              {recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationNumber}>Recommendation {index + 1}</Text>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            This report was generated by ECG Energy Audit System • {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default AuditReport; 