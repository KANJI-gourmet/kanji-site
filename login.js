const form=document.getElementById('loginForm'),msg=document.getElementById('msg');
function show(t,ok=false){msg.textContent=t;msg.className='msg show '+(ok?'ok':'err')}
function markLogin(){localStorage.setItem('kanji_login_started_at',String(Date.now()))}
async function handleEmailCallback(){
 if(!window.kanjiSupabase)return;
 try{
   const url=new URL(location.href);
   const code=url.searchParams.get('code');
   if(code){
     const {error}=await kanjiSupabase.auth.exchangeCodeForSession(code);
     if(error){show('メール確認に失敗しました。確認メールをもう一度お試しください。');return;}
   }
   const {data:{session}}=await kanjiSupabase.auth.getSession();
   if(session){
     markLogin();
     if(code||location.hash){history.replaceState({},document.title,'login.html');}
     location.replace('mypage.html');
   }
 }catch(e){}
}
form.addEventListener('submit',async e=>{e.preventDefault();
 if(!window.kanjiSupabase){show('会員システムの公開設定が未完了です。');return;}
 const email=document.getElementById('email').value.trim(),password=document.getElementById('password').value;
 const {error}=await kanjiSupabase.auth.signInWithPassword({email,password});
 if(error){show('メールアドレスまたはパスワードを確認してください。');return;}
 markLogin(); window.kanjiTrack?.('login',{method:'email'}); location.replace('mypage.html');
});
handleEmailCallback();
