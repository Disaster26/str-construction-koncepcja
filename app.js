(function(){
  'use strict';
  var d=document;

  // menu mobilne
  var burger=d.getElementById('burger'), nav=d.getElementById('nav');
  function zamknij(){nav.classList.remove('otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var o=nav.classList.toggle('otw');
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
  });
  nav.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu
  var linki=[].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sekcje=linki.map(function(a){return d.querySelector(a.getAttribute('href'));});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(wpisy){
      wpisy.forEach(function(w){
        if(w.isIntersecting){
          linki.forEach(function(a){a.classList.toggle('akt',a.getAttribute('href')==='#'+w.target.id);});
        }
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    sekcje.forEach(function(s){if(s)io.observe(s);});
    var hero=d.querySelector('.hero');
    new IntersectionObserver(function(w){if(w[0].isIntersecting)linki.forEach(function(a){a.classList.remove('akt');});},{rootMargin:'-45% 0px -50% 0px'}).observe(hero);

    // pasek mobilny po przewinieciu za przycisk hero
    var mob=d.getElementById('mob'), cta=d.querySelector('.hero-cta'), kontakt=d.getElementById('kontakt');
    var zaCta=false, wKontakcie=false;
    function pasek(){var v=zaCta&&!wKontakcie;mob.classList.toggle('widac',v);mob.setAttribute('aria-hidden',v?'false':'true');[].forEach.call(mob.querySelectorAll('a'),function(a){a.tabIndex=v?0:-1;});}
    new IntersectionObserver(function(w){zaCta=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;pasek();}).observe(cta);
    new IntersectionObserver(function(w){wKontakcie=w[0].isIntersecting;pasek();},{threshold:.15}).observe(kontakt);
  }

  // przeciaganie mysza (palcem dziala natywnie przez scroll-snap)
  function ciagnij(el){
    var x0=0,s0=0,akt=false,ruch=0;
    el.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||e.button!==0)return;
      akt=true;ruch=0;x0=e.clientX;s0=el.scrollLeft;el.classList.add('ciag');
      e.preventDefault();
    });
    window.addEventListener('pointermove',function(e){
      if(!akt)return;var dx=e.clientX-x0;ruch=Math.max(ruch,Math.abs(dx));el.scrollLeft=s0-dx;
    });
    window.addEventListener('pointerup',function(){
      if(!akt)return;akt=false;
      var sl=el.scrollLeft;el.classList.remove('ciag');el.scrollLeft=sl;
      if(el.dispatchEvent)el.dispatchEvent(new Event('scroll'));
    });
    el.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();ruch=0;}},true);
  }

  var strz='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5"/></svg>';
  var strzL='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 10H5M9 5l-5 5 5 5"/></svg>';

  // karuzele w kartach
  [].forEach.call(d.querySelectorAll('[data-kar]'),function(k){
    var tor=k.querySelector('.kar-tor'), n=tor.children.length;
    if(n<2)return;
    var l=d.createElement('button'), p=d.createElement('button'), licz=d.createElement('span');
    l.className='kar-btn l';l.type='button';l.setAttribute('aria-label','Poprzednie zdjęcie');l.innerHTML=strzL;
    p.className='kar-btn p';p.type='button';p.setAttribute('aria-label','Następne zdjęcie');p.innerHTML=strz;
    licz.className='kar-licz';licz.setAttribute('aria-hidden','true');
    k.appendChild(l);k.appendChild(p);k.appendChild(licz);
    function idx(){return Math.round(tor.scrollLeft/tor.clientWidth);}
    function odswiez(){var i=idx();licz.textContent=(i+1)+' / '+n;l.disabled=i<=0;p.disabled=i>=n-1;}
    function idz(i){tor.scrollTo({left:Math.max(0,Math.min(n-1,i))*tor.clientWidth,behavior:'smooth'});}
    l.addEventListener('click',function(){idz(idx()-1);});
    p.addEventListener('click',function(){idz(idx()+1);});
    var t;tor.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(odswiez,60);},{passive:true});
    tor.setAttribute('tabindex','0');tor.setAttribute('aria-label','Zdjęcia, przewiń w bok');
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1);}});
    window.addEventListener('resize',odswiez);
    ciagnij(tor);odswiez();
  });

  // galeria z budowy
  var g=d.getElementById('galeria');
  if(g){
    ciagnij(g);
    [].forEach.call(d.querySelectorAll('[data-g]'),function(b){
      b.addEventListener('click',function(){
        var f=g.querySelector('figure');var krok=f?f.getBoundingClientRect().width+20:400;
        g.scrollBy({left:krok*Number(b.getAttribute('data-g')),behavior:'smooth'});
      });
    });
  }

  // formularz pokazowy
  var form=d.getElementById('form'), info=d.getElementById('form-info');
  form.addEventListener('submit',function(e){e.preventDefault();info.hidden=false;});

  var plik=d.getElementById('plik'),pn=d.getElementById('plik-nazwa');
  if(plik)plik.addEventListener('change',function(){pn.textContent=plik.files.length?plik.files[0].name:'Nie wybrano pliku';});

  var rok=d.getElementById('rok');if(rok)rok.textContent=new Date().getFullYear();
})();
