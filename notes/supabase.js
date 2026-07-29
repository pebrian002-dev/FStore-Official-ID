import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Ganti dengan URL dan Anon Key dari project Supabase Anda
const supabaseUrl = 'https://jzfgganmufbqpoheoxnd.supabase.co';
const supabaseKey = 'sb_publishable_4RuwoqCwFqfydyfAf2nkkQ_hFoqgnqK';

export const supabase = createClient(supabaseUrl, supabaseKey);