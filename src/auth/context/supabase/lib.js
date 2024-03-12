import { createClient } from '@supabase/supabase-js';

import { SUPABASE_API } from 'src/config-global';

// ----------------------------------------------------------------------

const supabaseUrl = 'https://eextpljxhjrzbqhlnwtk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleHRwbGp4aGpyemJxaGxud3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NzQyNzAsImV4cCI6MjAyNDA1MDI3MH0.JtrgUQJImYf1iUfK9zsicXWhmbgsKUEUBMFwZJNt9dw';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
