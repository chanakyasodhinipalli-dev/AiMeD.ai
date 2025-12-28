(function(){
  const c = document.getElementById("heroCanvas");
  if(!c) return;
  const ctx = c.getContext("2d");
  let w=0,h=0, dpr=Math.min(2, window.devicePixelRatio||1);
  const N = 58;
  const pts = Array.from({length:N}, ()=>({
    x: Math.random(), y: Math.random(),
    vx: (Math.random()-.5)*0.00045, vy:(Math.random()-.5)*0.00045
  }));
  function resize(){
    const r = c.getBoundingClientRect();
    w = Math.max(1, r.width); h=Math.max(1, r.height);
    c.width = Math.floor(w*dpr); c.height = Math.floor(h*dpr);
  }
  resize();
  window.addEventListener("resize", resize);

  function step(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.save();
    ctx.scale(dpr,dpr);
    // soft fill
    ctx.fillStyle = "rgba(0,0,0,.08)";
    ctx.fillRect(0,0,w,h);
    // move
    for (const p of pts){
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>1) p.vx*=-1;
      if (p.y<0||p.y>1) p.vy*=-1;
    }
    // lines
    for (let i=0;i<N;i++){
      for (let j=i+1;j<N;j++){
        const a=pts[i], b=pts[j];
        const dx=(a.x-b.x)*w, dy=(a.y-b.y)*h;
        const dist=Math.hypot(dx,dy);
        if(dist<120){
          const alpha = (1 - dist/120) * 0.18;
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x*w, a.y*h);
          ctx.lineTo(b.x*w, b.y*h);
          ctx.stroke();
        }
      }
    }
    // points
    for (const p of pts){
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.beginPath();
      ctx.arc(p.x*w, p.y*h, 1.6, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
    requestAnimationFrame(step);
  }
  step();
})();
