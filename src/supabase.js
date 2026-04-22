import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eziioterdhlaqatrnubx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aWlvdGVyZGhsYXFhdHJudWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDI4MzUsImV4cCI6MjA5MjQxODgzNX0._HlB63GHE739SdAzdGt0jnOiU1gNoKRf9GivMr-Fax8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
