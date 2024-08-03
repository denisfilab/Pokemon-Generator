'use server'
import SignUp from '@/modules/SignUpModules/SignUp';
import Image from 'next/image';
import Social from '../../modules/SignUpModules/Social';
const Register = () => {
    const queryString =
        typeof window !== "undefined" ? window?.location.search : "";
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the 'next' parameter
    const next = urlParams.get("next");
    const verify = urlParams.get("verify");

    async function signUpNewUser(email: string, password: string) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Signup error:', error.message);
            return { success: false, message: error.message };
        } else {
            console.log('Signup success:', data);
            return { success: true, message: 'Signup successful', data: data };
        }
    }

    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <div className="w-[26rem] px-[3rem] py-[3rem] shadow border dark:border-zinc-800 rounded-md">
                <div className="py-5 space-y-5">
                    <div className="text-center space-y-3">
                        <Image
                            src={"/supabase.png"}
                            alt="supabase logo"
                            width={50}
                            height={50}
                            className=" rounded-full mx-auto"
                        />
                        <h1 className="font-bold">Create Account</h1>
                        <p className="text-sm">
                            Welcome! Please fill in the details to get started.
                        </p>
                    </div>
                    <Social redirectTo={next || "/"} />
                    <div className="flex items-center gap-5">
                        <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
                        <div className="text-sm">or</div>
                        <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
                    </div>
                </div>
                <SignUp />
            </div>
        </div>

    );
};
export default Register;