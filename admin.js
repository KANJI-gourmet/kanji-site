(async function(){
 const msg=document.getElementById('adminMsg');
 const show=(t)=>{msg.textContent=t;msg.className='msg show err'};
 if(!window.kanjiSupabase){show('管理画面に接続できません。');return;}
 const {data:{user}}=await kanjiSupabase.auth.getUser();
 if(!user){location.replace('login.html');return;}
 const {data,error}=await kanjiSupabase.rpc('admin_member_overview');
 if(error){
   show('この管理画面を表示する権限がありません。');
   setTimeout(()=>location.replace('mypage.html'),1200);
   return;
 }
 const rows=data||[];
 document.getElementById('memberCount').textContent=String(rows.length);
 document.getElementById('confirmedCount').textContent=String(rows.filter(x=>x.email_confirmed_at).length);
 document.getElementById('favoriteCount').textContent=String(rows.reduce((n,x)=>n+Number(x.favorite_count||0),0));
 const fmt=(v)=>v?new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(v)):'-';
 const tbody=document.getElementById('memberRows');
 tbody.innerHTML='';
 rows.forEach(x=>{
   const tr=document.createElement('tr');
   tr.innerHTML='<td style="padding:10px;border-bottom:1px solid var(--line)">No.'+x.kanjin_no+'</td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line)"></td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line)">'+fmt(x.created_at)+'</td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line)">'+(x.email_confirmed_at?'認証済み':'未認証')+'</td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line)">'+fmt(x.last_sign_in_at)+'</td>'+
   '<td style="padding:10px;border-bottom:1px solid var(--line);text-align:right">'+Number(x.favorite_count||0)+'</td>';
   tr.children[1].textContent=x.email||'';
   tbody.appendChild(tr);
 });
})();