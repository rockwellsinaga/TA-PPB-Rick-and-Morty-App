import * as Haptics from 'expo-haptics';

const safely = (promise) => promise.catch(() => {});

export const selectionFeedback = () => safely(Haptics.selectionAsync());
export const successFeedback = () => safely(
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
);
export const errorFeedback = () => safely(
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
);
