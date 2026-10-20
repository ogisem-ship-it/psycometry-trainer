/* V4 - teaching-first quantitative upgrades; uses V3's existing storage key. */
(function(){
const escapeHTML=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toggle=(id,on)=>$(id)?.classList.toggle('hidden',!on);
const examUrl='https://www.nite.org.il/wp-content/uploads/2025/08/psychometric_summer_2025_acc.pdf';
const examHub='https://www.nite.org.il/practice-tests/hebrew-practice-tests/';

// Genuine examination materials remain on NITE's site; no copyrighted questions reproduced.
const nav=document.querySelector('.top nav');
const officialButton=document.createElement('button');officialButton.className='nav';officialButton.textContent='📄 מבחנים אמיתיים';officialButton.onclick=()=>go('official');nav.appendChild(officialButton);
const official=document.createElement('section');official.id='official';official.className='view hidden';
official.innerHTML=`<div class="panel"><div class="section"><div><small>OFFICIAL EXAMS · מאל״ו</small><h2>📄 תרגול ממבחנים אמיתיים</h2></div><span class="pill">חומר מקור רשמי</span></div><p class="muted">כאן פותחים בחינה מקורית של המרכז הארצי לבחינות ולהערכה ופועלים מול השאלות כפי שהתפרסמו. השאלות אינן מועתקות לאתר שלנו; לכל חומרי הבחינה זכויות יוצרים של מאל״ו.</p><div class="two"><div class="card"><h3>קיץ 2025 — בחינה רשמית</h3><p class="muted">ב־PDF המלא יש שני פרקי חשיבה כמותית ומפתח תשובות לקראת הסוף. תרגל מהמסמך המקורי, עם טיימר.</p><a class="btn primary v4-link" href="${examUrl}" target="_blank" rel="noopener noreferrer">פתח PDF רשמי ↗</a></div><div class="card"><h3>ארכיון הבחינות הרשמיות</h3><p class="muted">בחינות נוספות לפי שנה ומועד באתר מאל״ו, עם מפתחות תשובות לפרקים.</p><a class="btn secondary v4-link" href="${examHub}" target="_blank" rel="noopener noreferrer">פתח מאגר מאל״ו ↗</a></div></div></div><div class="panel"><h3>🧩 יומן תרגול מבחינות אמת</h3><p class="muted">פתור שאלה ב־PDF המקורי, ואז תעד אותה כאן. לרגעים שבהם תשובה לא מובנת, צור הודעה מוכנה לצ׳אט עם מועד, פרק ומספר שאלה — בלי להעתיק את השאלה המוגנת בזכויות יוצרים.</p><div class="v4-form"><label>מועד הבחינה<select id="realExam"><option value="קיץ 2025">קיץ 2025</option><option value="מועד אחר במאל״ו">מועד אחר במאל״ו</option></select></label><label>פרק כמותי<select id="realSection"><option value="ראשון">ראשון</option><option value="שני">שני</option></select></label><label>מספר שאלה<input id="realNumber" type="number" inputmode="numeric" min="1" max="30" value="1"></label><label>איך הלך?<select id="realResult"><option value="טעיתי">טעיתי</option><option value="עניתי נכון אבל הייתי איטי">נכון אבל איטי</option><option value="עניתי נכון">נכון</option></select></label></div><label style="display:block;margin-top:12px">באיזה שלב נתקעת? (לא חובה)<textarea id="realNote" placeholder="למשל: לא הבנתי למה מתייחסים דווקא לסכום הקבוצות..." rows="3"></textarea></label><div class="actions"><button id="realSave" class="btn primary">שמור ליומן</button><button id="realCopy" class="btn secondary">העתק בקשת הסבר לצ׳אט</button></div><div id="realList" class="v4-log"></div></div>`;
document.querySelector('main').appendChild(official);

// Choice: adaptive learning or genuinely demanding challenge; no false difficulty promise.
const toolbar=document.createElement('div');toolbar.className='v4-difficulty';toolbar.innerHTML=`<div><b>רמת תרגול</b><small>רמת אתגר כוללת חשיבה רב־שלבית, לא רק מספרים גדולים</small></div><div class="v4-switch"><button type="button" id="levelAdaptive" class="chip">אדפטיבי</button><button type="button" id="levelChallenge" class="chip">אתגר רמות 3–4</button></div>`;
document.querySelector('#quant .chips').after(toolbar);
if(!['adaptive','challenge'].includes(S.v4Level))S.v4Level='adaptive';
function paintLevels(){ $('levelAdaptive').classList.toggle('active',S.v4Level==='adaptive');$('levelChallenge').classList.toggle('active',S.v4Level==='challenge')}
$('levelAdaptive').onclick=()=>{S.v4Level='adaptive';paintLevels();save()};
$('levelChallenge').onclick=()=>{S.v4Level='challenge';paintLevels();save()};paintLevels();

// Correct difficulty selection. V3 previously picked a random template BEFORE finding the target level.
desiredLevel=function(topic){
 const s=tstat(topic);if(S.v4Level==='challenge')return pick([3,4,4]);
 if(!s.total||s.total<3)return pick([2,2,3]);
 const accuracy=s.correct/s.total,avg=s.time/s.total;
 if(s.total>=6&&accuracy>=.85&&avg<=75)return pick([3,3,4,4]);
 if(accuracy>=.75)return pick([2,3,3]);
 if(accuracy<.55)return pick([1,2,2,3]);
 return pick([2,2,3]);
};
genOne=function(topic,level){
 const pool=GEN[topic]||GEN['יחסים'],want=level||desiredLevel(topic),variants=pool.map(f=>f());
 const candidates=variants.filter(q=>q.lvl===want),adjacent=variants.filter(q=>Math.abs(q.lvl-want)===1);
 return pick(candidates.length?candidates:adjacent.length?adjacent:variants);
};
buildSession=function(mode,n){
 const output=[],seenStems=new Set(),recent=new Set((S.history||[]).slice(-35).map(h=>h.stem)),topicWeak=weakTopic()?.topic||selTopic;
 const templateOrder={};for(const topic of topics){templateOrder[topic]=shuffle((GEN[topic]||[]).map((_,i)=>i))}
 for(let i=0;i<n;i++){
  const topic=mode==='topic'?selTopic:mode==='weak'?topicWeak:mode==='sprint'?pick(topics):topics[i%topics.length];
  const pool=GEN[topic];let best=null,bestScore=-1e10;
  for(let j=0;j<Math.max(12,pool.length*2);j++){
   const target=desiredLevel(topic);
   const fn=pool[templateOrder[topic][j%pool.length]];
   const q=fn();const delta=Math.abs(q.lvl-target);
   let score=(q.lvl>=3?10:0)-delta*12;
   if(mode==='sprint'&&q.lvl>3)score-=4;
   if(seenStems.has(q.stem))score-=1000;
   if(recent.has(q.stem))score-=60;
   if(output.some(x=>x.method===q.method&&x.topic===q.topic))score-=18;
   score+=Math.random()*2;
   if(score>bestScore){best=q;bestScore=score}
  }
  output.push(best);seenStems.add(best.stem);
 }
 return output;
};
// No hint showing the method before the learner has committed to an answer.
showQ=function(){
 clearInterval(QS.int);if(QS.i>=QS.list.length)return finishQ();const q=QS.list[QS.i];
 QS.start=Date.now();$('qcount').textContent=`${QS.i+1}/${QS.list.length}`;
 $('qbar').style.width=QS.i/QS.list.length*100+'%';$('qbadge').textContent=q.topic;
 $('qlevel').textContent=`רמה ${q.lvl} · ${q.lvl>=3?'חשיבה מתקדמת':'בניית יסודות'}`;
 $('qmethod').textContent='🧠 קודם בחר שיטה בעצמך';$('qmethod').classList.remove('revealed');
 $('qstem').textContent=q.stem;
 $('qopts').innerHTML=q.opts.map((value,i)=>`<label class="opt"><input type="radio" name="qo" value="${escapeHTML(value)}"><span>${String.fromCharCode(65+i)}. ${escapeHTML(value)}</span></label>`).join('');
 hideExplain();toggle('qcheck',true);toggle('qnext',false);
 const qp=document.querySelector('#qwrap .q');qp.classList.remove('v4-fade');void qp.offsetHeight;qp.classList.add('v4-fade');
 tick();QS.int=setInterval(tick,250);
};
const simpleIntroductions={
 'יחסים':'יחס הוא מתכון: אם בכל סיבוב לוקחים כך וכך מהקבוצה הראשונה וכך וכך מהשנייה, חייבים לשמור על סדר הקבוצות ועל גודל המנה.',
 'אחוזים':'אחוז הוא חלק מתוך 100. לכן 25% הוא רבע ו־50% הוא חצי. בכל שינוי שאל: מתוך איזה מספר מחשבים?',
 'ממוצעים':'ממוצע הוא חלוקה שווה: קודם מחברים את כל מה שיש, ואז מחלקים בין המשתתפים.',
 'מהירות':'מהירות אומרת כמה קילומטרים מספיקים בכל שעה. הדרך הנכונה מתחילה משאלה מהו המרחק ומה הזמן.',
 'עבודה והספק':'דמיין בריכה: כל פועל ממלא חלק ממנה בשעה. עובדים יחד מחברים את הכמות שממלאים, לא את השעות.',
 'שברים':'שבר הוא פרוסה מעוגה. שים לב איזו עוגה נשארה לפני שמבקשים עוד פרוסה.',
 'אלגברה':'המשוואה היא מאזניים: מותר לבצע אותה פעולה בשני הצדדים בלי לשבור את האיזון.',
 'כפל וחילוק מהיר':'במקום כפל ארוך, מחפשים מספר עגול שקל לעבוד איתו: 25 קשור ל־100, ו־125 קשור ל־1000.',
 'גיאומטריה':'קודם תחליט אם מודדים מסגרת (היקף) או את מה שבפנים (שטח). אלה פעולות שונות.',
 'חזקות ושורשים':'חזקה היא כפל חוזר של אותו מספר. שורש שואל איזה מספר מוכפל בעצמו נותן את התוצאה.',
 'הסתברות וספירה':'סופרים כמה אפשרויות טובות יש וכמה אפשרויות קיימות בסך הכול. רק אחר כך מחלקים.'
};
const trickFor=q=>TRICKS.find(t=>t.t===q.topic);
const explainDetailed=(q,correct,time)=>{
 const trick=trickFor(q),intro=simpleIntroductions[q.topic]||'הדרך הטובה מתחילה מזיהוי מה נתון ומה חסר.';
 $('qmethod').textContent=`🔧 הכלי: ${q.method}`;$('qmethod').classList.add('revealed');
 $('qex').innerHTML=`<h4>${correct?'✅ נכון — בוא נבין למה':'❌ הפעם לא — נבנה את הפתרון מההתחלה'}</h4><p>${escapeHTML(q.why)}</p>`;
 $('qdeep').innerHTML=`<h4>🧱 הסבר פשוט, כמו עם קוביות</h4><p>${escapeHTML(intro)}</p><p><strong>מה נעשה כאן?</strong> ${escapeHTML(q.method)}.</p><ol class="steps">${(q.steps||[]).map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ol><p><strong>התשובה המדויקת:</strong> ${escapeHTML(q.ans)}</p>`;
 $('qfast').innerHTML=`<h4>⚡ איך הכי כדאי לפתור במבחן?</h4><p>${escapeHTML(q.fast)}</p>${trick?`<div class="v4-rule">📒 מתוך דף הטריקים — ${escapeHTML(q.topic)}: <strong>${escapeHTML(trick.a[0])}</strong></div>`:''}<small>פתרת ב־${time} שניות${time>75?' · כדאי לחפש שלב שאפשר לקצר':''}</small>`;
 $('qtrap').innerHTML=`<h4>⚠️ איך לא נופלים בפעם הבאה?</h4><p>${escapeHTML(q.trap)}</p>`;
 $('qsanity').innerHTML=`<h4>🔎 בדיקת היגיון של התוצאה</h4><p>${escapeHTML(q.sanity)}</p>`;
 for(const id of ['qex','qdeep','qfast','qtrap','qsanity'])toggle(id,true);
};
$('qcheck').onclick=()=>{
 const selected=document.querySelector('input[name="qo"]:checked');if(!selected)return toast('בחר תשובה לפני הבדיקה');
 clearInterval(QS.int);const q=QS.list[QS.i],seconds=Math.max(1,Math.round((Date.now()-QS.start)/1000)),correct=selected.value===q.ans;
 if(correct)QS.correct++;QS.time+=seconds;
 document.querySelectorAll('input[name="qo"]').forEach(i=>{
  const label=i.closest('.opt');label.classList.toggle('ok',i.value===q.ans);
  label.classList.toggle('bad',i.checked&&!correct);i.disabled=true;
 });
 explainDetailed(q,correct,seconds);
 record(q,correct,seconds,selected.value);
 if(S.history.length){const last=S.history[S.history.length-1];last.method=q.method;last.slowCorrect=correct&&seconds>75;last.template=q.v4?'v4':'v3';}
 toggle('qcheck',false);toggle('qnext',true);save();
};

// Error notebook now includes the full original step-by-step explanation even if the answer was correct on a retry.
drawMist=function(){
 const b=$('mistakesList');b.innerHTML='';if(!S.mist.length){b.innerHTML='<div class="note">עדיין אין טעויות שמורות.</div>';return}
 const all=S.mist.slice().sort((a,b)=>(b.count||1)-(a.count||1));
 all.forEach((m,idx)=>{
  const q=m.snapshot||LEGACY.find(x=>x.id===m.id),card=document.createElement('article');card.className='q v4-error-card';
  if(!q){card.textContent='טעות ישנה בנושא '+(m.topic||'לא ידוע')+' — נוסח השאלה אינו זמין.';b.appendChild(card);return}
  card.innerHTML=`<div class="chips"><span class="pill">${escapeHTML(m.topic||q.topic)}</span><span class="pill">${m.count||1} טעויות</span></div><h3 class="v4-stem">${escapeHTML(q.stem)}</h3><div class="v4-correct">התשובה הנכונה: <b>${escapeHTML(q.ans)}</b></div><details><summary>📖 הסבר עמוק וכל השלבים</summary><p>${escapeHTML(simpleIntroductions[q.topic]||'נבין מה נתון ומה מבוקש.')}</p><ol class="steps">${(q.steps||[]).map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ol><p><b>⚡ דרך מהירה:</b> ${escapeHTML(q.fast||'פתח את דף הטריקים.')}</p><p><b>⚠️ מלכודת:</b> ${escapeHTML(q.trap||'קרא מה השאלה מבקשת.')}</p><p><b>בדיקה:</b> ${escapeHTML(q.sanity||'בדוק בהצבה.')}</p></details><label class="v4-own-note">📝 מה הטעה אותי?<textarea data-errornote="${idx}" placeholder="למשל: החלפתי בין סדר קבוצות א׳ וב׳...">${escapeHTML(m.note||'')}</textarea></label><div class="actions"><button class="btn secondary" data-retry="${idx}">נסה שוב</button></div>`;
  b.appendChild(card);
 });
 document.querySelectorAll('[data-errornote]').forEach(t=>t.onchange=()=>{all[+t.dataset.errornote].note=t.value;save()});
 document.querySelectorAll('[data-retry]').forEach(btn=>btn.onclick=()=>{const m=all[+btn.dataset.retry],q=m.snapshot||LEGACY.find(x=>x.id===m.id);if(q)retryQuestion(q)});
};
// V3's levelStats handled only levels 1-3; level 4 must not crash the summary.
levelStats=function(){const out={1:{c:0,t:0,time:0},2:{c:0,t:0,time:0},3:{c:0,t:0,time:0},4:{c:0,t:0,time:0}};for(const h of (S.history||[])){if(!h.lvl)continue;const x=out[h.lvl];if(!x)continue;x.t++;x.c+=h.correct?1:0;x.time+=h.time||0}return out;};
const oldMakeSummary=makeSummary;
makeSummary=function(){oldMakeSummary();
 const history=S.history||[],recent=history.slice(-20),slow=recent.filter(x=>x.correct&&x.time>75),wrong=recent.filter(x=>!x.correct);
 const l4=levelStats()[4]; const details=[`\nאבחון V4 — ${new Date().toLocaleDateString('he-IL')}:`,`- מצב קושי: ${S.v4Level==='challenge'?'אתגר רמות 3–4':'אדפטיבי'}`,`- רמה 4: ${l4.t?Math.round(l4.c/l4.t*100)+'% מתוך '+l4.t+' שאלות':'טרם תורגל'}`,`- 20 תשובות אחרונות: ${recent.length}`,`- שגיאות אחרונות: ${wrong.length}`,`- נכון אבל מעל 75 שניות: ${slow.length}`,`- נושאי טעויות אחרונות: ${wrong.map(x=>x.topic).join(', ')||'אין'}`,`- טכניקות ששווה לקצר: ${slow.map(x=>x.method||x.topic).join(', ')||'אין עדיין'}`,`- שאלות ממבחן רשמי שתועדו: ${(S.realLog||[]).length}`,`- סדר יחסים: בשאלות V4 הקבוצות מוצגות בשמות ובסדר מפורש.`,`\nהדרכה מבוקשת: הסבר כל שאלה עם דוגמת קוביות/קבוצות, שלבים קטנים, קיצור דרך, מלכודת, ולמה התשובה הסופית מתאימה. תן 5 שאלות קשות על נושאים חלשים — ללא חזרה מילולית.`];
 $('summary').value+="\n"+details.join('\n');
};
// The existing notes textarea is left unchanged and historical progress is preserved.
$('realSave').onclick=()=>{
 const recordReal={when:new Date().toISOString(),exam:$('realExam').value,section:$('realSection').value,num:Math.max(1,Math.min(30,Number($('realNumber').value)||1)),result:$('realResult').value,note:$('realNote').value.trim()};
 if(!Array.isArray(S.realLog))S.realLog=[];S.realLog.unshift(recordReal);S.realLog=S.realLog.slice(0,100);
 save();realList();toast('נשמר ביומן בחינות אמת');
};
function realList(){const box=$('realList'),entries=Array.isArray(S.realLog)?S.realLog:[];box.innerHTML=entries.length?`<h4>תיעוד אחרון</h4>`+entries.slice(0,10).map(r=>`<div class="v4-log-row"><b>${escapeHTML(r.exam)}</b> · כמותי ${escapeHTML(r.section)} · שאלה ${r.num}<br><small>${escapeHTML(r.result)}${r.note?' — '+escapeHTML(r.note):''}</small></div>`).join(''):'<p class="muted">עדיין אין שאלות רשמיות ביומן.</p>'}
realList();
$('realCopy').onclick=async()=>{
 const message=`אני מתרגל מבחינת מאל״ו הרשמית: ${$('realExam').value}, פרק כמותי ${$('realSection').value}, שאלה ${$('realNumber').value}. התוצאה שלי: ${$('realResult').value}. מה לא הבנתי: ${$('realNote').value||'צריך הסבר מהיסוד'}. תסביר לי איך לזהות את העיקרון, לפתור צעד צעד בשפה פשוטה ואז בדרך הפסיכומטרית המהירה. אם אין לך את נוסח השאלה, בקש ממני צילום או טקסט.`;
 try{await navigator.clipboard.writeText(message);toast('ההודעה הועתקה')}catch(e){const t=document.createElement('textarea');t.value=message;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();toast('נסה להדביק את ההודעה בצ׳אט')}
};
const oldGo=go;go=function(v){oldGo(v);if(v==='official'){officialButton.classList.add('active');realList()}else officialButton.classList.remove('active');if(v==='mistakes')drawMist();if(v==='coach')makeSummary()};
// Initial render after override: show V4's notebook, and announce interactive readiness.
drawMist();render();
console.info('Psychometric Trainer V4 enhancements ready');
})();