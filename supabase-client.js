(function(){
  const c=window.KANJI_CONFIG||{};
  if(!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY){ window.kanjiSupabase=null; return; }
  window.kanjiSupabase = supabase.createClient(c.SUPABASE_URL,c.SUPABASE_ANON_KEY,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
})();
