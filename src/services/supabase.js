import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "...";
const SUPABASE_PUBLIC_API_KEY = "...";

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_API_KEY);
