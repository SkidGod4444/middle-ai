/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { OTPInput } from './otp-input';
import PHNInput from './phn-input';
import { Button } from '../ui/button';
import useLocalStorage from '@/hooks/use-local';
import { Loader } from 'lucide-react';
import { createSession, createToken } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function SignInBtn() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [loading, setLoading] = useState(false);
    const [storedPhn, setStoredPhn] = useLocalStorage('mai-phn', '');
    const [storedUserId, setUserId] = useLocalStorage('mai-uid', '');
    const [phone, setPhone] = useState(storedPhn as string);
    const [uid, setUID] = useState(storedUserId as string);

    const handleOTP = async (otp: string) => {

        console.log("Completed OTP:", otp);
        try {
            if(otp && uid){
               const session = await createSession(uid, otp);
                if(session){

                    setStatus("success");
                    setUID('');
                    router.push("/dashboard");
                } else {
                    setStatus("error");
                    router.push("/auth");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOTPbtn = async () => {
        try {
            if (phone.length !== 0) {
                console.log('phone no:', phone);
                setStoredPhn(phone);
                setLoading(true);
                const token = await createToken(phone);
                console.log('token:', token)
                if (token) {
                    setUserId(token.userId);
                    setLoading(false);
                    setUID(token.userId);
                    console.log(uid);
                    console.log('token:', token)
                }
            }
        } catch (error) {
            setLoading(false);
            console.error("Error creating phone token:", error);
        }
    }

    return (
        <div className="flex flex-col items-center">
            {uid.length === 0 ? <div className='relative w-3/4 items-center justify-center'>
            <PHNInput value={phone} onChange={setPhone} />
            <Button className='w-full mt-5' onClick={handleOTPbtn}>
                {loading ? <Loader className='animate-spin size-5'/> : ("Send OTP")}
            </Button>
            </div> : (
                <>
                <div className="relative w-full items-center justify-center">
                <OTPInput
                    length={6}
                    variant="default"
                    status={status}
                    onComplete={handleOTP}
                />
                <AnimatePresence>
                    {status === "error" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-x-0 -bottom-8 text-center text-sm font-medium text-red-500 dark:text-red-400"
                        >
                            Invalid code. Please try again.
                        </motion.p>
                    )}
                    {status === "success" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-x-0 -bottom-8 text-center text-sm font-medium text-green-500 dark:text-green-400"
                        >
                            Verification successful!
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <motion.p
                className="mt-10 text-sm text-muted-foreground dark:text-muted-foreground/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Didn&apos;t receive the code?{" "}
                <motion.button
                    className="text-primary hover:underline dark:text-primary/90"
                    onClick={() => setStatus("idle")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Resend
                </motion.button>
            </motion.p>
            </>
            )}
        </div>
    );
}