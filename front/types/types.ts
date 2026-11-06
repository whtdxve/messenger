export interface Message {
    id: number;
    content: string;
    userId: number;
}

export interface OpponentData {
    tag: string;
    name: string;
    profileImage: string;
}

export interface ChatData {
    id: number;
    type: number;
    name: string;
    createdAt: string;
    messages: Message[];
}

export interface ChatInitializer {
    type: string;
    data: number;
}