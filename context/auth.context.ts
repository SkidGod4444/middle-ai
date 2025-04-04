/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getLoggedInUser } from "@/lib/appwrite/server";
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getLoggedInUser();
        setUser(fetchedUser ?? null);

      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
