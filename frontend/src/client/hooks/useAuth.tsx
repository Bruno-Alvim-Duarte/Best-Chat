/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import api from "../services/api";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { User } from "@/interfaces/User";

export const useAuth = () => {
    const history = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState<User>({} as User);
    const [loading, setLoading] = useState(false);



    api.interceptors.request.use(
        (config: any) => {    
          const token = getCookie('token');
    
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            setIsAuth(true);
          }
    
          return config;
        },
        (error: Error) => {
          Promise.reject(error);
        }
      );

      api.interceptors.response.use(
        (response: any) => {
          return response;
        },
        async (error: any) => {
          const originalRequest = error.config;
          if (error?.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
    
            const { data } = await api.post('/auth/refresh', {
                headers: {
                    Authorization: `Bearer ${getCookie('token')}`,
                }
            });
            if (data) {
              setCookie('token', data.token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
              });
              api.defaults.headers.Authorization = `Bearer ${data.token}`;
            }
            return api(originalRequest);
          }
          if (error?.response?.status === 401) {
            localStorage.removeItem('token');
            deleteCookie('token');
            (api as any).defaults.headers.Authorization = undefined;
            setIsAuth(false);
            history.push('/');
          }
          console.log('error', error?.Response?.status);
    
          return Promise.reject(error);
        }
      );

    const handleLogin = useCallback( async (email: string, password: string) => {
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            setCookie('token', response.data.accessToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });
            setUser(response.data.user);
            setIsAuth(true);
            toast.success('Login efetuado com sucesso!');
            return response.data;
        } catch (error) {
            console.error(error);
            return error;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = useCallback( async () => {
        setLoading(true);

    try {
      await api.delete('/auth/logout');
      setIsAuth(false);
      setUser({} as User);
      deleteCookie('token');
      localStorage.removeItem('token');
      (api as any).defaults.headers.Authorization = undefined;
      setLoading(false);
      setTimeout(() => {
        toast.success('Usuário desconectado com sucesso!');
        history.push('/');
      }, 500);
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
    }, [history]);

    return { isAuth, user, loading, handleLogin, handleLogout}
}