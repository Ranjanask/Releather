export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  brand: string;
  condition: "New" | "Good" | "Worn" | "Damaged";
  price: number;
  suggestedPrice: number;
  status: "available" | "sold" | "recycled" | "pending-recycling";
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  itemsRecycled: number;
  co2Saved: number;
  createdAt: any;
}
