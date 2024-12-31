import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Menu } from 'lucide-react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useSidebar } from '../context/SidebarContext';

export function Header({ route }: NativeStackHeaderProps) {
  const { setIsOpen } = useSidebar();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => setIsOpen(true)}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Menu size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{route.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuButton: {
    padding: 8,
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40, // Offset the menu button width to center the title
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

