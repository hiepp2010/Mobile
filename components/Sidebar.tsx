import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useEffect } from 'react';
import { X, Home, User, Apple, LogOut, ShoppingCart, UtensilsCrossed, Users, Bell, Refrigerator, LineChart, Shield } from 'lucide-react-native';
import { ROUTES } from '../config/routes';
import { useSidebar } from '../context/SidebarContext';

export function Sidebar() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useSidebar();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const navigateTo = (path: (typeof ROUTES)[keyof typeof ROUTES]) => {
    setIsOpen(false);
    router.push(path);
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: ROUTES.HOME },
    { icon: User, label: 'Profile', path: ROUTES.PROFILE },
    { icon: Apple, label: 'Foods', path: ROUTES.FOODS },
    { icon: ShoppingCart, label: 'Shopping List', path: ROUTES.SHOPPING_LIST },
    { icon: UtensilsCrossed, label: 'Meals', path: ROUTES.MEALS },
    { icon: Users, label: 'Groups', path: ROUTES.GROUPS },
    { icon: Bell, label: 'Invitations', path: ROUTES.INVITATIONS },
    { icon: Refrigerator, label: 'Refrigerator', path: ROUTES.REFRIGERATOR },
    { icon: LineChart, label: 'Nutrition', path: ROUTES.NUTRITION },
] as const;

  return (
    <View 
      style={[
        StyleSheet.absoluteFill, 
        { display: isOpen ? 'flex' : 'none' }
      ]}
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            width: screenWidth,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouch}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <TouchableOpacity 
            onPress={() => setIsOpen(false)} 
            style={styles.closeButton}
          >
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigateTo(item.path)}
            >
              <item.icon size={24} color="#000" />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            setIsOpen(false);
            router.replace(ROUTES.LOGIN);
          }}
        >
          <LogOut size={24} color="#FF4444" />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  overlayTouch: {
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    zIndex: 101,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutText: {
    color: '#FF4444',
  },
});

