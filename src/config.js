// Claves públicas de Supabase (la "publishable key" está pensada para ir en el navegador).
// Puedes sobrescribirlas con un archivo .env (ver .env.example).
export const CFG = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://lwspjqgpzlqgvrtacvwd.supabase.co',
  supabaseKey: import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_78xVlzJY64OWDX_0cyeFlA_79hq7quT',
};
