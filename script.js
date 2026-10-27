const $ = s => document.querySelector(s);
const st = {
    name: 'بطل',
    pts: 0,
    tok: 0,
    log: [],
    booked: [],
    done: 0,
    role: 'child',
    recs: 0
};
const MOODS = [
    ['😢', 'حزين', 'sad'],
    ['😊', 'سعيد', 'happy'],
    ['😡', 'غضبان', 'angry'],
    ['😰', 'قلق', 'anxious']
];

function show(id) {
    document.querySelectorAll('.scr').forEach(e => e.hidden = e.id !== id);
    scrollTo(0, 0)
}

function openM(id) {
    $('#' + id).hidden = false;
    if (id == 'm-parent') parent()
}

function closeM(id) {
    $('#' + id).hidden = true;
    if (id == 'm-ex') stopAmb()
}

function say(t, l) {
    try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.lang = l || 'ar-SA';
        speechSynthesis.speak(u)
    } catch (e) {}
}

function stat() {
    $('#pts').textContent = st.pts;
    $('#tok').textContent = st.tok;
    $('#nm').textContent = st.name
}

function moodBtns(el, fn) {
    el.innerHTML = MOODS.map((m, i) => `<div class="mood" onclick="${fn}(${i})"><b>${m[0]}</b>${m[1]}</div>`).join('')
}

function pick(r) {
    st.role = r;
    $('#err').textContent = '';
    show('s-login')
}

function demo(y) {
    $('#pid').value = '1000000001';
    $('#cid').value = '10' + String(y).slice(2) + '123456';
    $('#cname').value = 'ليان'
}

function verify() {
    const p = $('#pid').value.trim(),
        c = $('#cid').value.trim(),
        e = $('#err');
    if (!/^\d{10}$/.test(p) || !/^\d{10}$/.test(c)) {
        e.textContent = 'أدخل رقمي هوية صحيحين من 10 أرقام';
        return
    }
    const age = 2026 - (2000 + parseInt(c.slice(2, 4)));
    if (age > 12 || age < 5) {
        $('#sorryTxt').textContent = age > 12 ? `عمر الطفل المسجّل ${age} سنة. منصة الأوركيد مخصصة للأعمار من 5 إلى 12 سنة. شكراً لاهتمامك، ونتمنى لك التوفيق 💜` : `عمر الطفل المسجّل ${age} سنة. نستقبل الأطفال ابتداءً من 5 سنوات، ونسعد برؤيتكم قريباً 🌱`;
        show('s-sorry');
        return
    }
    st.name = $('#cname').value.trim() || 'بطل';
    if (st.role == 'parent') {
        stat();
        show('s-app');
        openM('m-parent');
        return
    }
    moodBtns($('#moods1'), 'mood1');
    show('s-mood');
    say('كيف تشعر الآن؟')
}

function mood1(i) {
    st.log.push('قبل الجلسة: ' + MOODS[i][1] + ' ' + MOODS[i][0]);
    say(MOODS[i][1]);
    setTimeout(() => {
        stat();
        show('s-app');
        say('أهلاً بك يا بطل في الأوركيد')
    }, 700)
}

/* QR (محاكاة) */
function qr(cv, txt) {
    const n = 25,
        s = cv.width / n,
        x = cv.getContext('2d');
    x.fillStyle = '#fff';
    x.fillRect(0, 0, cv.width, cv.height);
    x.fillStyle = '#5B3E95';
    let h = 0;
    for (const ch of txt) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const fin = (a, b) => {
        x.fillRect(a * s, b * s, 7 * s, 7 * s);
        x.fillStyle = '#fff';
        x.fillRect((a + 1) * s, (b + 1) * s, 5 * s, 5 * s);
        x.fillStyle = '#5B3E95';
        x.fillRect((a + 2) * s, (b + 2) * s, 3 * s, 3 * s)
    };
    const inF = (i, j) => (i < 8 && j < 8) || (i > 16 && j < 8) || (i < 8 && j > 16);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
            if (inF(i, j)) continue;
            h = (h * 1664525 + 1013904223) >>> 0;
            if (h >>> 28 > 6) x.fillRect(i * s, j * s, s, s)
        }
    fin(0, 0);
    fin(18, 0);
    fin(0, 18)
}

/* ورشات */
const WS = [
    ['فن التعبير بالألوان', 'مركز الأوركيد المركزي', 'الأحد 10:00'],
    ['أصدقاء المشاعر', 'مركز الأمل', 'الثلاثاء 11:30'],
    ['قصص الهدوء والتنفس', 'مركز النور', 'الخميس 09:30']
];

function openWs() {
    $('#wsQR').hidden = true;
    $('#wsList').innerHTML = WS.map((w, i) => `<div class="ws"><div><b>${w[0]}</b><br>📍 ${w[1]} · 🕒 ${w[2]}</div><button class="btn" onclick="book(${i})">احجز 🎟️</button></div>`).join('');
    openM('m-ws')
}

