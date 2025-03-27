import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer';
import { AuditData } from '@/types';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Loader2, Download, X } from 'lucide-react';

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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 4,
  },
  tableHeaderCell: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontWeight: 'bold',
    fontSize: 8,
    color: '#374151',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 3,
  },
  tableCell: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontSize: 8,
    color: '#4B5563',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
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
  },
  subsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

interface AuditReportProps {
  data: AuditData;
  downloadOnly?: boolean;
}

interface AirConditioningEquipment {
  roomName: string;
  quantity: number;
  inputPower: number;
  durationPerDay: number;
  daysPerWeek: number;
  roomLength?: number;
  roomWidth?: number;
  occupancy?: number;
  remarks?: string;
  coolingCapacity?: number;
  eer?: number;
  acType: string;
  otherAcType?: string;
}

interface LightingEquipment {
  roomName: string;
  quantity: number;
  power: number;
  durationPerDay: number;
  daysPerWeek: number;
  roomLength?: number;
  roomWidth?: number;
  occupancy?: number;
  remarks?: string;
}

interface OtherEquipment {
  equipmentName: string;
  quantity: number;
  power: number;
  durationPerDay: number;
  daysPerWeek: number;
  roomLength?: number;
  roomWidth?: number;
  occupancy?: number;
  remarks?: string;
  equipmentType: string;
}

