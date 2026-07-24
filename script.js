// ---- animated typewriter hero name ----
  function splitAnimate(el, delayStart){
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.style.animationDelay = (delayStart + i*0.035) + 's';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
    });
  }
  splitAnimate(document.getElementById('hero-name'), 0.2);
  splitAnimate(document.getElementById('hero-role'), 0.9);

  // ---- scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el=>io.observe(el));

  // ---- network background canvas ----
  const canvas = document.getElementById('netbg');
  const ctx = canvas.getContext('2d');
  let w, h, nodes;
  const NODE_COUNT = 46;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function initNodes(){
    nodes = Array.from({length:NODE_COUNT}, ()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5)*0.35,
      vy: (Math.random()-0.5)*0.35
    }));
  }
  resize();
  initNodes();
  window.addEventListener('resize', ()=>{ resize(); });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tick(){
    ctx.clearRect(0,0,w,h);
    for(const n of nodes){
      if(!reduceMotion){
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > w) n.vx *= -1;
        if(n.y < 0 || n.y > h) n.vy *= -1;
      }
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 150){
          ctx.strokeStyle = `rgba(76,224,210,${0.12 * (1-dist/150)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      ctx.fillStyle = 'rgba(76,224,210,0.5)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI*2);
      ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(tick);
  }
  tick();
