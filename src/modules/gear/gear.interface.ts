export interface ICreateGearPayload {
    name: string;
    description: string;
    price: number;
    stock: number; 
    brand?: string;
    imageUrl?: string;
    categoryId: string; 
}

export interface IUpdateGearPayload extends Partial<ICreateGearPayload> {}

export interface IGearQuery {
    searchTerm?: string;
    categoryId?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}