(async function(){
 const msg=document.getElementById('msg'); if(!window.kanjiSupabase){msg.textContent='会員システムに接続できません。';msg.className='msg show err';return;}
 const {data:{user}}=await kanjiSupabase.auth.getUser(); if(!user){location.href='login.html';return;}
 document.getElementById('accountEmail').textContent=user.email||'';
 const {data:profile,error:profileError}=await kanjiSupabase.from('profiles').select('kanjin_no').eq('user_id',user.id).single();
 if(profile&&!profileError) document.getElementById('kanjinNo').textContent=String(profile.kanjin_no);
 const {data:favs}=await kanjiSupabase.from('favorites').select('store_id,store_name,created_at').eq('user_id',user.id).order('created_at',{ascending:false});
 const list=document.getElementById('favoriteList'); list.innerHTML='';
 if(!favs?.length){list.innerHTML='<div class="fine">まだ気になる店舗はありません。</div>'}
 else favs.forEach(x=>{const a=document.createElement('a');a.className='favitem';a.href='stores.html#'+encodeURIComponent(x.store_id);a.textContent=x.store_name||x.store_id;list.appendChild(a)});
 document.getElementById('logoutBtn').onclick=async()=>{await kanjiSupabase.auth.signOut();location.href='index.html'};
})();
