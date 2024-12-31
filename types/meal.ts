export interface MealFood {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
    vitamins: number;
    minerals: number;
    quantity: number;
    serving_size?: string;
  }
  
  export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
  
  export interface Meal {
    id: number;
    name: string;
    meal_type: MealType;
    date: string;
    total_calories: number;
    total_protein: number;
    total_carbohydrates: number;
    total_fats: number;
    foods: MealFood[];
  }
  
  export interface CreateMealData {
    name: string;
    meal_type: MealType;
    date: string;
    foods: Array<{
      id: number;
      name: string;
      calories: number;
      protein: number;
      carbohydrates: number;
      fats: number;
      vitamins: number;
      minerals: number;
      quantity: number;
      serving_size?: string;
    }>;
  }
  
  export interface UpdateMealInfoData {
    name: string;
    meal_type: MealType;
    date: string;
  }
  
  export interface UpdateMealFoodData {
    foods: Array<{
      food_id: number;
      quantity: number;
    }>;
  }
  
  export interface GetMealsParams {
    page?: number;
    limit?: number;
    meal_type?: MealType;
    from_date?: string;
    to_date?: string;
  }
  
  export interface MealResponse {
    total_pages: number;
    meals: Meal[];
    message?: string;
    id?: number;
    name?: string;
    meal_type?: MealType;
    date?: string;
    total_calories?: number;
    total_protein?: number;
    total_carbohydrates?: number;
    total_fats?: number;
    foods?: MealFood[];
  }
  
  