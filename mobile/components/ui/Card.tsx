import { View } from 'react-native';
import type { ViewProps } from 'react-native';

type Props = ViewProps & {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = '', ...props }: Props) {
  return (
    <View
      className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
