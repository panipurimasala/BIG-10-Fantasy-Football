import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase API URL and public anon key
const supabaseUrl = 'https://wkwaulwgblacatvcthvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrd2F1bHdnYmxhY2F0dmN0aHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1NTUwODQsImV4cCI6MjA0NTEzMTA4NH0.joZqYEsKDTsodMIajplUCIzDo9ZpVS2ltXt7ovrDUGE';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

