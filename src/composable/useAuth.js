import { ROUTES_PATHS } from "@/constants";
import { supabase } from "@/lib/supabase";
import { ref, onMounted } from "vue";

const user = ref(null);
const loading = ref(true);

export function useAuth() {
  onMounted(async () => {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;
    loading.value = false;

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
    });
  });

  async function register({ email, password, firstName, lastName, nickname }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, nickname }
      },
    });
    if (error) throw error;
    return data;
  };

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  async function logout() {
    await supabase.auth.signOut();
    user.value = null;
    window.location.href = ROUTES_PATHS.HOME;
  };

  return { user, loading, register, login, logout }
};