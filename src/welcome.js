// Panel de bienvenida: aparece al entrar (una vez por sesión) y se puede cerrar.
// Para poner tu imagen, guarda un archivo en  public/welcome.png  (cambia IMG_NAME si usas otro nombre o formato).
const IMG_NAME = 'welcome.png';
const KEY_OFF = 'sala7_welcome_off';
const KEY_SES = 'sala7_welcome_seen';

const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };

function open() {
  if (safe(() => localStorage.getItem(KEY_OFF), null) === '1') return;
  if (safe(() => sessionStorage.getItem(KEY_SES), null) === '1') return;
  safe(() => sessionStorage.setItem(KEY_SES, '1'));

  const base = (import.meta.env && import.meta.env.BASE_URL) || './';
  const el = document.createElement('div');
  el.className = 'wl';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'wl-t');
  el.innerHTML = `
    <div class="wl-card">
      <button class="wl-x" type="button" aria-label="Cerrar">✕</button>
      <div class="wl-art">
        <img alt="" src="${base}${IMG_NAME}">
        <div class="wl-fb" aria-hidden="true"><span>7</span></div>
      </div>
      <div class="wl-body">
        <span class="wl-kicker">Bienvenido a</span>
        <h2 id="wl-t">Sala 7</h2>
        <p>Películas, series, anime y manga en un solo sitio. Guarda tus listas, retoma donde lo dejaste y sincroniza todo con tu cuenta.</p>
        <div class="wl-act">
          <button class="btn wl-go" type="button">Empezar</button>
          <label class="wl-chk"><input type="checkbox"> No volver a mostrar</label>
        </div>
      </div>
    </div>`;
  document.body.append(el);
  document.body.style.overflow = 'hidden';

  const img = el.querySelector('.wl-art img');
  img.addEventListener('error', () => el.classList.add('noimg'));
  img.addEventListener('load', () => el.classList.add('hasimg'));

  const close = () => {
    if (el.querySelector('.wl-chk input').checked) safe(() => localStorage.setItem(KEY_OFF, '1'));
    el.classList.add('out');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => { el.remove(); document.body.style.overflow = ''; }, 320);
  };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  el.addEventListener('click', e => { if (e.target === el) close(); });
  el.querySelector('.wl-x').onclick = close;
  el.querySelector('.wl-go').onclick = close;
  el.querySelector('.wl-go').focus();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open);
else open();
