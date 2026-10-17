const WORDS=[
['mitigate','למתן, לצמצם נזק','New regulations were introduced to mitigate environmental damage.'],
['replicate','לשחזר, לחזור על ניסוי','Other researchers could not replicate the experiment.'],
['reluctant','מסויג, לא שש','The committee was reluctant to approve the proposal.'],
['consistent','עקבי; תואם ל־','The findings were consistent with previous research.'],
['incompatible','בלתי תואם','The evidence is incompatible with the earlier explanation.'],
['substantial','ניכר, משמעותי','The project required a substantial investment.'],
['enhance','לשפר, להגביר','The new design could enhance efficiency.'],
['acknowledge','להכיר ב־, להודות','The researchers acknowledged the limitations.'],
['reliability','אמינות','Engineers tested the reliability of the sensors.'],
['compelling','משכנע מאוד','The study provided compelling evidence.'],
['anticipate','לצפות מראש','The planners failed to anticipate the increase in demand.'],
['whereas','בעוד ש־, לעומת זאת','The first method is cheap, whereas the second is accurate.'],
['undermine','לערער, להחליש','Failures may undermine public confidence.'],
['exacerbate','להחמיר מצב','A shortage could exacerbate the problem.'],
['inconclusive','לא חד־משמעי','The initial results were inconclusive.'],
['comprehensive','מקיף','The report provides a comprehensive review.'],
['significant','משמעותי, ניכר','The change led to a significant reduction.'],
['emerge','להופיע, להתגלות','Unexpected problems emerged during the test.'],
['maintain','לשמור על, לתחזק','The system must maintain a stable temperature.'],
['decline','ירידה; לרדת; לסרב','The company reported a gradual decline in costs.'],
['obtain','להשיג, לקבל','Researchers obtained similar results.'],
['require','לדרוש, להצריך','The procedure requires careful preparation.'],
['contribute','לתרום; להיות גורם ל־','Several factors contribute to the failure.'],
['indicate','להצביע על, להעיד','The data indicate that demand may increase.'],
['evident','ברור, ניכר','It became evident that the plan would fail.'],
['despite','למרות','Despite the high cost, the technology was adopted.'],
['consequently','כתוצאה מכך, לכן','Supply fell; consequently, prices increased.'],
['nevertheless','אף על פי כן','The task was difficult; nevertheless, the team succeeded.'],
['sufficient','מספיק, מספק','There was insufficient evidence.'],
['undergo','לעבור תהליך','The material must undergo several tests.']
].map(x=>({id:x[0],en:x[0],he:x[1],ex:x[2]}));

const TRICKS=[
{t:'אחוזים',a:['10% = חלקי 10','5% = חצי מ־10%','25% = רבע','12.5% = שמינית','אחוז שינוי = הפרש / ערך מקורי × 100','באחוזים עוקבים, האחוז השני פועל על בסיס חדש'],f:['8% of 25 = 25% of 8 = 2']},
{t:'יחסים',a:['חשוב בחלקים','בדוק מה נשאר קבוע','סך הכול = גודל חלק × סכום החלקים','בשינוי יחס: תרגם את השינוי במספר לחלקים ביחס'],f:['5:3 → 8 parts']},
{t:'ממוצעים',a:['סכום = ממוצע × מספר איברים','הוספה/הסרה = השוואת סכומים','ממוצע קבוצות תלוי בגודל כל קבוצה'],f:['6×80=480 → 7×82=574 → new=94']},
{t:'כפל וחילוק מהיר',a:['×25 = ÷4 ×100','÷25 = ×4 ÷100','×125 = ÷8 ×1000','×99 = ×100 − המספר','×15 = ×10 + חצי מ־×10'],f:['48×25=12×100=1200']},
{t:'מהירות',a:['מהירות ממוצעת = דרך כוללת / זמן כולל','מרחקים שווים: לא ממוצע רגיל','זמנים שווים: ממוצע רגיל','תנועה זה לקראת זה: מחברים מהירויות'],f:['60 & 120 equal distance → 80']},
{t:'עבודה והספק',a:['A ב־t שעות → הספק 1/t','יחד מחברים הספקים','יותר עובדים באותו קצב → הזמן קטן ביחס הפוך'],f:['1/6+1/3=1/2 → 2h']},
{t:'שברים',a:['אותו מונה: מכנה קטן → שבר גדול','השוואה מהירה: כפל בהצלבה','קרוב ל־1: בדוק כמה חסר','שבר מכמות = כפל'],f:['7/8 > 8/10 because 70>64']},
{t:'אלגברה',a:['פשט לפני הצבה','חפש גורם משותף','אל תפתור יותר ממה שנשאל','יחס + סכום = עבודה בחלקים'],f:['3x+6=3(x+2)']}
];

