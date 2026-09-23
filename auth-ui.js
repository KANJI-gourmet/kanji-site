(function(){
const MAX_AGE=14*24*60*60*1000;
async function getSession(){if(!window.kanjiSupabase)return null;try{const{data}=await kanjiSupabase.auth.getSession();return data?.session||null}catch(e){return null}}
async function enforceAge(session){
 if(!session||!session.user){localStorage.removeItem('kanji_login_started_at');return null}
 let started=Number(localStorage.getItem('kanji_login_started_at')||0);
 if(!started){started=Date.now();localStorage.setItem('kanji_login_started_at',String(started))}
 if(Date.now()-started>MAX_AGE){await kanjiSupabase.auth.signOut();localStorage.removeItem('kanji_login_started_at');return null}
 return session;
}
function draw(session){
 const root=document.getElementById('memberQuickNav'); if(!root)return;
 if(session&&session.user){
   root.innerHTML='<a class="pill" href="mypage.html">マイページ</a><button id="memberLogoutBtn" class="pill dark" type="button" style="cursor:pointer">ログアウト</button>';
   document.getElementById('memberLogoutBtn').onclick=async()=>{await kanjiSupabase.auth.signOut();localStorage.removeItem('kanji_login_started_at');location.replace('index.html')};
 }else{
   root.innerHTML='<a class="pill" href="login.html">ログイン</a><a class="pill dark" href="signup.html">会員登録</a>';
 }
}
async function refresh(){
 let session=await getSession(); session=await enforceAge(session); draw(session);
 const page=(location.pathname.split('/').pop()||'').toLowerCase();
 if((page==='login.html'||page==='signup.html')&&session&&session.user) location.replace('mypage.html');
}
document.addEventListener('DOMContentLoaded',refresh);
window.addEventListener('pageshow',refresh);
if(window.kanjiSupabase) kanjiSupabase.auth.onAuthStateChange(()=>refresh());
})();