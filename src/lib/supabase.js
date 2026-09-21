import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lvtuznbuqmiskxntidyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dHV6bmJ1cW1pc2t4bnRpZHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MjgwNTYsImV4cCI6MjEwNDEwNDA1Nn0.gMeA90lbY8c9LzkFnhYMOGEHswqacQPLyYyrx-TovLs";

export const supabase = createClient(supabaseUrl, supabaseKey);