const LEGACY=[
['p1','אחוזים',1,'כמה הם 15% מתוך 240?',['24','30','36','40'],'36'],
['p2','אחוזים',2,'מחיר עלה מ־120 ל־150. בכמה אחוזים?',['20%','25%','30%','33⅓%'],'25%'],
['p3','אחוזים',2,'מחיר עלה ב־20% ואז ירד ב־20%. מה קרה?',['לא השתנה','ירד ב־4%','עלה ב־4%','ירד ב־8%'],'ירד ב־4%'],
['r1','יחסים',1,'היחס בנים:בנות הוא 4:3 ויש 28 תלמידים. כמה בנות?',['10','12','14','16'],'12'],
['r2','יחסים',2,'מכוניות:אופנועים = 5:3. נוספו 6 אופנועים והיחס נהיה 5:4. כמה כלי רכב היו בהתחלה?',['40','42','48','54'],'48'],
['a1','ממוצעים',1,'ממוצע 5 מספרים הוא 18. לאחר הסרת מספר ממוצע 4 הנותרים הוא 15. מה הוסר?',['24','27','30','33'],'30'],
['a2','ממוצעים',2,'ממוצע 6 תלמידים 80. תלמיד שביעי העלה ממוצע ל־82. ציונו?',['90','92','94','96'],'94'],
['m1','כפל וחילוק מהיר',1,'48 × 25 = ?',['1000','1100','1200','1250'],'1200'],
['m2','כפל וחילוק מהיר',1,'1125 ÷ 25 = ?',['35','40','45','50'],'45'],
['m3','כפל וחילוק מהיר',2,'63 × 99 = ?',['6177','6237','6297','6337'],'6237'],
['s1','מהירות',2,'אותו מרחק ב־60 קמ״ש וחזרה ב־120 קמ״ש. מה המהירות הממוצעת?',['80','90','100','110'],'80'],
['s2','מהירות',1,'שעה ב־50 קמ״ש ושעה ב־70. ממוצע?',['55','60','62','65'],'60'],
['w1','עבודה והספק',1,'עובד א׳ מסיים ב־6 שעות וב׳ ב־3. יחד?',['1.5','2','2.5','3'],'2'],
['w2','עבודה והספק',2,'ברז א׳ ממלא ב־4 שעות וב׳ ב־12. יחד?',['2','3','4','6'],'3'],
['f1','שברים',1,'איזה שבר גדול יותר?',['7/8','8/10','שווים','אי אפשר לדעת'],'7/8'],
['f2','שברים',2,'איזה שבר הקרוב ביותר ל־1?',['9/10','11/12','19/20','29/30'],'29/30'],
['x1','אלגברה',1,'אם 3x + 6 = 24, מהו x?',['4','5','6','8'],'6'],
['x2','אלגברה',2,'אם x:y=3:5 ו־x+y=40, מהו x?',['12','15','18','25'],'15']
].map(x=>({id:x[0],topic:x[1],lvl:x[2],stem:x[3],opts:x[4],ans:x[5],method:'חזרה משאלה ישנה',why:'זו שאלה מהמאגר הישן.',steps:['חזור לעיקרון של הנושא ופתור מסודר.'],fast:'השתמש בקיצור הדרך המתאים לנושא.',trap:'אל תמהר לפני שזיהית מה קבוע ומה משתנה.',sanity:'בדוק שהתשובה הגיונית ביחס לנתונים.'}));

const KEY='psychometric_web_v1',INT=[0,1,3,7,14,30];
const today=()=>{let d=new Date();d.setHours(0,0,0,0);return d.toISOString().slice(0,10)};
const add=n=>{let d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const $=id=>document.getElementById(id);
const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fmt=n=>Number.isInteger(n)?String(n):String(Math.round(n*100)/100);
function uniqueOpts(ans,candidates){let s=[String(ans)];for(const c of candidates){let v=String(c);if(!s.includes(v))s.push(v);if(s.length===4)break}while(s.length<4){let base=parseFloat(ans)||10,v=String(Math.round((base+ri(2,12))*100)/100);if(!s.includes(v))s.push(v)}return shuffle(s)}
function qobj(topic,lvl,stem,ans,cands,method,why,steps,fast,trap,sanity){return{id:'g-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),topic,lvl,stem,ans:String(ans),opts:uniqueOpts(ans,cands),method,why,steps,fast,trap,sanity}}
function pctText(x){return Number.isInteger(x)?x+'%':fmt(x)+'%'}

const GEN={};