function book(i) {
    const code = 'WS-' + (1000 + Math.floor(Math.random() * 9000)) + '-' + (i + 1);
    st.booked.push(WS[i][0] + ' (' + WS[i][2] + ')');
    st.pts += 5;
    stat();
    $('#wsQR').hidden = false;
    qr($('#qr1'), code);
    $('#wsInfo').textContent = WS[i][0] + ' · ' + WS[i][1] + ' · ' + WS[i][2] + ' · ' + code;
    $('#wsQR').scrollIntoView({
        behavior: 'smooth'
    })
}

/* إنجليزي */
const LV = [
    ['🐾 الحيوانات', [
        ['🐱', 'cat'],
        ['🐶', 'dog'],
        ['🐦', 'bird'],
        ['🐟', 'fish']
    ]],
    ['🍎 الفواكه', [
        ['🍎', 'apple'],
        ['🍌', 'banana'],
        ['🍇', 'grape'],
        ['🍊', 'orange']
    ]],
    ['☀️ الطبيعة', [
        ['☀️', 'sun'],
        ['🌙', 'moon'],
        ['⭐', 'star'],
        ['🌳', 'tree']
    ]]
];
let q = {
    l: 0,
    i: 0,
    s: 0
};

function openEn() {
    $('#enBody').innerHTML = `<p>اختر مستوى لتبدأ، وكل مستوى ينهيه يمنحك توكن 🪙</p><div class="lv">${LV.map((l,i)=>`<button class="btn ${i<st.done?'gold':''}" ${i>st.done?'disabled':''} onclick="startLv(${i})">${i<st.done?'✅ ':i>st.done?'🔒 ':''}المستوى ${i+1}: ${l[0]}</button>`).join('')}</div>`;openM('m-en')}
function startLv(l){q={l,i:0,s:0};ask()}
function ask(){const L=LV[q.l][1];if(q.i>=L.length){const first=q.l==st.done&&q.s>=3;if(first){st.done++;st.tok++;stat()}
  $('#enBody').innerHTML=`<div class="big">${q.s>=3?'🏆':'💪'}</div><h3>أحسنت! ${q.s} من ${L.length}</h3><p>${first?'حصلت على توكن جديد 🪙 وفتحت مستوى جديداً!':q.s>=3?'نقاطك زادت!':'حاول مرة أخرى للحصول على توكن'}</p><button class="btn" onclick="openEn()">رجوع للمستويات</button>`;return}
  const [e,w]=L[q.i],pool=LV.flatMap(x=>x[1]).map(x=>x[1]).filter(x=>x!=w).sort(()=>Math.random()-.5).slice(0,2),o=[w,...pool].sort(()=>Math.random()-.5);
  $('#enBody').innerHTML=`<p>سؤال ${q.i+1}/${L.length} · ما اسم هذا بالإنجليزية؟</p><div class="big">${e}</div><div class="opts">${o.map(x=>`<button class="btn" onclick="ans(this,'${x}','${w}')">${x}</button>`).join('')}</div><p id="fb"></p>`}
function ans(b,x,w){say(w,'en-US');if(x==w){q.s++;st.pts+=10;stat();$('#fb').innerHTML='<b class="ok">ممتاز! Great job! 🎉</b>'}else $('#fb').innerHTML=`<b class="bad">الإجابة: ${w}</b>`;
  document.querySelectorAll('.opts .btn').forEach(z=>z.disabled=true);q.i++;setTimeout(ask,1200)}

/* رسم */
const cv=$('#cv'),cx=cv.getContext('2d');let col='#5B3E95',draw=false;
cx.lineCap='round';cx.lineJoin='round';
$('#pal').innerHTML=['#5B3E95','#26A69A','#D4AF37'].map(c=>`<button style="background:${c}" onclick="col='${c}'"></button>`).join('');
function pos(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]}
cv.addEventListener('pointerdown',e=>{draw=true;const[x,y]=pos(e);cx.beginPath();cx.moveTo(x,y);cx.strokeStyle=col;cx.lineWidth=$('#bs').value;cx.lineTo(x+.1,y);cx.stroke();cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(!draw)return;const[x,y]=pos(e);cx.lineTo(x,y);cx.stroke()});
['pointerup','pointercancel'].forEach(t=>cv.addEventListener(t,()=>draw=false));
function clr(){cx.clearRect(0,0,cv.width,cv.height)}function eraser(){col='#ffffff'}
function tab(t){$('#t-draw').hidden=t!='draw';$('#t-voice').hidden=t!='voice'}
$('#bars').innerHTML='<i></i>'.repeat(24);

