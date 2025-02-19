'use client';

import Button from '../design-system/Button';
import BestChatLogo from '../../../public/Best-Chat.jpeg';
import emailSvg from '../../../public/email.svg';
import lockSvg from '../../../public/lock.svg';
import Image from 'next/image';
import InputWithTrailingIcon from '../design-system/InputWithTrailingIcon';
import { useAuth } from '@/client/hooks/useAuth';
import { useState } from 'react';

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });

  const handleChangeInput = (e: { target: { name: string; value: string } }) => {
    setUser((prevUser: { email: string; password: string }) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleLogin(user.email, user.password);
  };

  const { handleLogin } = useAuth();
  return (
    <main className="h-screen flex items-center justify-center relative overflow-hidden bg-loginBG">
      <div className="w-full h-[70%] flex">
        <div className="w-[50%] flex flex-col items-center justify-center">
          <Image src={BestChatLogo} alt="" className="w-[20%]" />
          <h1 className="font-medium text-3xl my-2">
            Sobre o <span className="text-secondary">Best Chat</span>
          </h1>
          <p className="w-[80%] text-sm">
            Best Chat é um projeto criado por Bruno Alvim Duarte. Ele foi criado com a
            intenção de expor meus conhecimentos em NextJS e NestJS. Lorem ipsum Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus luctus nisl
            a mattis. Cras feugiat varius lectus nec lacinia. Ut sed elit suscipit,
            tristique libero et, mollis magna. Pellentesque pharetra elit velit, dapibus
            dapibus sem viverra viverra. Ut condimentum at arcu ac accumsan. Phasellus a
            scelerisque est. Sed sit amet turpis leo. Aenean dapibus leo felis. Aenean nec
            convallis sapien. Donec elit urna, viverra ut hendrerit a, tempor quis risus.
            Aenean ligula est, pharetra vitae consectetur ut, lobortis at turpis. Ut ac
            quam nulla. Mauris bibendum ex massa, ac dignissim turpis mattis et. Duis a
            elementum lacus. Vestibulum quis maximus mauris, id malesuada tortor. Donec
            aliquet risus a arcu tristique ornare. Donec mollis pretium massa non
            tincidunt. Nullam ac ex nisi. Maecenas viverra elit a consectetur accumsan.
            Donec vel cursus lectus, vitae faucibus ipsum. Integer sed lacinia tellus.
            Mauris ac sapien lorem.
          </p>
        </div>
        <span className="border-white border-x-2 rounded-xl h-full mx-5" />
        <div className="w-[50%] flex flex-col items-center justify-center gap-4">
          <h1 className="font-medium text-3xl my-2">Faça Login</h1>
          <p className="text-sm">Preencha com seu email e senha</p>
          <form
            className="w-full flex-col flex items-center gap-4"
            onSubmit={handleSubmit}
          >
            <InputWithTrailingIcon
              inputType="email"
              placeholder="Email"
              svgPath={emailSvg}
              value={user.email}
              onChange={handleChangeInput}
              name={'email'}
            />
            <InputWithTrailingIcon
              inputType="password"
              placeholder="Senha"
              svgPath={lockSvg}
              value={user.password}
              onChange={handleChangeInput}
              name={'password'}
            />
            <div className="flex items-center gap-2 my-3">
              <input type="checkbox" name="rememberMe" id="rememberMe" />
              <label htmlFor="rememberMe" className="text-sm">
                Lembre de mim
              </label>
            </div>
            <Button variant="secondary" className="relative w-[50%]" type="submit">
              Log in
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
