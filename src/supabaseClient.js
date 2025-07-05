import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_RETREAT_POS_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_RETREAT_POS_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
