
import React, { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log('[useSupabaseAuth] Setting up auth listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('[useSupabaseAuth] Auth event:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      console.log('[useSupabaseAuth] Initial session fetched');
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setInitializing(false);
    });

    return () => {
      console.log('[useSupabaseAuth] Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, initializing };
}
