"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { createClient } from "@/utils/supabase/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"



const formSchema = z.object({
    email: z.string().email({ message: "Invalid Email Address" }),
    password: z.string().min(6, { message: "Password is too short" }),
    "confirm-pass": z.string().min(6, { message: "Password is too short" }),
}).refine(
    (data) => {
        if (data["confirm-pass"] !== data.password) {
            console.log("Password does't match");
            return false;
        } else {
            return true;
        }
    },
    { message: "Password does't match", path: ["confirm-pass"] }
);



const SignUp = () => {

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            "confirm-pass": "",
        },
    })


    async function signUpNewUser(email: string, password: string) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        const { data: { user } } = await supabase.auth.getUser()
        console.log(user)


        toast.success(
            "Email Registered!"
        );

        if (error) {

            console.error('Signup error:', error.message);
            return { success: false, message: error.message };
        } else {
            setIsSuccess(true);
            console.log('Signup success:', data);
            return { success: true, message: 'Signup successful', data: data };
        }

    }

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        if (values["confirm-pass"] !== values.password) {
            return;
        }
        await signUpNewUser(values.email, values.password);

    }

    const [passwordReveal, setPasswordReveal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input  {...field} className='h-8' placeholder="pikachu@gmail.com" type="email" />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold">
                                Password
                            </FormLabel>
                            <FormControl>
                                <div className=" relative">
                                    <Input
                                        className="h-8"
                                        type={
                                            passwordReveal
                                                ? "text"
                                                : "password"
                                        }
                                        {...field}
                                    />
                                    <div
                                        className="absolute right-2 top-[30%] cursor-pointer group"
                                        onClick={() =>
                                            setPasswordReveal(
                                                !passwordReveal
                                            )
                                        }
                                    >
                                        {passwordReveal ? (
                                            <FaRegEye className=" group-hover:scale-105 transition-all" />
                                        ) : (
                                            <FaRegEyeSlash className=" group-hover:scale-105 transition-all" />
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="confirm-pass" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold">
                            Confirm Password
                        </FormLabel>
                        <FormControl>
                            <div className=" relative">
                                <Input
                                    className="h-8"
                                    type={
                                        passwordReveal
                                            ? "text"
                                            : "password"
                                    }
                                    {...field}
                                />
                                <div
                                    className="absolute right-2 top-[30%] cursor-pointer group"
                                    onClick={() =>
                                        setPasswordReveal(
                                            !passwordReveal
                                        )
                                    }
                                >
                                    {passwordReveal ? (
                                        <FaRegEye className=" group-hover:scale-105 transition-all" />
                                    ) : (
                                        <FaRegEyeSlash className=" group-hover:scale-105 transition-all" />
                                    )}
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                    </FormItem>
                )} />

                <Button
                    type="submit"
                    className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center gap-2"
                >
                    Sign Up
                </Button>
            </form>
        </Form>
    )
}
export default SignUp;