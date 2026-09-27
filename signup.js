const form=document.getElementById('signupForm'),msg=document.getElementById('msg');
let submitting=false;
function show(t,ok=false){msg.textContent=t;msg.className='msg show '+(ok?'ok':'err')}
form.addEventListener('submit',async e=>{
 e.preventDefault();
 if(submitting)return;
 if(!window.kanjiSupabase){show('会員システムに接続できません。');return;}
 const email=document.getElementById('email').value.trim();
 const p=document.getElementById('password').value;
 const p2=document.getElementById('password2').value;
 if(p!==p2){show('確認用パスワードが一致しません。');return;}
 if(p.length<8){show('パスワードは8文字以上で設定してください。');return;}
 const btn=form.querySelector('button[type="submit"]');
 submitting=true;
 if(btn){btn.disabled=true;btn.textContent='登録処理中…';}
 try{
   const redirect=(window.KANJI_CONFIG?.SITE_URL||location.origin+location.pathname.replace(/[^/]+$/,''))+'login.html';
   const {error}=await kanjiSupabase.auth.signUp({email,password:p,options:{emailRedirectTo:redirect}});
   if(error){
     if(error.code==='over_email_send_rate_limit'||error.status===429){
       show('確認メールの送信上限に達しています。しばらく時間をおいてから、もう一度お試しください。');
     }else if(error.code==='unexpected_failure'){
       show('登録処理が重複した可能性があります。確認メールが届いていないかご確認ください。届いていない場合は、時間をおいて再度お試しください。');
     }else{
       show('登録できませんでした。時間をおいて再度お試しください。');
     }
     return;
   }
   window.kanjiTrack?.('sign_up',{method:'email'});
   show('確認メールを送信しました。メール内のリンクから登録を完了してください。',true);
 }catch(e){
   show('通信エラーが発生しました。時間をおいて再度お試しください。');
 }finally{
   submitting=false;
   if(btn){btn.disabled=false;btn.textContent='無料会員登録';}
 }
});