// Calculate total energy consumption for each equipment type
const calculateTotalEnergy = (data: AuditData) => {
  // Air Conditioning calculation
  const acEnergy = data.airConditioning.reduce((total, item) => {
    const dailyHours = item.durationPerDay || 0;
    const monthlyDays = (item.daysPerWeek || 0) * 4; // Approximate monthly days
    const power = (item.inputPower || 0) * (item.quantity || 1); // Multiply by quantity
    const area = (item.roomLength || 0) * (item.roomWidth || 0);
    const occupancy = item.occupancy || 0;
    
    // Calculate base energy consumption
    let energy = dailyHours * monthlyDays * power;
    
    // Adjust for room size (larger rooms may need more energy)
    if (area > 0) {
      energy *= (1 + (area / 100)); // 1% increase per 100m²
    }
    
    // Adjust for occupancy (more people = more heat load)
    if (occupancy > 0) {
      energy *= (1 + (occupancy * 0.05)); // 5% increase per person
    }
    
    return total + energy;
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

const analyzeRemarks = (remarks: string, equipmentType: string, roomName: string, equipmentName?: string) => {
  const recommendations: string[] = [];
  const remark = remarks.toLowerCase();
  
  // Analyze sentiment and context
  const isNegative = remark.includes('not') || remark.includes('no') || remark.includes('never') || 
                     remark.includes('bad') || remark.includes('poor') || remark.includes('issue');
  const isUrgent = remark.includes('urgent') || remark.includes('immediate') || remark.includes('asap') || 
                   remark.includes('critical') || remark.includes('important');
  
  // Analyze equipment-specific concerns
  if (equipmentType === 'airConditioning') {
    // Temperature and comfort issues
    if (remark.includes('temperature') || remark.includes('cooling') || remark.includes('hot') || 
        remark.includes('cold') || remark.includes('comfort')) {
      recommendations.push(`Temperature control issues detected in ${roomName}: ${remarks}`);
    }
    
    // Air quality and health concerns
    if (remark.includes('air') || remark.includes('dust') || remark.includes('smell') || 
        remark.includes('mold') || remark.includes('health')) {
      recommendations.push(`Air quality concerns in ${roomName}: ${remarks}`);
    }
    
    // Performance and efficiency
    if (remark.includes('power') || remark.includes('energy') || remark.includes('bill') || 
        remark.includes('cost') || remark.includes('efficiency')) {
      recommendations.push(`Energy efficiency concerns in ${roomName}: ${remarks}`);
    }
  } else if (equipmentType === 'lighting') {
    // Lighting quality and comfort
    if (remark.includes('bright') || remark.includes('dim') || remark.includes('glare') || 
        remark.includes('dark') || remark.includes('light')) {
      recommendations.push(`Lighting quality issues in ${roomName}: ${remarks}`);
    }
    
    // Energy efficiency
    if (remark.includes('power') || remark.includes('energy') || remark.includes('bill') || 
        remark.includes('cost') || remark.includes('efficiency')) {
      recommendations.push(`Energy efficiency concerns in ${roomName}: ${remarks}`);
    }
  } else if (equipmentType === 'otherEquipment') {
    // Equipment-specific issues
    if (equipmentName) {
      // Computer-related issues
      if (equipmentName.toLowerCase().includes('computer')) {
        if (remark.includes('slow') || remark.includes('performance') || remark.includes('speed')) {
          recommendations.push(`Performance issues with ${equipmentName} in ${roomName}: ${remarks}`);
        }
      }
      
      // Printer-related issues
      if (equipmentName.toLowerCase().includes('printer')) {
        if (remark.includes('print') || remark.includes('paper') || remark.includes('ink')) {
          recommendations.push(`Printing issues with ${equipmentName} in ${roomName}: ${remarks}`);
        }
      }
      
      // Refrigerator-related issues
      if (equipmentName.toLowerCase().includes('refrigerator')) {
        if (remark.includes('temperature') || remark.includes('cooling') || remark.includes('ice')) {
          recommendations.push(`Cooling issues with ${equipmentName} in ${roomName}: ${remarks}`);
        }
      }
    }
  }
  
  // Common issues across all equipment types
  if (isNegative && isUrgent) {
    recommendations.push(`Urgent attention required for ${equipmentType} in ${roomName}: ${remarks}`);
  }
  
  // Age and maintenance concerns
  if (remark.includes('old') || remark.includes('age') || remark.includes('years')) {
    const ageMatch = remark.match(/\d+/);
    if (ageMatch) {
      const age = parseInt(ageMatch[0]);
      if (age > 5) {
        recommendations.push(`${equipmentType} in ${roomName} is ${age} years old. Consider replacement for better efficiency.`);
      }
    }
  }
  
  // Maintenance and repair needs
  if (remark.includes('maintenance') || remark.includes('repair') || remark.includes('fix') || 
      remark.includes('broken') || remark.includes('damaged')) {
    recommendations.push(`Maintenance required for ${equipmentType} in ${roomName}: ${remarks}`);
  }
  
  return recommendations;
};

const generateRecommendations = (data: AuditData, metrics: ReturnType<typeof calculateEfficiencyMetrics>) => {
  const recommendations: string[] = [];

  // Air Conditioning recommendations
  if (data.airConditioning.length > 0) {
    // Analyze remarks for each AC unit
    data.airConditioning.forEach(item => {
      if (item.remarks && item.remarks.trim()) {
        recommendations.push(...analyzeRemarks(item.remarks, 'airConditioning', item.roomName));
      }
    });

    // Technical metrics analysis
    const lowEERUnits = data.airConditioning.filter(item => item.eer < 3);
    if (lowEERUnits.length > 0) {
      recommendations.push(`${lowEERUnits.length} AC unit(s) have low Energy Efficiency Ratio (EER) values. Consider upgrading to more efficient models.`);
    }

    const highPowerUnits = data.airConditioning.filter(item => item.inputPower > 5000);
    if (highPowerUnits.length > 0) {
      recommendations.push(`${highPowerUnits.length} AC unit(s) have high power consumption. Consider implementing power management systems or upgrading to more efficient models.`);
    }
  }

  // Other Equipment recommendations
  if (data.otherEquipment.length > 0) {
    const otherEquipmentPower = data.otherEquipment.reduce((total, item) => {
      return total + ((item.power || 0) * (item.quantity || 1));
    }, 0);

    if (otherEquipmentPower > 5000) {
      recommendations.push("Review and optimize the usage of high-power equipment. Consider implementing power management systems.");
    }

    // Analyze remarks for each piece of equipment
    data.otherEquipment.forEach(item => {
      if (item.remarks && item.remarks.trim()) {
        recommendations.push(...analyzeRemarks(item.remarks, 'otherEquipment', item.roomName, item.equipmentName));
      }
    });
  }

  // Lighting recommendations
  if (data.lighting.length > 0) {
    const lightingPower = data.lighting.reduce((total, item) => {
      return total + ((item.power || 0) * (item.quantity || 1));
    }, 0);

    if (lightingPower > 2000) {
      recommendations.push("Consider upgrading to LED lighting to reduce energy consumption.");
    }

    // Analyze remarks for each lighting fixture
    data.lighting.forEach(item => {
      if (item.remarks && item.remarks.trim()) {
        recommendations.push(...analyzeRemarks(item.remarks, 'lighting', item.roomName));
      }
    });
  }

  return recommendations;
};

const calculateItemEnergy = (item: AirConditioningEquipment | LightingEquipment | OtherEquipment) => {
  const dailyHours = item.durationPerDay || 0;
  const monthlyDays = (item.daysPerWeek || 0) * 4; // Approximate monthly days
  const power = 'inputPower' in item ? item.inputPower : item.power;
  const totalPower = power * (item.quantity || 1);
  const area = (item.roomLength || 0) * (item.roomWidth || 0);
  const occupancy = item.occupancy || 0;
  
  // Calculate base energy consumption
  let energy = dailyHours * monthlyDays * totalPower;
  
  // Adjust for room size (larger rooms may need more energy)
  if (area > 0) {
    energy *= (1 + (area / 100)); // 1% increase per 100m²
  }
  
  // Adjust for occupancy (more people = more heat load)
  if (occupancy > 0) {
    energy *= (1 + (occupancy * 0.05)); // 5% increase per person
  }
  
  return energy / 1000; // Convert to kWh
};

const AuditReport = ({ data, downloadOnly = false }: AuditReportProps) => {
  const energyConsumption = calculateTotalEnergy(data);
  const metrics = calculateEfficiencyMetrics(data);
  const recommendations = generateRecommendations(data, metrics);

  // Generate consistent filename
  const generateFileName = (clientName: string) => {
    return `energy-audit-${clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  };

  const ReportContent = () => (
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
            <Text style={styles.sectionTitle}>EQUIPMENT INVENTORY</Text>
            
            {/* Air Conditioning Equipment */}
            {data.airConditioning.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Air Conditioning Equipment</Text>
                <View style={styles.table}>
              <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Room Name</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Occ.</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Qty</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Power</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>BTU</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>EER</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>AC Type</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Dimensions</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Usage</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>kWh</Text>
              </View>
              {data.airConditioning.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 1.2 }]}>{item.roomName}</Text>
                      <Text style={[styles.tableCell, { flex: 0.6 }]}>{item.occupancy || '-'}</Text>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</Text>
                      <Text style={[styles.tableCell, { flex: 0.6 }]}>{item.inputPower}</Text>
                      <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.coolingCapacity || '-'}</Text>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.eer || '-'}</Text>
                      <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.acType === 'Other' ? item.otherAcType : item.acType}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{item.roomLength && item.roomWidth ? `${item.roomLength}m × ${item.roomWidth}m` : '-'}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{item.durationPerDay} hrs/day, {item.daysPerWeek} days/wk</Text>
                      <Text style={[styles.tableCell, { flex: 0.7 }]}>{calculateItemEnergy(item).toFixed(2)}</Text>
                </View>
              ))}
            </View>
              </View>
            )}

            {/* Lighting Equipment */}
            {data.lighting.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Lighting Equipment</Text>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Room Name</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Occ.</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Qty</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Power</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Dimensions</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Usage</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>kWh</Text>
              </View>
              {data.lighting.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 1.2 }]}>{item.roomName}</Text>
                      <Text style={[styles.tableCell, { flex: 0.6 }]}>{item.occupancy || '-'}</Text>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</Text>
                      <Text style={[styles.tableCell, { flex: 0.6 }]}>{item.power}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{item.roomLength && item.roomWidth ? `${item.roomLength}m × ${item.roomWidth}m` : '-'}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{item.durationPerDay} hrs/day, {item.daysPerWeek} days/wk</Text>
                      <Text style={[styles.tableCell, { flex: 0.7 }]}>{calculateItemEnergy(item).toFixed(2)}</Text>
                </View>
              ))}
            </View>
              </View>
            )}

            {/* Other Equipment */}
            {data.otherEquipment.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Other Equipment</Text>
                <View style={styles.table}>
              <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Room Name</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Occ.</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Equipment Name</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Type</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Qty</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Power</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Usage</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>kWh</Text>
              </View>
              {data.otherEquipment.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{item.roomName}</Text>
                      <Text style={[styles.tableCell, { flex: 0.6 }]}>{item.occupancy || '-'}</Text>
                      <Text style={[styles.tableCell, { flex: 1.2 }]}>{item.equipmentName}</Text>
                      <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.equipmentType}</Text>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</Text>
                      <Text style={[styles.tableCell, { flex: 0.6 }]}>{item.power}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{item.durationPerDay} hrs/day, {item.daysPerWeek} days/wk</Text>
                      <Text style={[styles.tableCell, { flex: 0.7 }]}>{calculateItemEnergy(item).toFixed(2)}</Text>
                </View>
              ))}
            </View>
              </View>
            )}
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
  );

  if (downloadOnly) {
    return <ReportContent />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Energy Audit Report</h2>
        <PDFDownloadLink
          document={<ReportContent />}
          fileName={generateFileName(data.audit.clientName)}
        >
          {({ blob, url, loading, error }) => {
            if (loading) {
              return (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </Button>
              );
            }
            if (error) {
              return (
                <Button variant="destructive" disabled>
                  <X className="mr-2 h-4 w-4" />
                  Error generating PDF
                </Button>
              );
            }
            return (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            );
          }}
        </PDFDownloadLink>
      </div>
      <PDFViewer width="100%" height={600}>
        <ReportContent />
    </PDFViewer>
    </div>
  );
};

export default AuditReport; 