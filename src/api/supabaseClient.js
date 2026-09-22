import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lvyomokjsajibekxecys.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eW9tb2tqc2FqaWJla3hlY3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NTc0NzYsImV4cCI6MjEwNTMzMzQ3Nn0.eAlax8kaTqKR7ySEW7XMul6rPZDAqisU8IW9DH0XHec'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)