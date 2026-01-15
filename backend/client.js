import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    /// setting auto refresh to false since the service key is called directly
    { auth: { autoRefreshToken: false, persistSession: false } }
)

export default supabase;