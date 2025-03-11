import { Knife } from "./Knife";

export interface Order {
    id: number;
    user: OrderUser;
    is_payed: boolean;
    items: ItemsPair[];
}

type ItemsPair = [Knife, number];

interface OrderUser {
    avatar: string;
    username: string;
}
