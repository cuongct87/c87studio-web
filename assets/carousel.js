// Dải ảnh cong 3D — C87 Studio tự viết, không dùng thư viện ngoài.
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var stage = root.querySelector('.carousel-stage');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.carousel-card'));
    var title = root.querySelector('.carousel-caption b');
    var sub = root.querySelector('.carousel-caption span');
    var dots = root.querySelector('.carousel-dots');
    var n = cards.length;
    var active = 0;
    var dragX = 0;

    cards.forEach(function () { dots.appendChild(document.createElement('i')); });

    function wrap(d) {
      // Khoảng cách ngắn nhất theo vòng tròn, để dải ảnh quay vòng.
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      return d;
    }

    function render(offsetPx) {
      var w = cards[0].offsetWidth;
      var shift = (offsetPx || 0) / (w * 0.62);
      cards.forEach(function (card, i) {
        var d = wrap(i - active) + shift;
        var ad = Math.abs(d);
        var x = d * w * 0.62;
        var z = -ad * 90;
        var rot = Math.max(-55, Math.min(55, -d * 28));
        card.style.transform = 'translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + rot + 'deg)';
        card.style.opacity = ad > 3.6 ? 0 : 1 - ad * 0.13;
        card.style.zIndex = String(100 - Math.round(ad * 10));
        card.style.filter = ad < 0.5 ? 'none' : 'brightness(' + (1 - Math.min(ad, 3) * 0.15) + ')';
        card.classList.toggle('is-active', i === active && !offsetPx);
      });
      var c = cards[active];
      title.textContent = c.dataset.title || '';
      sub.textContent = c.dataset.sub || '';
      Array.prototype.forEach.call(dots.children, function (dot, i) { dot.classList.toggle('on', i === active); });
    }

    function go(step) { active = (active + step + n) % n; render(0); }

    root.querySelector('[data-prev]').addEventListener('click', function () { go(-1); });
    root.querySelector('[data-next]').addEventListener('click', function () { go(1); });
    cards.forEach(function (card, i) {
      card.addEventListener('click', function () {
        if (Math.abs(dragX) > 6) return;
        var d = wrap(i - active);
        if (d) go(d);
      });
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });

    var startX = null;
    stage.addEventListener('pointerdown', function (e) { startX = e.clientX; dragX = 0; });
    window.addEventListener('pointermove', function (e) {
      if (startX === null) return;
      dragX = e.clientX - startX;
      render(dragX);
    });
    window.addEventListener('pointerup', function () {
      if (startX === null) return;
      var w = cards[0].offsetWidth * 0.62;
      var steps = Math.round(-dragX / w);
      startX = null;
      active = ((active + steps) % n + n) % n;
      render(0);
      setTimeout(function () { dragX = 0; }, 0);
    });
    window.addEventListener('resize', function () { render(0); });
    render(0);
  });
})();
