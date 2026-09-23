const form=document.getElementById('signupForm'),msg=document.getElementById('msg');
function show(t,ok=false){msg.textContent=t;msg.className='msg show '+(ok?'ok':'err')}
form.addEventListener('submit',async e=>{e.preventDefault();
 if(!window.kanjiSupabase){show('会員システムに接続できません。');return;}
 const email=document.getElementById('email').value.trim(),p=document.getElementById('password').value,p2=document.getElementById('password2').value;
 if(p!==p2){show('確認用パスワードが一致しません。');return;}
 if(p.length<8){show('パスワードは8文字以上で設定してください。');return;}
 const redirect=(window.KANJI_CONFIG?.SITE_URL||location.origin+location.pathname.replace(/[^/]+$/,''))+'login.html';
 const {error}=await kanjiSupabase.auth.signUp({email,password:p,options:{emailRedirectTo:redirect}});
 if(error){show('登録できませんでした。入力内容をご確認ください。');return;}
 window.kanjiTrack?.('sign_up',{method:'email'});
 show('確認メールを送信しました。メール内のリンクから登録を完了してください。',true);
});
