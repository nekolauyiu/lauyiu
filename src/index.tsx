import { Hono } from 'hono'

const app = new Hono()

// ─── Color Palette ────────────────────────────────────────────────────────────
const BG       = '#E4D2CC'
const BG_LIGHT = '#F0E6E2'
const BG_DARK  = '#C8B0A8'
const TEXT_D   = '#3d2b24'
const TEXT_M   = '#7a5a52'
const ACCENT   = '#a07060'

// ─── Shared styles ────────────────────────────────────────────────────────────
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Noto+Serif+SC:wght@300;400;500&display=swap');
  @font-face {
    font-family: 'ZoomlaXiangsu';
    src: url('/static/fonts/ZoomlaXiangsu.otf') format('opentype');
    font-weight: normal; font-style: normal; font-display: swap;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    background: ${BG};
    font-family: 'Noto Serif SC', serif;
    color: ${TEXT_D};
    min-height: 100vh;
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${BG_LIGHT}; }
  ::-webkit-scrollbar-thumb { background: ${BG_DARK}; border-radius: 3px; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: 'Noto Serif SC', serif; }
  input, textarea, select { font-family: 'Noto Serif SC', serif; }
`

// ─── Layout shell ─────────────────────────────────────────────────────────────
function shell(title: string, active: string, body: string, script = '') {
  return /* html */`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} · neko</title>
  <style>
    ${BASE_CSS}

    /* ── Layout ── */
    .wrap { display: flex; min-height: 100vh; }

    /* ── Sidebar ── */
    .sidebar {
      width: 200px; min-width: 200px;
      position: fixed; top: 0; left: 0; height: 100vh;
      display: flex; flex-direction: column;
      background: rgba(255,255,255,0.18);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-right: 1px solid rgba(255,255,255,0.38);
      z-index: 100;
    }
    .sb-brand {
      padding: 52px 28px 28px;
      border-bottom: 1px solid rgba(160,112,96,0.14);
      text-align: center;
    }
    .sb-brand h1 {
      font-family: 'French Script MT', 'Palatino Linotype', cursive;
      font-style: italic;
      font-size: 36px;
      letter-spacing: 2px;
      color: ${TEXT_D};
      line-height: 1;
    }
    .sb-nav { flex: 1; padding: 28px 0; }
    .sb-link {
      display: block;
      padding: 13px 28px;
      font-size: 8px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-family: 'Press Start 2P', monospace;
      color: ${TEXT_M};
      position: relative;
      transition: color .25s, background .25s;
      line-height: 1.8;
    }
    .sb-link:hover, .sb-link.on {
      color: ${TEXT_D};
      background: rgba(160,112,96,0.09);
    }
    .sb-link.on::before {
      content: '';
      position: absolute; left: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 18px;
      background: ${ACCENT};
      border-radius: 0 2px 2px 0;
    }
    .sb-foot {
      padding: 20px 28px 28px;
      border-top: 1px solid rgba(160,112,96,0.14);
      font-family: 'Press Start 2P', monospace;
      font-size: 7px;
      color: ${TEXT_M};
      line-height: 2.2;
      letter-spacing: .4px;
    }
    .sb-foot .copy { opacity: .9; }
    .sb-foot .sub  { opacity: .65; font-size: 6px; margin-top: 4px; }
    /* ── Pixel font for English labels ── */
    .px { font-family: 'Press Start 2P', monospace; }

    /* ── Main ── */
    .main {
      flex: 1;
      margin-left: 200px;
      padding: 52px 52px 80px;
      min-height: 100vh;
    }
    .ph { margin-bottom: 36px; }
    .ph-title {
      font-family: 'Press Start 2P', monospace;
      font-size: 16px;
      color: ${TEXT_D};
      letter-spacing: 1px;
      line-height: 1.6;
    }
    .ph-sub {
      font-size: 9px;
      font-family: 'Press Start 2P', monospace;
      color: ${TEXT_M};
      letter-spacing: 1px;
      margin-top: 8px;
      line-height: 1.8;
    }

    /* ── Cards ── */
    .card {
      background: rgba(255,255,255,0.32);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.52);
      border-radius: 18px;
      padding: 28px 30px;
      margin-bottom: 16px;
      transition: transform .25s, box-shadow .25s;
    }
    .card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(61,43,36,.09); }
    .card-click { cursor: pointer; }

    /* ── Trip card ── */
    .tc-date {
      font-size: 7px; letter-spacing: 1.5px;
      font-family: 'Press Start 2P', monospace;
      color: ${TEXT_M}; text-transform: uppercase;
    }
    .tc-title {
      font-family: 'Press Start 2P', monospace;
      font-size: 11px; color: ${TEXT_D};
      margin: 7px 0 9px;
      line-height: 1.6;
    }
    .tc-body {
      font-size: 13px; color: ${TEXT_M};
      line-height: 1.8;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tc-foot {
      display: flex; align-items: center;
      gap: 10px; margin-top: 13px; flex-wrap: wrap;
    }
    .pill {
      background: rgba(160,112,96,.13);
      color: ${ACCENT};
      padding: 3px 11px;
      border-radius: 20px;
      font-size: 11px; letter-spacing: .8px;
    }
    .tc-time {
      margin-left: auto;
      font-size: 7px;
      font-family: 'Press Start 2P', monospace;
      color: ${ACCENT}; opacity: .8;
    }

    /* ── Form ── */
    .fg { margin-bottom: 20px; }
    .fg label {
      display: block;
      font-size: 7px; letter-spacing: 1.5px;
      text-transform: uppercase; color: ${TEXT_M};
      font-family: 'Press Start 2P', monospace;
      margin-bottom: 10px;
      line-height: 1.8;
    }
    .fg input, .fg textarea, .fg select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255,255,255,.5);
      border: 1px solid rgba(160,112,96,.28);
      border-radius: 11px;
      font-size: 14px; color: ${TEXT_D};
      outline: none;
      transition: border-color .25s, box-shadow .25s, background .25s;
    }
    .fg input[type=date] {
      font-family: 'Press Start 2P', monospace;
      font-size: 9px;
      letter-spacing: 1px;
    }
    .fg textarea {
      min-height: 240px; resize: vertical; line-height: 1.9;
    }
    .fg input:focus, .fg textarea:focus, .fg select:focus {
      border-color: ${ACCENT};
      background: rgba(255,255,255,.7);
      box-shadow: 0 0 0 3px rgba(160,112,96,.12);
    }

    /* ── Buttons ── */
    .btn {
      padding: 11px 22px; border-radius: 8px;
      font-size: 7px; letter-spacing: 1.5px;
      font-family: 'Press Start 2P', monospace;
      border: none; transition: all .25s;
      line-height: 1.6;
    }
    .btn-p { background: ${ACCENT}; color: #fff; }
    .btn-p:hover { background: ${TEXT_D}; transform: translateY(-1px); box-shadow: 0 5px 14px rgba(61,43,36,.2); }
    .btn-s { background: rgba(160,112,96,.15); color: ${TEXT_M}; }
    .btn-s:hover { background: rgba(160,112,96,.28); }
    .btn-d { background: rgba(200,70,70,.08); color: #b04040; border: 1px solid rgba(200,70,70,.25); }
    .btn-d:hover { background: rgba(200,70,70,.17); }
    .btn-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

    /* ── FAB ── */
    .fab {
      position: fixed; bottom: 36px; right: 44px;
      width: 52px; height: 52px; border-radius: 50%;
      background: ${ACCENT}; color: #fff;
      border: none; font-size: 24px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 20px rgba(160,112,96,.42);
      transition: all .25s; z-index: 50;
    }
    .fab:hover { background: ${TEXT_D}; transform: scale(1.1) translateY(-2px); }

    /* ── Modal ── */
    .ov {
      position: fixed; inset: 0;
      background: rgba(61,43,36,.28);
      backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      z-index: 200; opacity: 0; pointer-events: none;
      transition: opacity .28s;
    }
    .ov.show { opacity: 1; pointer-events: all; }
    .mbox {
      background: #ede4df;
      border-radius: 18px;
      padding: 36px 36px 32px;
      width: 540px; max-width: 92vw;
      max-height: 88vh; overflow-y: auto;
      box-shadow: 0 24px 70px rgba(61,43,36,.18);
      transform: translateY(18px);
      transition: transform .28s;
    }
    .ov.show .mbox { transform: translateY(0); }
    .mbox h3 {
      font-family: 'Press Start 2P', monospace;
      font-size: 10px; color: ${TEXT_D};
      margin-bottom: 26px;
      letter-spacing: 1px;
      line-height: 1.8;
    }

    /* ── Detail view ── */
    .det-head {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 18px;
    }
    .det-emoji { font-size: 26px; }
    .det-body {
      font-size: 14px; line-height: 2.1;
      color: ${TEXT_D}; white-space: pre-wrap;
    }
    hr.div {
      border: none;
      border-top: 1px solid rgba(160,112,96,.22);
      margin: 20px 0;
    }

    /* ── Empty ── */
    .empty { text-align: center; padding: 72px 0; color: ${TEXT_M}; }
    .empty .ei { font-size: 44px; opacity: .45; margin-bottom: 14px; }
    .empty p  { font-size: 13px; letter-spacing: 1px; }

    /* ── Toast ── */
    .toast {
      position: fixed; bottom: 28px; left: 50%;
      transform: translateX(-50%) translateY(70px);
      background: ${TEXT_D}; color: #fff;
      padding: 11px 26px; border-radius: 22px;
      font-size: 13px; letter-spacing: .8px;
      z-index: 999; opacity: 0;
      transition: all .35s;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* ── Upload button ── */
    .upload-btn {
      display: inline-block;
      padding: 9px 18px;
      background: rgba(160,112,96,.15);
      color: ${TEXT_M};
      border-radius: 9px;
      font-size: 7px;
      font-family: 'Press Start 2P', monospace;
      letter-spacing: 1px;
      cursor: pointer;
      transition: background .2s;
      line-height: 1.6;
    }
    .upload-btn:hover { background: rgba(160,112,96,.28); }
    .img-preview-wrap {
      position: relative; display: inline-block;
    }
    .img-preview-wrap .rm-img {
      position: absolute; top: -6px; right: -6px;
      width: 18px; height: 18px; border-radius: 50%;
      background: rgba(61,43,36,.65); color: #fff;
      font-size: 11px; line-height: 18px; text-align: center;
      cursor: pointer; border: none; padding: 0;
      display: flex; align-items: center; justify-content: center;
    }
    /* ── Image grid ── */
    .img-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 9px;
      margin-top: 14px;
    }
    .img-grid img {
      width: 100%; aspect-ratio: 4/3;
      object-fit: cover;
      border-radius: 10px;
      cursor: pointer;
      transition: transform .2s, box-shadow .2s;
      border: 1px solid rgba(255,255,255,.5);
    }
    .img-grid img:hover { transform: scale(1.04); box-shadow: 0 6px 18px rgba(61,43,36,.15); }
    /* ── Link list ── */
    .link-list { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
    .link-item {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,.38);
      border: 1px solid rgba(255,255,255,.55);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px; color: ${TEXT_D};
      transition: background .2s;
      text-decoration: none;
    }
    .link-item:hover { background: rgba(255,255,255,.62); }
    .link-label { font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .link-url { font-size: 11px; color: ${TEXT_M}; opacity: .72; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    /* ── Link rows in form ── */
    .link-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
    .link-row input { flex: 1; margin-bottom: 0; }
    .lrow-del {
      flex-shrink: 0; background: none; border: none;
      color: ${TEXT_M}; font-size: 20px; line-height: 1;
      opacity: .45; transition: opacity .2s; padding: 0 4px;
    }
    .lrow-del:hover { opacity: 1; color: #b04040; }
    /* ── Lightbox ── */
    .lb {
      position: fixed; inset: 0;
      background: rgba(25,14,10,.84);
      display: flex; align-items: center; justify-content: center;
      z-index: 500; opacity: 0; pointer-events: none;
      transition: opacity .25s;
    }
    .lb.show { opacity: 1; pointer-events: all; }
    .lb img { max-width: 92vw; max-height: 88vh; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
    .lb-close {
      position: absolute; top: 18px; right: 22px;
      background: none; border: none;
      color: #fff; font-size: 30px; opacity: .65;
      transition: opacity .2s; line-height: 1;
    }
    .lb-close:hover { opacity: 1; }
    /* ── Responsive ── */
    @media (max-width: 700px) {
      .sidebar { width: 160px; min-width: 160px; }
      .main { margin-left: 160px; padding: 32px 20px 72px; }
    }
  </style>
</head>
<body>
<div class="wrap">

  <!-- Sidebar -->
  <nav class="sidebar">
    <div class="sb-brand"><h1>neko</h1></div>
    <div class="sb-nav">
      <a class="sb-link ${active==='diary'?'on':''}" href="/">Diary</a>
      <a class="sb-link ${active==='contact'?'on':''}" href="/contact">Contact</a>
    </div>
    <div class="sb-foot">
      <div class="copy">@2026 lauyiu</div>
      <div class="sub">Give AI to AI,<br>return humanity<br>to humanity.</div>
    </div>
  </nav>

  <!-- Main -->
  <main class="main">
    ${body}
  </main>

</div>
<div id="toast" class="toast"></div>
<script>
  function showToast(m,d=2400){
    const t=document.getElementById('toast');
    t.textContent=m; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),d);
  }
  ${script}
</script>
</body>
</html>`
}

// ─── In-memory store (dev / no-KV fallback) ───────────────────────────────────
// In production with KV the same keys are used in KV namespace DIARY_KV

type Entry = {
  id: string
  date: string
  title: string
  content: string
  emoji: string
  tags: string[]
  images: string[]
  links: { url: string; label: string }[]
  createdAt: string
  updatedAt: string
}

// Simple in-memory store for dev (wrangler local KV used when available)
const memStore: Record<string, Entry> = {}

async function getEntries(kv: KVNamespace | undefined): Promise<Entry[]> {
  if (kv) {
    const list = await kv.list({ prefix: 'trip:' })
    const all: Entry[] = []
    for (const k of list.keys) {
      const v = await kv.get(k.name)
      if (v) all.push(JSON.parse(v))
    }
    return all.sort((a, b) => b.date.localeCompare(a.date))
  }
  return Object.values(memStore).sort((a, b) => b.date.localeCompare(a.date))
}

async function getEntry(kv: KVNamespace | undefined, id: string): Promise<Entry | null> {
  if (kv) {
    const v = await kv.get(`trip:${id}`)
    return v ? JSON.parse(v) : null
  }
  return memStore[id] ?? null
}

async function putEntry(kv: KVNamespace | undefined, e: Entry): Promise<void> {
  if (kv) { await kv.put(`trip:${e.id}`, JSON.stringify(e)); return }
  memStore[e.id] = e
}

async function delEntry(kv: KVNamespace | undefined, id: string): Promise<void> {
  if (kv) { await kv.delete(`trip:${id}`); return }
  delete memStore[id]
}

// ─── App ──────────────────────────────────────────────────────────────────────
type Env = { DIARY_KV?: KVNamespace }
const hono = new Hono<{ Bindings: Env }>()

// ── Diary list (home)
hono.get('/', (c) => {
  const body = /* html */`
    <div class="ph">
      <div class="ph-title">MY DIARY</div>
      <div class="ph-sub" id="ds"></div>
    </div>
    <div id="list"><div class="empty"><div class="ei">📖</div><p>加载中…</p></div></div>
    <button class="fab" id="fabBtn" title="New Entry">+</button>

    <!-- New / Edit modal -->
    <div class="ov" id="editOv">
      <div class="mbox">
        <h3 id="editTitle">NEW ENTRY</h3>
        <input type="hidden" id="eid">
        <div class="fg">
          <label>DATE</label>
          <input type="date" id="edate">
        </div>
        <div class="fg">
          <label>CONTENT</label>
          <textarea id="econtent" placeholder="记录今天的行程、见闻与思考…"></textarea>
        </div>
        <div class="fg">
          <label>UPLOAD IMAGE</label>
          <div id="imgPreview" class="img-grid" style="margin-bottom:8px"></div>
          <label class="upload-btn" for="eimages">+ SELECT IMAGES</label>
          <input type="file" id="eimages" accept="image/*" multiple style="display:none">
        </div>
        <div class="fg">
          <label>VIDEO LINK</label>
          <div id="elinks"></div>
          <button class="btn btn-s" style="margin-top:8px;padding:8px 14px;font-size:6px" type="button" onclick="addLinkRow()">+ ADD LINK</button>
        </div>
        <div class="btn-row" style="margin-top:22px">
          <button class="btn btn-p" onclick="saveEntry()">SAVE</button>
          <button class="btn btn-s" onclick="closeEdit()">CANCEL</button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div class="lb" id="lb">
      <button class="lb-close">✕</button>
      <img src="" alt="">
    </div>

    <!-- View modal -->
    <div class="ov" id="viewOv">
      <div class="mbox">
        <div class="det-head">
          <div>
            <div class="tc-date" id="vdate"></div>
            <div style="font-family:'Press Start 2P',monospace;font-size:13px;color:${TEXT_D};margin-top:8px;line-height:1.7" id="vtitle"></div>
          </div>
          <div class="det-emoji" id="vemoji"></div>
        </div>
        <hr class="div">
        <div class="det-body" id="vcontent"></div>
        <div id="vtags" style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"></div>
        <div id="vimages" class="img-grid"></div>
        <div id="vlinks" class="link-list"></div>
        <hr class="div">
        <div class="btn-row">
          <button class="btn btn-p" onclick="editCurrent()">EDIT</button>
          <button class="btn btn-d" onclick="deleteCurrent()">DELETE</button>
          <button class="btn btn-s" onclick="closeView()">CLOSE</button>
        </div>
      </div>
    </div>
  `

  const script = /* js */`
    // date display
    const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const nd=new Date();
    document.getElementById('ds').textContent=mo[nd.getMonth()]+' '+nd.getDate()+', '+nd.getFullYear();
    document.getElementById('edate').value=nd.toISOString().slice(0,10);

    let cid=null;
    load();

    async function load(){
      const r=await fetch('/api/trips');
      const d=await r.json();
      render(d.entries||[]);
    }

    function render(list){
      const el=document.getElementById('list');
      if(!list.length){
        el.innerHTML='<div class="empty"><div class="ei">✍️</div><p style="font-family:&#39;Press Start 2P&#39;,monospace;font-size:8px;line-height:2">NO ENTRIES YET<br>CLICK + TO START</p></div>';
        return;
      }
      el.innerHTML=list.map(e=>\`
        <div class="card card-click" onclick="view('\${e.id}')">
          <div class="tc-date">\${e.date}</div>
          <div class="tc-title">\${e.emoji} \${e.title}</div>
          <div class="tc-body">\${e.content.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
          <div class="tc-foot">
            \${(e.tags||[]).map(t=>'<span class="pill">'+t+'</span>').join('')}
            <span class="tc-time">\${(e.updatedAt||'').slice(0,10)}</span>
          </div>
        </div>
      \`).join('');
    }

    // image store for current edit session
    let imgData=[];

    function renderImgPreview(){
      const box=document.getElementById('imgPreview');
      box.innerHTML=imgData.map((src,i)=>
        '<div class="img-preview-wrap">'+
        '<img src="'+src+'" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;cursor:pointer" onclick="openLb(this.src)">'+
        '<button class="rm-img" onclick="removeImg('+i+')">\u00d7</button>'+
        '</div>'
      ).join('');
    }

    function removeImg(i){
      imgData.splice(i,1);
      renderImgPreview();
    }

    document.getElementById('eimages').addEventListener('change',function(){
      const files=[...this.files];
      let done=0;
      if(!files.length) return;
      files.forEach(f=>{
        const reader=new FileReader();
        reader.onload=e=>{
          imgData.push(e.target.result);
          done++;
          if(done===files.length) renderImgPreview();
        };
        reader.readAsDataURL(f);
      });
      this.value='';
    });

    // open new
    document.getElementById('fabBtn').onclick=()=>{
      document.getElementById('eid').value='';
      document.getElementById('econtent').value='';
      document.getElementById('elinks').innerHTML='';
      document.getElementById('edate').value=new Date().toISOString().slice(0,10);
      document.getElementById('editTitle').textContent='NEW ENTRY';
      imgData=[];
      renderImgPreview();
      document.getElementById('editOv').classList.add('show');
    };

    function closeEdit(){ document.getElementById('editOv').classList.remove('show'); }
    function closeView(){ document.getElementById('viewOv').classList.remove('show'); }

    // lightbox
    const lbEl=document.getElementById('lb');
    lbEl.querySelector('.lb-close').onclick=()=>lbEl.classList.remove('show');
    lbEl.addEventListener('click',e=>{ if(e.target===lbEl) lbEl.classList.remove('show'); });
    function openLb(src){ lbEl.querySelector('img').src=src; lbEl.classList.add('show'); }

    // add link row helper
    function addLinkRow(url,label){
      url=url||'';
      const wrap=document.getElementById('elinks');
      const row=document.createElement('div');
      row.className='link-row';
      const u=document.createElement('input');
      u.type='url'; u.placeholder='https://'; u.value=url; u.style.flex='1';
      const d=document.createElement('button');
      d.type='button'; d.className='lrow-del'; d.textContent='×';
      d.onclick=()=>row.remove();
      row.appendChild(u); row.appendChild(d);
      wrap.appendChild(row);
    }

    async function view(id){
      const r=await fetch('/api/trips/'+id);
      const d=await r.json();
      if(!d.entry) return;
      const e=d.entry; cid=id;
      document.getElementById('vdate').textContent=e.date;
      document.getElementById('vtitle').textContent=e.title;
      document.getElementById('vemoji').textContent=e.emoji;
      document.getElementById('vcontent').textContent=e.content;
      document.getElementById('vtags').innerHTML=(e.tags||[]).map(t=>'<span class="pill">'+t+'</span>').join('');
      // images
      const imgs=e.images||[];
      document.getElementById('vimages').innerHTML=imgs.map(u=>
        '<img src="'+u+'" alt="" loading="lazy" onclick="openLb(this.src)">'
      ).join('');
      // links
      const lks=e.links||[];
      document.getElementById('vlinks').innerHTML=lks.map(l=>
        '<a class="link-item" href="'+l.url+'" target="_blank" rel="noopener noreferrer">'+
        '<span style="font-size:15px">🔗</span>'+
        '<span class="link-label">'+(l.label||l.url)+'</span>'+
        '<span class="link-url">'+l.url+'</span>'+
        '</a>'
      ).join('');
      document.getElementById('viewOv').classList.add('show');
    }

    function editCurrent(){
      closeView();
      fetch('/api/trips/'+cid).then(r=>r.json()).then(d=>{
        const e=d.entry;
        document.getElementById('eid').value=e.id;
        document.getElementById('edate').value=e.date;
        document.getElementById('econtent').value=e.content;
        imgData=[...(e.images||[])];
        renderImgPreview();
        const wrap=document.getElementById('elinks');
        wrap.innerHTML='';
        (e.links||[]).forEach(l=>addLinkRow(l.url));
        document.getElementById('editTitle').textContent='EDIT ENTRY';
        document.getElementById('editOv').classList.add('show');
      });
    }

    async function deleteCurrent(){
      if(!cid||!confirm('DELETE THIS ENTRY?')) return;
      const r=await fetch('/api/trips/'+cid,{method:'DELETE'});
      if(r.ok){ closeView(); showToast('DELETED'); load(); }
    }

    async function saveEntry(){
      const id=document.getElementById('eid').value;
      // collect link rows
      const lrows=[...document.querySelectorAll('#elinks .link-row')];
      const links=lrows.map(row=>{
        const ins=row.querySelectorAll('input');
        return {url:ins[0].value.trim(), label:''};
      }).filter(l=>l.url);
      // collect images
      const images=[...imgData];
      const dateVal=document.getElementById('edate').value;
      const body={
        date:dateVal,
        title:dateVal||'日志',
        content:document.getElementById('econtent').value.trim(),
        emoji:'📖',
        tags:[],
        images,
        links
      };
      const url=id?'/api/trips/'+id:'/api/trips';
      const r=await fetch(url,{method:id?'PUT':'POST',
        headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if(r.ok){ closeEdit(); showToast(id?'UPDATED ✓':'SAVED ✓'); load(); }
    }

    // close on overlay
    ['editOv','viewOv'].forEach(id=>{
      document.getElementById(id).addEventListener('click',function(e){
        if(e.target===this) this.classList.remove('show');
      });
    });
  `
  return c.html(shell('Diary', 'diary', body, script))
})

// ── Contact
hono.get('/contact', (c) => {
  const body = /* html */`
    <div class="ph">
      <div class="ph-title">CONTACT</div>
    </div>
    <div style="font-size:13px;color:${TEXT_M};line-height:3;letter-spacing:.8px;font-family:'Times New Roman',Times,serif">
      <div><a href="https://www.nekolauyiu.com" target="_blank" style="color:${ACCENT};text-decoration:none">www.nekolauyiu.com</a></div>
      <div><a href="mailto:contact@nekolauyiu.com" style="color:${ACCENT};text-decoration:none">contact@nekolauyiu.com</a></div>
      <div><a href="https://www.taxlema.com" target="_blank" style="color:${ACCENT};text-decoration:none">www.taxlema.com</a></div>
    </div>
  `
  return c.html(shell('Contact', 'contact', body))
})

// ─── REST API ─────────────────────────────────────────────────────────────────

// List
hono.get('/api/trips', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const entries = await getEntries(kv)
  return c.json({ entries })
})

// Get one
hono.get('/api/trips/:id', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const entry = await getEntry(kv, c.req.param('id'))
  if (!entry) return c.json({ error: 'not found' }, 404)
  return c.json({ entry })
})

// Create
hono.post('/api/trips', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const b = await c.req.json<Partial<Entry>>()
  const now = new Date().toISOString()
  const entry: Entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    date: b.date || now.slice(0,10),
    title: b.title || '无标题',
    content: b.content || '',
    emoji: b.emoji || '🌍',
    tags: b.tags || [],
    images: b.images || [],
    links: b.links || [],
    createdAt: now,
    updatedAt: now,
  }
  await putEntry(kv, entry)
  return c.json({ entry }, 201)
})

// Update
hono.put('/api/trips/:id', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const old = await getEntry(kv, c.req.param('id'))
  if (!old) return c.json({ error: 'not found' }, 404)
  const b = await c.req.json<Partial<Entry>>()
  const entry: Entry = { ...old, ...b, id: old.id, updatedAt: new Date().toISOString() }
  await putEntry(kv, entry)
  return c.json({ entry })
})

// Delete
hono.delete('/api/trips/:id', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  await delEntry(kv, c.req.param('id'))
  return c.json({ ok: true })
})

// Fallback
hono.get('*', (c) => c.redirect('/'))

export default hono
