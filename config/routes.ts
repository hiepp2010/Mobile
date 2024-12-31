export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  REGISTER: '/register',
  PROFILE: '/profile',
  FOODS: '/foods',
  SHOPPING_LIST: '/shopping-list',
  MEALS: '/meals',
  GROUPS: '/groups',
  GROUP_DETAILS: '/group-details',
  INVITATIONS: '/invitations',
  REFRIGERATOR: '/refrigerator', 
  NUTRITION: '/nutrition',
} as const;

// Type for our routes
export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

