import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  "https://wbyixphxcaqqleglaqhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWl4cGh4Y2FxcWxlZ2xhcWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODE5NjgsImV4cCI6MjA3MjI1Nzk2OH0.KvJvTGsGjYSA6vqppMEmb3ycEK4NW3_EnCzY4w9mFsM"
)
console.log(process.env.SUPABASE_URL, "process.env")
