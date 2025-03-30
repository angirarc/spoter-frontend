'use client';

import * as yup from "yup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { LoginCredentials } from "@/lib/types/payloads";
import AlertNotif from "@/components/alert-notif";

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).max(32).required(),
});

const Login = () => {
    const router = useRouter();
    const { login, state } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const handleLogin = (data: LoginCredentials) => {
        login(data, router);
    };

    const keys = Object.keys(errors) as (keyof typeof errors)[];

    return (
        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                {state.login.status === 'SUCCESS' &&
                    <AlertNotif
                        type="default"
                        title="Login Successful"
                        message="You will be redirected to the homepage" />
                }
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" {...register('password')} />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={state.login.status === 'LOADING'}>
                    Login
                </Button>
                {(state.login.status === 'ERROR' || keys.length > 0) &&
                    <AlertNotif
                        type="destructive"
                        title={ keys.length > 0 ? 'Input Error' : 'Error Logging In' }
                        message={ keys.length > 0 ?  `${keys.map(ky => errors[ky]?.message).join(', ')}` : state.login.message ?? '' } />
                }
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                </Link>
            </div>
        </form>
    );
};

export default Login;