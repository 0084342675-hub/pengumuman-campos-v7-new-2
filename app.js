const y=document.querySelector("#year");for(let i=2000;i<=2026;i++){let o=document.createElement("option");o.value=i;o.textContent=i;y.appendChild(o)}
const C=['No', 'Nama', 'Kelas', 'Jenis Kelamin', 'Pilihan', 'Skolastik', 'Wudhu', 'Sholat', 'Akidah Akhlak', 'Hadist & doa sehari-hari', 'Tajwid', 'Kefasihan', 'Kelancaran', 'Sub Total Keagamaan Islam', 'Ibadah ke Gereja', 'Pelayanan di Gereja', 'Lagu Pujian', 'Berdoa & Membaca Alkitab', 'Doa Bapa Kami', 'Sepuluh Perintah Allah', 'Kebiasaan Baik', 'Menghormati Orang Tua', 'Sub Total Keagamaan Kristen & Katolik', 'Intonasi', 'Artikulasi', 'Volume Suara', 'Pemilihan Kata', 'Struktur Kalimat', 'Gestur', 'Ekspresi', 'Kesesuaian Isi', 'Kelancaran Public Speaking', 'Sub Total Public Speaking', 'Sikap & Perilaku', 'Komunikasi', 'Karakter', 'Hubungan', 'Dukungan', 'Manajemen Waktu', 'Konsistensi', 'MPK - OSIS', 'Komitmen', 'Sub Total Wawancara', 'Jumlah Nilai', 'Keterangan'];
const norm=s=>String(s||"").trim().replace(/\s+/g," ").toUpperCase();
function parseCSV(t){let a=[],r=[],c="",q=false;for(let i=0;i<t.length;i++){let x=t[i],n=t[i+1];if(x=='"'&&q&&n=='"'){c+='"';i++;continue}if(x=='"'){q=!q;continue}if(x==","&&!q){r.push(c);c="";continue}if((x=="\n"||x=="\r")&&!q){if(x=="\r"&&n=="\n")i++;r.push(c);c="";if(r.some(v=>v.trim()))a.push(r);r=[];continue}c+=x}if(c||r.length){r.push(c);a.push(r)}let h=a.shift().map(x=>x.trim());return a.map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]||""])))}
const e=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function table(p){
  const t=document.querySelector("#scoreTable");
  const fixed=["No","Nama","Kelas","Jenis Kelamin","Pilihan","Skolastik"];
  const groups=[
    ["Keagamaan Islam",["Wudhu","Sholat","Akidah Akhlak","Hadist & doa sehari-hari","Tajwid","Kefasihan","Kelancaran","Sub Total Keagamaan Islam"]],
    ["Keagamaan Kristen & Katolik",["Ibadah ke Gereja","Pelayanan di Gereja","Lagu Pujian","Berdoa & Membaca Alkitab","Doa Bapa Kami","Sepuluh Perintah Allah","Kebiasaan Baik","Menghormati Orang Tua","Sub Total Keagamaan Kristen & Katolik"]],
    ["Public Speaking",["Intonasi","Artikulasi","Volume Suara","Pemilihan Kata","Struktur Kalimat","Gestur","Ekspresi","Kesesuaian Isi","Kelancaran Public Speaking","Sub Total Public Speaking"]],
    ["Wawancara",["Sikap & Perilaku","Komunikasi","Karakter","Hubungan","Dukungan","Manajemen Waktu","Konsistensi","MPK - OSIS","Komitmen","Sub Total Wawancara"]]
  ];
  const tail=["Jumlah Nilai","Keterangan"];
  const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  let h="<thead><tr class='group'>";
  fixed.forEach(x=>h+=`<th rowspan="2">${esc(x)}</th>`);
  groups.forEach(g=>h+=`<th colspan="${g[1].length}">${esc(g[0])}</th>`);
  tail.forEach(x=>h+=`<th rowspan="2">${esc(x)}</th>`);
  h+="</tr><tr class='sub'>";
  groups.forEach(g=>g[1].forEach(x=>h+=`<th>${esc(x)}</th>`));
  h+="</tr></thead>";
  const all=[...fixed,...groups.flatMap(g=>g[1]),...tail];
  h+="<tbody><tr>";
  all.forEach(x=>h+=`<td class="${x==="Jumlah Nilai"?"final":""}">${esc(p[x])}</td>`);
  h+="</tr></tbody>";
  t.innerHTML=h;
}

document.querySelector("#form").addEventListener("submit",async ev=>{ev.preventDefault();let m=document.querySelector("#msg");m.textContent="";try{let r=await fetch("data/peserta.csv?v="+Date.now(),{cache:"no-store"});let d=parseCSV(await r.text()),p=d.find(x=>norm(x.Nama)==norm(document.querySelector("#name").value)&&norm(x.Kelas)==norm(document.querySelector("#class").value)&&x.tahun_lahir==y.value&&String(x.Pilihan).toUpperCase()==document.querySelector("#division").value);if(!p){m.textContent="Data tidak ditemukan. Periksa kembali nama, kelas, tahun lahir, dan pilihan MPK/OSIS.";return}let s=(p.status||"red").toLowerCase(),card=document.querySelector("#resultCard");card.className="result "+s;document.querySelector("#status").textContent=s=="blue"?"LOLOS":s=="yellow"?"LOLOS BERSYARAT":"TIDAK LOLOS";document.querySelector("#title").textContent=p.judul||"Hasil Seleksi";document.querySelector("#rname").textContent=p.Nama;document.querySelector("#rdivision").textContent=p.Pilihan;document.querySelector("#desc").textContent=p.keterangan||"";document.querySelector("#icon").textContent=s=="blue"?"✓":s=="yellow"?"!":"×";table(p);document.querySelector("#result").classList.remove("hidden");document.querySelector("#result").scrollIntoView({behavior:"smooth",block:"center"})}catch(x){m.textContent="Database belum tersedia. Pastikan data/peserta.csv sudah di-upload."}});
document.querySelector("#reset").onclick=()=>{document.querySelector("#form").reset();document.querySelector("#result").classList.add("hidden");document.querySelector("#cek").scrollIntoView({behavior:"smooth"})};