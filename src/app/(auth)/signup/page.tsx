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
        // reset,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const handleSignup = (data: RegisterCredentials) => {
        signup(data, router);
    };

    const keys = Object.keys(errors) as (keyof typeof errors)[];
    
    return (
        <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your details below to create your account
                </p>
            </div>
            <div className="grid gap-6">
                {state.signup.status === 'SUCCESS' &&
                    <AlertNotif
                        type="default"
                        title="Sign Up Successful"
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
                    disabled={state.signup.status === 'LOADING'}>
                    Create Account
                </Button>
            </div>
            {(state.signup.status === 'ERROR' || keys.length > 0) &&
                <AlertNotif
                    type="destructive"
                    title={ keys.length > 0 ? 'Input Error' : 'Error Signing Up' }
                    message={ keys.length > 0 ?  `${keys.map(ky => errors[ky]?.message).join(' | ')}` : state.signup.message ?? '' } />
            }
            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                    Log In
                </Link>
            </div>
        </form>
    );
};

export default SignUp;