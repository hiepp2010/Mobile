export interface FoodStatistic {
    id: number;
    foodName: string;
    total_bought: number;
    total_unbought: number;
    total_use_in_meal: number;
    remaining: number;
    need_to_buy: number;
  }
  
  export interface StatisticsResponse {
    status: string;
    statistics: FoodStatistic[];
  }
  
  