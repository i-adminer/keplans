export interface ProductItem {
  id: string;
  name: string;
  slug?: string;
  image: string;
  price: number;
  description?: string;
}

export interface CartItem extends ProductItem {
  quantity: number;
}
