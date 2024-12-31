export interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  vitamins: number;
  minerals: number;
  image_url?: string;
  serving_size?: string;
}

export interface CreateFoodData {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  vitamins: number;
  minerals: number;
  serving_size?: string;
}

export interface UpdateFoodData extends CreateFoodData {}

export interface GetFoodParams {
  page?: number;
  limit?: number;
}

export interface FoodResponse {
  message: string;
  food?: Food;
  foods?: Food[];
  totalPages?: number;
  currentPage?: number;
  image_url?: string;
}

export interface UploadImageResponse {
  message: string;
  imageUrl: string;
}

