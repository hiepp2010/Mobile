export interface NutritionStats {
    totalCalories: number;
    totalProtein: number;
    totalCarbohydrates: number;
    totalFats: number;
    totalVitamins: number;
    totalMinerals: number;
    fromDate: string;
    toDate: string;
  }
  
  export interface NutritionStatsParams {
    fromDate?: string;
    toDate?: string;
  }
  
  export interface NutritionStatsResponse {
    error?: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbohydrates: number;
    totalFats: number;
    totalVitamins: number;
    totalMinerals: number;
    fromDate: string;
    toDate: string;
  }
  
  