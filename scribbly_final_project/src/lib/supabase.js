import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crmsaxfhkgufjrpzzozd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybXNheGZoa2d1ZmpycHp6b3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjM4NzQsImV4cCI6MjA4OTI5OTg3NH0.5GeH0udamh_Mz6UqxABBi5FbHSLixpxl_S-T4nHumUQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
