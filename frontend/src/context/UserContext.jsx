import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../client';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    /// confirms the existing session
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    /// listens for changes like the user loginn out
    const { data: listener } = supabase.auth.onAuthStateChange(
        /// underscore attached to event so no warning or error is shown if we were to include ESLint (for future testing)
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

/// the custom hook created to let the user be accessed in all of the other components
export const useUser = () => useContext(UserContext);
