import { ReactNode, createContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { User, Session } from "@supabase/supabase-js";


type AuthContectType = {
    user: User | null | undefined;
    session: Session | null;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContectType>({
    user: null,
    session: null,
    signOut: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null | undefined>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // const setAuthData = async () => {
    //     const { data: { session }, error } = await supabase.auth.getSession();
    //     if (error) throw error
    //     setSession(session)
    //     setUser(session?.user)
    //     setLoading(false);
    // }
    
    useEffect(() => {

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user)
            setLoading(false)
        });

        // setAuthData()

        return () => {
          listener?.subscription.unsubscribe();
        };
    }, []);


    const value = {
        user: user, 
        session: session,
        signOut: () => {supabase.auth.signOut()}
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}
