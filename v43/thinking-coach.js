/* Thinking Coach V4.4: separate untimed, scaffolded quant practice. */
(function () {
  'use strict';
  if (typeof GEN === 'undefined' || typeof go !== 'function' || typeof S === 'undefined') return;
  const $c = id => document.getElementById(id);
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const allTopics = ['יחסים','אחוזים','ממוצעים','מהירות','שברים','עבודה והספק','אלגברה','כפל וחילוק מהיר'].filter(t => GEN[t] && GEN[t].length);
  const thinking = S.thinking && typeof S.thinking === 'object' ? S.thinking : {history:[],sessions:0};
  if (!Array.isArray(thinking.history)) thinking.history=[];
  if (!Number.isFinite(thinking.sessions)) thinking.sessions=0;
  S.thinking=thinking;

  const questions = {
    'יחסים': [
      'איזה נתון כאן מחבר בין הקבוצות — סכום, הפרש או שינוי? נסה לתאר אותו במילים.',
      'תאר כל קבוצה באמצעות אותו גודל של חלק. על אילו חלקים חל הנתון המספרי?',
      'הסתכל על מספרי היחס כיחידות שוות, והתאם אליהן את הנתון. רק אז חשב גודל יחידה.'
    ],
    'אחוזים': [
      'מהו השלם שממנו מחשבים את האחוז בכל שלב?',
      'אם תיקח שלם נוח כמו 100, מה ישתנה ומה יישאר?',
      'בחר בסיס נכון לשינוי והמר את האחוז לשבר או למקדם לפני החישוב.'
    ],
    'ממוצעים': [
      'הממוצע מתאר חלוקה שווה. מהו המידע על הקבוצה כולה?',
      'האם מספר הפריטים השתנה? איך אפשר לעבור מממוצע לסכום?',
      'חשב את הסכום לפני השינוי ואחריו; ההפרש ביניהם הוא הנתון החסר.'
    ],
    'מהירות': [
      'מי או מה נע? האם מחפשים מרחק, זמן, מהירות או סגירת פער?',
      'נסה לצייר קו זמן. האם יש שלב שבו התנאים משתנים?',
      'חשב בנפרד מרחק וזמן בכל שלב; בהשגה התייחס לקצב סגירת הפער.'
    ],
    'שברים': [
      'מהו השלם? האם הוא זהה בכל שלבי השאלה?',
      'תאר בעזרת ציור איזה חלק נותר אחרי כל פעולה.',
      'כשמחשבים חלק ממה שנשאר, מפעילים את השבר על היתרה ולא שוב על המקור.'
    ],
    'עבודה והספק': [
      'מה פירוש הזמן של כל עובד ביחס לעבודה שלמה אחת?',
      'דמיין כמה חלקי עבודה מתבצעים ביחידת זמן אחת.',
      'עבור להספק ליחידת זמן וחבר הספקים של עובדים שפועלים במקביל.'
    ],
    'אלגברה': [
      'איזה דבר לא ידוע? איך תוכל לייצג אותו במספר פשוט או באות?',
      'איזו פעולה משאירה את שני אגפי הקשר שווים?',
      'כתוב קשר מתמטי אחד שמתאר את הנתונים ובודד את הנעלם.'
    ],
    'כפל וחילוק מהיר': [
      'יש כאן מספר מוכר או מספר שקרוב לעשרות או למאות?',
      'האם פירוק או הוצאה של גורם משותף הופכים את הביטוי לנוח?',
      'נסה לכתוב ביטוי שקול עם 10, 100, רבע או גורם משותף לפני חישוב.'
    ]
  };
  const fallback = [
    'מה בדיוק נתון, ומה השאלה מבקשת? הקפד להפריד ביניהם.',
    'האם ציור קצר, טבלה או מספרים נוחים יחשפו קשר פשוט?',
    'נסה לזהות את הגודל הקבוע ולנסח אותו במשפט מתמטי.'
  ];

  const nav=document.createElement('button');
  nav.className='nav';
  nav.dataset.v='thinking';
  nav.type='button';
  nav.textContent='🧠 חשיבה';
  nav.onclick=()=>go('thinking');
  const quantNav=document.querySelector('.top nav [data-v="quant"]');
  if (quantNav) quantNav.after(nav);
  else document.querySelector('.top nav').appendChild(nav);

  const launch=document.createElement('button');
  launch.type='button';
  launch.className='mode thinking-launch';
  launch.innerHTML='🧠<strong>מאמן חשיבה · ללא לחץ זמן</strong><small>קודם מוצאים כיוון, אחר כך פותרים. רמזים מדורגים ובדיקת העברה.</small>';
  launch.onclick=()=>go('thinking');
  document.querySelector('#quant .modes').prepend(launch);
  const homeButton=document.createElement('button');
  homeButton.type='button';
  homeButton.className='btn secondary';
  homeButton.textContent='🧠 לפתח חשיבה כמותית';
  homeButton.onclick=()=>go('thinking');
  document.querySelector('#home .hero .actions').appendChild(homeButton);

  const page=document.createElement('section');
  page.id='thinking'; page.className='view hidden';
  page.innerHTML=[
    '<div class="panel thinking-hero"><small>THINKING COACH · V4.4</small><h2>🧠 לזהות את הדרך, לפני החישוב</h2>',
    '<p class="muted">כאן לא נמדדת מהירות. קודם תנסח לעצמך את הרעיון, תבחר אם צריך רמז, תפתור, ואז תבדוק אם אתה מזהה את אותה תבנית בשאלה חדשה.</p>',
    '<div class="thinking-metrics"><div class="stat"><span>שאלות בתרגול חשיבה</span><b id="tcTotal">0</b></div>',
    '<div class="stat"><span>נכונות בלי רמז</span><b id="tcIndependent">—</b></div>',
    '<div class="stat"><span>התחלות עצמאיות</span><b id="tcStarts">—</b></div>',
    '<div class="stat"><span>ממוצע רמזים</span><b id="tcHintAverage">—</b></div></div></div>',
    '<div class="panel" id="tcSetup"><div class="section"><div><small>אימון בן ארבע שאלות</small><h3>איך תרצה להתאמן?</h3></div><span class="pill">2 רעיונות + 2 שאלות העברה</span></div>',
    '<label class="thinking-label" for="tcMode">בחירת נושא</label><select id="tcMode">',
    '<option value="mixed">מעורב — שני נושאים שונים</option><option value="weak">אזור חלש לפי התרגול הקודם</option><option value="focus">נושא אחד לעומק</option></select>',
    '<label class="thinking-label" for="tcTopic">נושא למיקוד</label><select id="tcTopic"></select>',
    '<p class="muted thinking-small">בתרגול הזה ההצלחה היא לא רק התשובה: נבדוק אם זיהית את הכיוון בלי להיעזר ברמז, וגם אם הצלחת להעביר את הרעיון לשאלה נוספת.</p>',
    '<div class="actions"><button type="button" class="btn primary" id="tcStart">▶ התחל אימון חשיבה</button></div></div>',
    '<div class="panel hidden" id="tcSession" aria-live="polite">',
    '<div class="section"><div><small id="tcPhase">זיהוי דרך הפתרון</small><h3 id="tcCounter">שאלה 1 מתוך 4</h3></div><span class="pill" id="tcTopicLabel"></span></div>',
    '<div class="progress"><div class="fill" id="tcBar"></div></div>',
    '<div id="tcTransfer" class="thinking-transfer hidden">🔁 זו שאלת העברה: אותה תבנית מחשבתית, אבל נתונים אחרים. נסה להגיע לכיוון בלי רמז.</div>',
    '<article class="q"><div class="stem" id="tcStem"></div>',
    '<div id="tcPlanStage"><h3>1. מה הצעד הראשון שלך — ולמה?</h3>',
    '<p class="muted">לפני נוסחה או תוצאה: איזה פרט בניסוח אמור לכוון אותך לדרך הפתרון?</p>',
    '<label class="thinking-label" for="tcPlan">הכיוון שלי</label><textarea id="tcPlan" rows="3" placeholder="אני שם לב ש... ולכן הצעד הראשון שלי יהיה..." aria-label="דרך חשיבה ראשונה"></textarea>',
    '<div class="actions"><button type="button" class="btn primary" id="tcCommit">בחרתי כיוון — ניגש לפתרון</button>',
    '<button type="button" class="btn secondary" id="tcUnsure">אין לי כיוון עדיין</button></div></div>',
    '<div id="tcAnswerStage" class="hidden"><h3>2. עכשיו פותרים</h3><p class="muted" id="tcYourPlan"></p>',
    '<div class="thinking-choices" id="tcOptions" role="radiogroup" aria-label="אפשרויות פתרון"></div>',
    '<div class="actions"><button type="button" class="btn primary" id="tcCheck">בדוק תשובה</button></div></div>',
    '<div id="tcHintBox" class="thinking-hints"><div class="actions"><button type="button" class="btn secondary" id="tcHint">💡 קבל רמז קטן (0/3)</button></div><div id="tcHintText" aria-live="polite"></div></div>',
    '<div id="tcReviewStage" class="hidden"><h3>3. הבנתי את הדרך?</h3><div class="thinking-feedback" id="tcResult"></div>',
    '<div class="ex"><h4>הרעיון שמאחורי השאלה</h4><p id="tcMethod"></p><p id="tcWhy"></p></div>',
    '<div class="ex deep"><h4>פתרון בשלבים</h4><ol id="tcSteps" class="steps"></ol></div>',
    '<div class="ex fast"><h4>דרך מהירה</h4><p id="tcFast"></p></div>',
    '<label class="thinking-label" for="tcReflection">איזה פרט בשאלה היה צריך לרמוז לי על דרך הפתרון?</label>',
    '<textarea id="tcReflection" rows="2" placeholder="למשל: המילה ״הפרש״ הייתה צריכה להכווין אותי..." ></textarea>',
    '<fieldset class="thinking-rating"><legend>איך הגעתי לרעיון?</legend><label><input type="radio" name="tcRating" value="alone"> זיהיתי בעצמי</label>',
    '<label><input type="radio" name="tcRating" value="hint">הבנתי בעקבות רמז / הסבר</label>',
    '<label><input type="radio" name="tcRating" value="unclear">עדיין לא ברור לי</label></fieldset>',
    '<div class="actions"><button type="button" class="btn primary" id="tcNext">המשך</button></div></div>',
    '</article></div>',
    '<div class="panel hidden" id="tcDone"><h2>🎯 סיימת אימון חשיבה</h2><div id="tcSummary" class="note"></div>',
    '<div class="actions"><button type="button" class="btn primary" id="tcAgain">תרגול נוסף</button>',
    '<button type="button" class="btn secondary" id="tcCoach">סיכום לצ׳אט</button></div></div>'
  ].join('');
  document.querySelector('main').appendChild(page);
  for (const topic of allTopics) { const opt=document.createElement('option');opt.value=topic;opt.textContent=topic;$c('tcTopic').appendChild(opt); }
  const previousWeak=typeof weakTopic==='function' ? weakTopic() : null;
  if (previousWeak && allTopics.includes(previousWeak.topic)) $c('tcTopic').value=previousWeak.topic;

  let session=null;
  const hidden=(id,hide)=>$c(id).classList.toggle('hidden',hide);
  function historyStats(){
    const h=thinking.history;
    $c('tcTotal').textContent=String(h.length);
    $c('tcIndependent').textContent=h.length ? Math.round(100*h.filter(x=>x.correct&&x.hints===0).length/h.length)+'%' : '—';
    $c('tcStarts').textContent=h.length ? Math.round(100*h.filter(x=>x.independentStart).length/h.length)+'%' : '—';
    $c('tcHintAverage').textContent=h.length ? (h.reduce((n,x)=>n+(x.hints||0),0)/h.length).toFixed(1) : '—';
  }
  function topicForPair(pair) {
    if (session.mode==='focus') return session.focus;
    if (session.mode==='weak') {
      const recent=thinking.history.slice(-30);
      const stats=new Map();
      recent.forEach(x=>{const s=stats.get(x.topic)||{n:0,ind:0};s.n++;if(x.correct&&x.hints===0)s.ind++;stats.set(x.topic,s);});
      const weak=[...stats].filter(([t,s])=>s.n>=2&&allTopics.includes(t)).sort((a,b)=>a[1].ind/a[1].n-b[1].ind/b[1].n)[0];
      return weak ? weak[0] : (typeof weakTopic==='function' && allTopics.includes(weakTopic()?.topic) ? weakTopic().topic : session.focus);
    }
    return session.topics[pair%session.topics.length];
  }
  function pickTemplate(topic) {
    const generators=GEN[topic]||[];
    let pool=[];
    for (const fn of generators) {
      try {const q=fn();if(q&&q.lvl>=1&&q.lvl<=3&&q.opts&&q.opts.length===4&&new Set(q.opts).size===4) pool.push({fn,q});} catch(e) {}
    }
    if (!pool.length) throw new Error('No valid question for '+topic);
    const recent=thinking.history.slice(-25).map(h=>h.stem);
    const unused=pool.filter(x=>!recent.includes(x.q.stem));
    const candidates=unused.length?unused:pool;
    const preferred=candidates.filter(x=>x.q.lvl===2||x.q.lvl===3);
    return (preferred.length?preferred:candidates)[Math.floor(Math.random()*(preferred.length?preferred:candidates).length)];
  }
  function nextQuestion() {
    if (session.index>=4) return finish();
    const pair=Math.floor(session.index/2);
    const transfer=session.index%2===1;
    if (!transfer) session.base=pickTemplate(topicForPair(pair));
    let q=session.base.q;
    if (transfer) {
      for(let i=0;i<24;i++) {const variant=session.base.fn();if(variant.stem!==session.base.q.stem && variant.opts && new Set(variant.opts).size===4){q=variant;break;}}
    }
    session.current={q,transfer,started:Date.now(),hints:0,plan:'',independentStart:false,correct:null};
    $c('tcCounter').textContent='שאלה '+(session.index+1)+' מתוך 4';
    $c('tcTopicLabel').textContent=q.topic+' · רמה '+q.lvl;
    $c('tcPhase').textContent=transfer?'בדיקת העברה':'זיהוי דרך הפתרון';
    $c('tcBar').style.width=(session.index/4*100)+'%';
    $c('tcStem').textContent=q.stem;
    $c('tcPlan').value='';
    $c('tcReflection').value='';
    document.querySelectorAll('input[name="tcRating"]').forEach(el=>el.checked=false);
    $c('tcHintText').replaceChildren();
    $c('tcHint').disabled=false;$c('tcHint').textContent='💡 קבל רמז קטן (0/3)';
    hidden('tcTransfer',!transfer);hidden('tcPlanStage',false);
    hidden('tcAnswerStage',true);hidden('tcReviewStage',true);hidden('tcHintBox',false);
    $c('tcOptions').replaceChildren();
    page.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function showHint(){
    const c=session&&session.current;
    if (!c||c.correct!==null||c.hints>=3) return;
    const h=(questions[c.q.topic]||fallback)[c.hints];
    c.hints++;
    const p=document.createElement('p');p.className='thinking-hint';p.textContent='רמז '+c.hints+': '+h;
    $c('tcHintText').appendChild(p);
    $c('tcHint').textContent='💡 רמז נוסף ('+c.hints+'/3)';
    if (c.hints>=3) $c('tcHint').disabled=true;
  }
  function answerStage(stuck){
    const c=session.current;
    c.plan=$c('tcPlan').value.trim();
    if(!c.plan&&!stuck) { $c('tcPlan').focus(); $c('tcPlan').placeholder='כתוב אפילו רעיון ראשוני, או בחר ״אין לי כיוון עדיין״'; return; }
    c.independentStart=!stuck&&c.hints===0&&c.plan.length>0;
    if(!c.plan) c.plan='לא זיהיתי עדיין כיוון';
    $c('tcYourPlan').textContent='הכיוון שניסחת: '+c.plan;
    const frag=document.createDocumentFragment();
    c.q.opts.forEach((option,i)=>{
      const label=document.createElement('label');label.className='thinking-option';
      const radio=document.createElement('input');radio.type='radio';radio.name='tcChoice';radio.value=String(option);
      const span=document.createElement('span');span.textContent=String.fromCharCode(65+i)+'. '+option;
      label.append(radio,span);frag.appendChild(label);
    });
    $c('tcOptions').replaceChildren(frag);
    hidden('tcPlanStage',true);hidden('tcAnswerStage',false);
  }
  function check(){
    const c=session.current;
    if(c.correct!==null)return;
    const selected=document.querySelector('input[name="tcChoice"]:checked');
    if(!selected){$c('tcCheck').focus();$c('tcCheck').textContent='יש לבחור תשובה קודם';return;}
    c.answer=selected.value;
    c.correct=selected.value===String(c.q.ans);
    c.seconds=Math.max(1,Math.round((Date.now()-c.started)/1000));
    document.querySelectorAll('input[name="tcChoice"]').forEach(el=>el.disabled=true);
    $c('tcResult').textContent=(c.correct?'✅ פתרון נכון. ':'🔎 התשובה הנכונה: '+c.q.ans+'. ')+(c.hints===0?'פתרת בלי רמז.':'נעזרת ב־'+c.hints+' רמזים.');
    $c('tcMethod').textContent='🧠 העיקרון: '+c.q.method;
    $c('tcWhy').textContent=c.q.why||'';
    $c('tcFast').textContent=c.q.fast||'';
    $c('tcSteps').replaceChildren();
    (c.q.steps||[]).forEach(step=>{const li=document.createElement('li');li.textContent=step;$c('tcSteps').appendChild(li);});
    hidden('tcAnswerStage',true);hidden('tcReviewStage',false);hidden('tcHintBox',true);
  }
  function storeAndNext(){
    const c=session.current;
    if(c.correct===null)return;
    const reflect=$c('tcReflection').value.trim();
    const rating=document.querySelector('input[name="tcRating"]:checked');
    if (!rating) {
      $c('tcReviewStage').querySelector('legend').textContent='איך הגעתי לרעיון? בחר אפשרות כדי להמשיך';
      return;
    }
    const event={
      date:new Date().toISOString(),topic:c.q.topic,level:c.q.lvl,
      stem:c.q.stem,method:c.q.method,correct:c.correct,hints:c.hints,
      independentStart:c.independentStart,transfer:c.transfer,
      plan:c.plan.slice(0,400),reflection:reflect.slice(0,400),selfRating:rating.value
    };
    thinking.history.push(event);
    if(thinking.history.length>300) thinking.history=thinking.history.slice(-300);
    session.index++;
    save();historyStats();
    nextQuestion();
  }
  function finish(){
    thinking.sessions++;
    if (typeof mark==='function') mark();
    save();historyStats();
    $c('tcBar').style.width='100%';
    hidden('tcSession',true);hidden('tcDone',false);
    const h=thinking.history.slice(-4);
    const correct=h.filter(x=>x.correct).length;
    const independent=h.filter(x=>x.correct&&x.hints===0).length;
    const transfer=h.filter(x=>x.transfer&&x.correct&&x.hints===0).length;
    const struggle=h.filter(x=>x.selfRating==='unclear');
    $c('tcSummary').textContent='פתרת נכון '+correct+'/4 שאלות; '+independent+'/4 בלי רמז. בבדיקות ההעברה: '+transfer+'/2 פתרונות נכונים בלי רמז. '+(struggle.length?'כדאי לחזור ל־'+[...new Set(struggle.map(x=>x.topic))].join(', ')+'.':'מצוין — עברת גם את שלב השחזור.');
    $c('tcDone').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function start(){
    if (!allTopics.length) return;
    const mode=$c('tcMode').value;
    let available=allTopics.slice();
    for(let i=available.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
    session={mode,focus:$c('tcTopic').value,topics:available,index:0,base:null};
    hidden('tcSetup',true);hidden('tcDone',true);hidden('tcSession',false);
    nextQuestion();
  }
  $c('tcStart').onclick=start;
  $c('tcAgain').onclick=()=>{hidden('tcSetup',false);hidden('tcDone',true);hidden('tcSession',true);$c('tcSetup').scrollIntoView({behavior:'smooth',block:'start'});};
  $c('tcCoach').onclick=()=>go('coach');
  $c('tcCommit').onclick=()=>answerStage(false);
  $c('tcUnsure').onclick=()=>{if(session.current.hints===0)showHint();else answerStage(true);};
  $c('tcHint').onclick=showHint;
  $c('tcCheck').onclick=check;
  $c('tcNext').onclick=storeAndNext;
  $c('tcMode').onchange=()=>{$c('tcTopic').disabled=$c('tcMode').value==='mixed';};
  $c('tcMode').dispatchEvent(new Event('change'));
  historyStats();

  // Extend the existing ChatGPT summary without changing prior stats or study data.
  const earlierSummary=makeSummary;
  makeSummary=function(){
    earlierSummary();
    const h=thinking.history, recent=h.slice(-20);
    const independent=recent.filter(x=>x.correct&&x.hints===0);
    const starts=recent.filter(x=>x.independentStart);
    const transfer=recent.filter(x=>x.transfer);
    $c('summary').value+='\n\nמאמן חשיבה (V4.4):\n'+
      '- שאלות תרגול חשיבה: '+h.length+'\n'+
      '- 20 האחרונות: '+recent.length+'\n'+
      '- פתרונות נכונים בלי רמז (20 האחרונות): '+independent.length+'/'+recent.length+'\n'+
      '- התחלות עם כיוון עצמאי: '+starts.length+'/'+recent.length+'\n'+
      '- שאלות העברה: '+transfer.filter(x=>x.correct&&x.hints===0).length+'/'+transfer.length+' נכונות ללא רמז\n'+
      '- רמזים בממוצע: '+(recent.length?(recent.reduce((s,x)=>s+x.hints,0)/recent.length).toFixed(1):'אין נתונים')+'\n'+
      '- נושאים שעדיין לא ברורים: '+([...new Set(recent.filter(x=>x.selfRating==='unclear').map(x=>x.topic))].join(', ')||'אין')+'\n\n'+
      'בקשה לצ׳אט: תרגל איתי תחילה זיהוי רמזים בתוך נוסח השאלה, בלי לתת נוסחה או דרך מוכנה. תן רמז מדורג ורק לאחר ניסיון עצמי הצג פתרון. בסוף בקש ממני להצביע על מילת המפתח ולפתור וריאציה דומה ללא רמז.';
  };
  makeSummary();
  console.info('Thinking Coach V4.4 ready');
})();