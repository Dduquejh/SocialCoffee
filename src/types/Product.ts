export interface Product {
  productName: string;
  productDescription: string;
  productImage: any[]; // Cambia temporalmente a any[]
  productPrice: any;
  productIsActive: boolean;
  productSlug: string;
  productType: string;
  productSize: string;
  productStock?: number;
  productProcess?: string;
}