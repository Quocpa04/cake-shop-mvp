import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../theme/theme';
import { OrderStatus } from '../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  logs: {
    status: OrderStatus;
    title: string;
    description: string;
    time: string;
  }[];
}

const ORDER_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'NEW', label: 'Đặt đơn', icon: 'receipt-outline' },
  { status: 'CONFIRMED', label: 'Xác nhận', icon: 'checkmark-circle-outline' },
  { status: 'IN_PRODUCTION', label: 'Làm bánh', icon: 'flame-outline' },
  { status: 'READY', label: 'Sẵn sàng', icon: 'gift-outline' },
  { status: 'DELIVERING', label: 'Đang giao', icon: 'bicycle-outline' },
  { status: 'COMPLETED', label: 'Đã nhận', icon: 'star-outline' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, logs }) => {
  const getStepIndex = (status: OrderStatus) => {
    return ORDER_STEPS.findIndex((s) => s.status === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <View style={styles.container}>
      {/* Horizontal step indicator */}
      <View style={styles.horizontalSteps}>
        {ORDER_STEPS.map((step, idx) => {
          const isDone = currentIndex >= idx;
          const isCurrent = currentIndex === idx;

          return (
            <React.Fragment key={step.status}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isDone && styles.stepCircleDone,
                    isCurrent && styles.stepCircleCurrent,
                  ]}
                >
                  <Ionicons
                    name={isDone ? 'checkmark' : (step.icon as any)}
                    size={14}
                    color={isDone ? '#FFFFFF' : THEME.colors.textMuted}
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isDone && styles.stepLabelDone,
                    isCurrent && styles.stepLabelCurrent,
                  ]}
                  numberOfLines={1}
                >
                  {step.label}
                </Text>
              </View>

              {idx < ORDER_STEPS.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    currentIndex > idx && styles.stepLineDone,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Detailed logs */}
      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Tiến trình chi tiết</Text>
        {logs.map((log, index) => (
          <View key={index} style={styles.logRow}>
            <View style={styles.logIndicator}>
              <View
                style={[
                  styles.logDot,
                  index === logs.length - 1 && styles.logDotActive,
                ]}
              />
              {index < logs.length - 1 && <View style={styles.logConnector} />}
            </View>
            <View style={styles.logContent}>
              <View style={styles.logHeader}>
                <Text style={styles.logItemTitle}>{log.title}</Text>
                <Text style={styles.logTime}>{log.time}</Text>
              </View>
              <Text style={styles.logDesc}>{log.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginVertical: THEME.spacing.sm,
  },
  horizontalSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  stepItem: {
    alignItems: 'center',
    width: 48,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  stepCircleCurrent: {
    backgroundColor: THEME.colors.secondary,
    borderColor: THEME.colors.secondary,
    transform: [{ scale: 1.15 }],
  },
  stepLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  stepLabelDone: {
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: THEME.colors.secondary,
    fontWeight: '800',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: THEME.colors.border,
    marginBottom: 16,
  },
  stepLineDone: {
    backgroundColor: THEME.colors.primary,
  },
  logsContainer: {
    marginTop: THEME.spacing.md,
  },
  logsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  logRow: {
    flexDirection: 'row',
    minHeight: 50,
  },
  logIndicator: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  logDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.border,
    marginTop: 4,
  },
  logDotActive: {
    backgroundColor: THEME.colors.secondary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  logConnector: {
    width: 2,
    flex: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 4,
  },
  logContent: {
    flex: 1,
    paddingBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  logTime: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  logDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
});
