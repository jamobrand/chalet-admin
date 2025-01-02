import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  VerificationInput,
  VerificationResponse,
  verifyUser,
} from '@/services/auth/api/confirm-account';
import { useApiSend } from '@/lib/hooks/use-api-send';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const ConfirmAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const code = params.get('code');

  const confirmMutation = useApiSend<VerificationResponse, Error, VerificationInput>(
    verifyUser,
    async (data: VerificationResponse) => {
      // Redirect the user to the original route or dashboard
      toast({
        variant: 'success',
        title: 'Success',
        description: data.message || 'Account confirmed successfully',
      });
      // navigate(from, { replace: true });
    },
    (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Something went wrong',
      });
    },
  );
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!code) {
      toast({
        title: 'Error',
        description: 'Confirmation token not found',
        variant: 'destructive',
      });
      return;
    }
    confirmMutation.mutate(
      {
        code: code,
      },
      {
        onSuccess: () => {
          navigate('/');
        },
      },
    );
  };

  return (
    <div className="w-full h-auto">
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-[450px] mx-auto h-auto ">
    <main className="w-full min-h-[590px] h-full max-w-full flex items-center justify-center ">
      <div className="w-full h-full p-5 rounded-md">
        <Logo />

        <h1
          className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-4 mt-8
          text-center sm:text-left"
        >
          Account confirmation
        </h1>
        <p className="mb-6 text-center sm:text-left text-[15px] dark:text-[#f1f7feb5] font-normal">
          To confirm your account, please follow the button below.
        </p>
        <form onSubmit={handleSubmit}>
          <Button
            disabled={confirmMutation.isPending}
            type="submit"
            className="w-full text-[15px] h-[40px] bg-[#27534c] hover:bg-[#1a3733] text-white font-semibold"
          >
            {confirmMutation.isPending && <Loader className="animate-spin" />}
            Confirm account
          </Button>
        </form>
      </div>
    </main>
    </div>
      </div>
    </div>
  );
};

export default ConfirmAccount;
