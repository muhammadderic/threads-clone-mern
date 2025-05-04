export type User = {
  _id: string;
  name?: string;
  email?: string;
  username: string;
  bio?: string;
  profilePic?: string;
  followers?: [];
};

export type Reply = {
  userId: string; // mongoose.Schema.Types.ObjectId
  text: string;
  userProfilePic?: string;
  username?: string;
  createdAt?: Date | string;
}

export type Post = {
  _id: string;
  postedBy: User;
  text: string;
  img?: string;
  likes: string[]; // Array of user IDs
  replies: Reply[];
  createdAt: Date | string;
  updatedAt: Date | string;
}