(async function(){
 const buttons=[...document.querySelectorAll('[data-favorite]')]; if(!buttons.length||!window.kanjiSupabase) return;
 const {data:{user}}=await kanjiSupabase.auth.getUser();
 let saved=new Set();
 if(user){const {data}=await kanjiSupabase.from('favorites').select('store_id').eq('user_id',user.id); saved=new Set((data||[]).map(x=>x.store_id));}
 for(const b of buttons){const id=b.dataset.favorite;if(saved.has(id)){b.textContent='♥ 保存済み';b.classList.add('saved')}
  b.addEventListener('click',async()=>{
   const {data:{user:current}}=await kanjiSupabase.auth.getUser(); if(!current){location.href='login.html';return;}
   const storeId=b.dataset.favorite, storeName=b.closest('.detail-view')?.querySelector('h1')?.textContent||storeId;
   if(b.classList.contains('saved')){const {error}=await kanjiSupabase.from('favorites').delete().eq('user_id',current.id).eq('store_id',storeId);if(error){alert('解除できませんでした。');return;}b.textContent='♡ 気になる店舗に保存';b.classList.remove('saved');window.kanjiTrack?.('remove_favorite',{store_id:storeId});}
   else{const {error}=await kanjiSupabase.from('favorites').upsert({user_id:current.id,store_id:storeId,store_name:storeName},{onConflict:'user_id,store_id'});if(error){alert('保存できませんでした。');return;}b.textContent='♥ 保存済み';b.classList.add('saved');window.kanjiTrack?.('add_favorite',{store_id:storeId});}
  });
 }
})();
