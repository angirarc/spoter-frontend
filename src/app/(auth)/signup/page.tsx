'use client';

import * as yup from "yup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";

import { RegisterCredentials } from "@/lib/types/payloads";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import AlertNotif from "@/components/alert-notif";

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).max(32).required(),
});

const SignUp = () => {
    const router = useRouter();
    const { signup, state } = useAuthStore();

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const handleSignup = (data: RegisterCredentials) => {
        signup(data, router);
    };

    const keys = Object.keys(errors) as (keyof typeof errors)[]; // TODO: fix this casting hell
    
    return (
        <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your details below to create your account
                </p>
            </div>
            <div className="grid gap-6">
                {state.login.status === 'ERROR' &&
                    <AlertNotif
                        type="destructive"
                        title="Error Signing Up"
                        message={state.login.message ?? ''} />
                }
                {state.login.status === 'SUCCESS' &&
                    <AlertNotif
                        type="default"
                        title="Login Successful"
                        message="You will be redirected to the homepage" />
                }
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" {...register('name')} />
                </div>
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
                    disabled={state.login.status === 'ERROR'}>
                    Create Account
                </Button>
            </div>
            {
                keys.length > 0 &&
                <ul className="text-sm px-4 py-3 bg-red-300 rounded-md list-disc list-inside">
                    {
                        keys.map((key) => (
                            <li key={key} className="text-black">{errors[key]?.message}</li>
                        ))
                    }
                </ul>
            }
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                </Link>
            </div>
        </form>
    );
};

export default SignUp;