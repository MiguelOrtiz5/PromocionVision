import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AbsenceBarProps {
  subject: string;
  absences: number;
  maxAbsences: number;
}

export const AbsenceBar: React.FC<AbsenceBarProps> = ({ subject, absences, maxAbsences }) => {
  const percentage = (absences / maxAbsences) * 100;
  const barColor = absences >= maxAbsences ? '#FF0000' : '#000';

  return (
    <View style={styles.container}>
      <Text style={styles.subject}>{subject}</Text>
      <View style={styles.barContainer}>
        <Text style={styles.absenceCount}>{absences}</Text>
        <View style={styles.barBackground}>
          <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.absenceCount}>{maxAbsences}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  absenceCount: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
});
