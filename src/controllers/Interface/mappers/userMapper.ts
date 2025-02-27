import IUser from "../../../entities/userEntities";

export const mapUserProfile = (user: IUser) => {
    return {
      _id:user?._id,
      username: user?.username,
      role: user?.role,
      email: user?.email,
      phone: user?.phone,
      description: user?.description,
      country: user?.country,
      profilePic: user?.profilePic,
    };
};