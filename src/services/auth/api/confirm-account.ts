import { publicRequest } from "@/lib/network";

export interface VerificationInput {
  code: string;
}

export interface VerificationResponse {
  message: string;
}


export const verifyUser = async (data: VerificationInput): Promise<VerificationResponse> => {
  const response = await publicRequest<VerificationResponse>({
    url: '/v1/auth/verify/email',
    method: 'post',
    data,
  });
  return response;
};
