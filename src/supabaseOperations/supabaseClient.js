// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these values with your Supabase project URL and anon key
const SUPABASE_URL = 'https://bqydopqekazcedqvpxzo.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeWRvcHFla2F6Y2VkcXZweHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ0NTg5MDgsImV4cCI6MjA0MDAzNDkwOH0.EXhHWzGBUIG5i4mW_WDsj1PbOAC7qG_fmb41KRGpDPc'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;






