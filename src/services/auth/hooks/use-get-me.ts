import { usePrivateRequest } from '@/lib/network';
import { UserProfileResponse } from '../types';
import { meUser } from '../api/me-user';

export const useFetchUserProfile = () => {
  const { privateRequest } = usePrivateRequest<UserProfileResponse>();

  const fetchUserProfile = async () => {
    return await meUser(privateRequest);
  };

  return { fetchUserProfile };
};
