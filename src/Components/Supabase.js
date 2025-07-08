import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pdrpfsmldkxtydwegyub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcnBmc21sZGt4dHlkd2VneXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMTIzNzMsImV4cCI6MjA2Njg4ODM3M30.o0hPx8hw2RN5f2gGhuKbrD8j6J9uiek9q9Wzxay4c7c'; // z Supabase > Project > API > anon public
export const supabase = createClient(supabaseUrl, supabaseKey);