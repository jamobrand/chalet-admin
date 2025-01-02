import Logo from '@/components/logo';
import { ArrowRight, Loader } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginSchema } from './login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { LoginInput, loginUser } from '@/services/auth/api/login-user';
import { LoginOutput } from '@/services/auth/types';
import { useApiSend } from '@/lib/hooks/use-api-send';
import { useToast } from '@/hooks/use-toast';
import { useFetchUserProfile } from '@/services/auth/hooks/use-get-me';
import { useAuth } from '@/services/auth/context/use-auth';
import { useEffect } from 'react';

const Login = () => {
  const { toast } = useToast();
  const { setUser } = useAuth(); // Using setUser from AuthContext

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { fetchUserProfile } = useFetchUserProfile();

  const loginMutation = useApiSend<LoginOutput, Error, LoginInput>(
    loginUser,
    async (data: LoginOutput) => {
      // Set the token in cookies
      Cookies.set('chalet-token', data.token, { expires: 7, secure: true });

      // Fetch user profile after login
      const dataUser = await fetchUserProfile();

      // Set the user in the AuthContext
      setUser(dataUser.user);

      // Redirect the user based on their role
      if (dataUser.user.role === 'SUPER_ADMIN') {
        navigate(from, { replace: true });
      }

      toast({
        variant: 'success',
        title: 'Success',
        description: data.message || 'Successfully logged in',
      });
    },
    (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Error logging in!',
      });
    },
  );

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('chaletInfo');
    const token = Cookies.get('chalet-token');

    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      // Redirect based on user role
      if (user.role === 'SUPER_ADMIN') {
        navigate(from, { replace: true }); // Adjust the path based on your admin route
      }
    }
  }, [navigate, from]);

  return (
    <div className="w-full h-auto">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-[450px] mx-auto h-auto ">
          <main className="w-full min-h-[590px] h-auto max-w-full pt-10">
            <div className="w-full h-full p-5 rounded-md">
              <Logo />

              <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left">
                Log in to GRVL Chalet
              </h1>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="admin@heritagehotels.co.ke"
                              disabled={loginMutation.isPending}
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="********"
                              type="password"
                              disabled={loginMutation.isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* <div className="mb-4 flex w-full items-center justify-end">
                    <Link
                      className="text-sm dark:text-white hover:underline"
                      to={`/forgot-password?email=${form.getValues().email}`}
                    >
                      Forgot your password?
                    </Link>
                  </div> */}
                  <Button
                    className="w-full text-[15px] h-[40px] bg-[#27534c] hover:bg-[#1a3733] text-white font-semibold"
                    disabled={loginMutation.isPending}
                    type="submit"
                  >
                    {loginMutation.isPending && <Loader className="animate-spin" />}
                    Sign in
                    <ArrowRight />
                  </Button>
                </form>
              </Form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Login;