/* صوت */
let recOn=false,rT=0,rI;
function rec(){recOn=!recOn;const b=$('#rec');
  if(recOn){rT=0;b.textContent='⏹️ إيقاف';rI=setInterval(()=>{rT++;$('#rt').textContent='0'+Math.floor(rT/60)+':'+String(rT%60).padStart(2,'0')},1000);
    window._bi=setInterval(()=>document.querySelectorAll('#bars i').forEach(i=>i.style.height=(6+Math.random()*34)+'px'),150)}
  else{clearInterval(rI);clearInterval(window._bi);document.querySelectorAll('#bars i').forEach(i=>i.style.height='6px');b.textContent='⏺️ ابدأ التسجيل';st.recs++;
    $('#recs').insertAdjacentHTML('beforeend',`<div class="ws">🎧 تسجيلي ${st.recs} (${rT} ث)<button class="btn ghost" onclick="beep()">▶️</button></div>`);st.pts+=5;stat()}}
let ac,nodes=[],on={};
function A(){return ac||(ac=new(window.AudioContext||window.webkitAudioContext)())}
function beep(){const a=A(),o=a.createOscillator(),g=a.createGain();o.frequency.value=520;g.gain.value=.08;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.3)}
function amb(k,b){if(on[k]){on[k]();delete on[k];b.classList.add('ghost');return}b.classList.remove('ghost');const a=A();
  if(k=='rain'){const buf=a.createBuffer(1,a.sampleRate*2,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    const s=a.createBufferSource();s.buffer=buf;s.loop=true;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;const g=a.createGain();g.gain.value=.15;s.connect(f);f.connect(g);g.connect(a.destination);s.start();on[k]=()=>s.stop()}
  else{const t=setInterval(()=>{const o=a.createOscillator(),g=a.createGain(),n=a.currentTime,f=2000+Math.random()*1500;o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(f*1.5,n+.12);g.gain.setValueAtTime(.07,n);g.gain.exponentialRampToValueAtTime(.001,n+.2);o.connect(g);g.connect(a.destination);o.start();o.stop(n+.2)},500);on[k]=()=>clearInterval(t)}}
function stopAmb(){Object.values(on).forEach(f=>f());on={};document.querySelectorAll('#t-voice .row .btn').forEach(b=>b.classList.add('ghost'))}

/* ولي الأمر */
function parent(){$('#pBody').innerHTML=`<p>👤 الطفل: <b>${st.name}</b> · ⭐ ${st.pts} نقطة · 🪙 ${st.tok} توكن · 📘 مستويات مكتملة: ${st.done}/3</p><h3>سجل المشاعر</h3><p>${st.log.join('<br>')||'لا يوجد بعد'}</p><h3>الورشات المحجوزة</h3><p>${st.booked.join('<br>')||'لا يوجد حجوزات بعد'}</p>`}

/* الخروج */
function startExit(){$('#exBody').innerHTML='<h2>قبل أن تذهب... كيف تشعر الآن؟ 💜</h2><div class="moods" id="moods2"></div>';moodBtns($('#moods2'),'mood2');openM('m-exit')}
function mood2(i){st.log.push('بعد الجلسة: '+MOODS[i][1]+' '+MOODS[i][0]);say(MOODS[i][1]);
  if(i==0||i==2){$('#exBody').innerHTML=`<h3>نحن هنا لنساعدك 🤗 ما السبب؟ (اختر ما يناسبك)</h3>${['مشاكل في البيت','الإرهاق والتعب','مشكلة مع الأصدقاء','صعوبة في الدراسة','أشعر بالخوف','لا أعرف'].map(r=>`<label class="rs"><input type="checkbox" style="width:auto;margin:0 0 0 8px"> ${r}</label>`).join('')}<textarea id="why" rows="2" style="width:100%;border-radius:12px;padding:8px;margin:8px 0" placeholder="تحب أن تخبرنا بشيء؟"></textarea><button class="btn" onclick="gift()">إرسال 💌</button>`}
  else gift()}
function gift(){$('#exBody').innerHTML='<h2>شكراً لمشاركتك يا بطل! 🎉</h2><p>افتح صندوق الهدايا</p><div class="gift" onclick="openGift(this)">🎁</div>'}
function openGift(g){g.textContent='✨';g.style.animation='none';setTimeout(()=>{const code='ORC-'+Math.random().toString(36).slice(2,8).toUpperCase();
  $('#exBody').innerHTML=`<h2>🎊 مبروك! حصلت على قسيمة!</h2><div class="vch"><h3>🎟️ قسيمة مكافأة الأوركيد</h3><canvas id="qr2" width="200" height="200"></canvas><p><b>${code}</b></p><p class="hint">اعرض الرمز في أحد المراكز الوجاهية لاستلام هديتك</p></div><br><button class="btn" onclick="finish()">إنهاء والعودة 👋</button>`;qr($('#qr2'),code);st.pts+=10;stat()},700)}
function finish(){closeM('m-exit');show('s-welcome')}