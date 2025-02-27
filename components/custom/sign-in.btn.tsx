"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { OTPInput } from './otp-input';
import PHNInput from './phn-input';
import { Button } from '../ui/button';

export default function SignInBtn() {
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleComplete = (otp: string) => {
        console.log("Completed OTP:", otp);
        if (otp === "123456") {
            setStatus("success");
        } else {
            setStatus("error");
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className='relative w-3/4 items-center justify-center'>
            <PHNInput/>
            <Button className='w-full mt-5'>
                Send OTP
            </Button>
            </div>
            {/* <div className="relative w-full items-center justify-center">
                <OTPInput
                    length={6}
                    variant="default"
                    status={status}
                    onComplete={handleComplete}
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
            </motion.p> */}
        </div>
    );
}