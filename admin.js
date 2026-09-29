(async function(){
 const msg=document.getElementById('adminMsg');
 const show=(t)=>{msg.textContent=t;msg.className='msg show err'};
 if(!window.kanjiSupabase){show('管理画面に接続できません。');return;}
 const {data:{user}}=await kanjiSupabase.auth.getUser();
 if(!user){location.replace('login.html');return;}

 const {data:adminRows,error:adminError}=await kanjiSupabase.from('admin_users').select('user_id').eq('user_id',user.id);
 if(adminError||!adminRows?.length){
   show('この管理画面を表示する権限がありません。');
   setTimeout(()=>location.replace('mypage.html'),1200);
   return;
 }

 const [{data:profiles,error:profileError},{data:favorites,error:favoriteError}]=await Promise.all([
   kanjiSupabase.from('profiles').select('user_id,kanjin_no,email,created_at').order('kanjin_no',{ascending:true}),
   kanjiSupabase.from('favorites').select('user_id,store_id')
 ]);
 if(profileError||favoriteError){show('会員情報を取得できませんでした。');return;}

 const favCounts=new Map();
 (favorites||[]).forEach(x=>favCounts.set(x.user_id,(favCounts.get(x.user_id)||0)+1));
 const rows=profiles||[];

 document.getElementById('memberCount').textContent=String(rows.length);
 document.getElementById('favoriteCount').textContent=String((favorites||[]).length);
 document.getElementById('latestMemberNo').textContent=rows.length?'No.'+rows[rows.length-1].kanjin_no:'-';

 const fmt=(v)=>v?new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(v)):'-';
 const tbody=document.getElementById('memberRows');
 tbody.innerHTML='';
 rows.forEach(x=>{
   const tr=document.createElement('tr');
   tr.innerHTML='<td style="padding:10px;border-bottom:1px solid var(--line)">No.'+x.kanjin_no+'</td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line)"></td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line)">'+fmt(x.created_at)+'</td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line)">登録済み</td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line)">—</td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line);text-align:right">'+Number(favCounts.get(x.user_id)||0)+'</td>';
   tr.children[1].textContent=x.email||'';
   tbody.appendChild(tr);
 });
})();