export interface IFriendsLists{
    friends: IFriend[];
}

export interface IFriend {
    id: string;
    conversationId: string; 
    username?: string;   
    onlineStatus?: boolean; 
    profilePictureUrl?: string; 
  }
  