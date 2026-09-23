const form=document.getElementById('loginForm'),msg=document.getElementById('msg');
function show(t){msg.textContent=t;msg.className='msg show err'}
form.addEventListener('submit',async e=>{e.preventDefault(); if(!window.kanjiSupabase){show('会員システムの公開設定が未完了です。');return;} const email=document.getElementById('email').value.trim(),password=document.getElementById('password').value; const {error}=await kanjiSupabase.auth.signInWithPassword({email,password}); if(error){show('メールアドレスまたはパスワードを確認してください。');return;} window.kanjiTrack?.('login',{method:'email'}); location.href='mypage.html';});
