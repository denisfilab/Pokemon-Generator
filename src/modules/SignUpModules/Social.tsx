"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";

const Social = ({ redirectTo }: { redirectTo: string }) => {
    const loginWithProvider = async (provider: "github" | "google") => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo:
                    window.location.origin +
                    `/auth/callback?next=` +
                    redirectTo,
            },
        });
    };

    return (
        <div className="w-full flex gap-2">
            <Button
                className="w-full h-8 flex items-center gap-5"
                variant="outline"
                onClick={() => loginWithProvider("github")}
            >
                <IoLogoGithub />
                Github
            </Button>
            <Button
                className="w-full h-8 flex items-center gap-2"
                variant="outline"
                onClick={() => loginWithProvider("google")}
            >
                <FcGoogle />
                Google
            </Button>
        </div>
    );
}
export default Social;