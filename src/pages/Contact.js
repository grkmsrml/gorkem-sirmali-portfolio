/* ============================================
   İLETİŞİM

   Form gönderimi: site statik olduğu için sunucu yok. Doğrulama
   tarayıcıda yapılır, ardından kullanıcının e-posta istemcisi
   hazır doldurulmuş bir taslakla açılır. Hiçbir servise bağımlılık
   yok ve mesaj kaybolmuyor.

   Gerçek bir form servisine (Formspree, Netlify Forms) geçmek
   istersek yalnız submitContactForm() değişir; işaretleme aynı kalır.
   ============================================ */

import { t, pick } from '../i18n.js';
import { contact, profile } from '../data/personal.js';

const socialIcons = {
  github: '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>',
  linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>',
  behance: '<path d="M7.443 5.35c.639 0 1.23.05 1.77.198.541.099 1.001.297 1.377.544.383.248.673.594.874 1.04.198.445.297.99.297 1.583 0 .693-.149 1.286-.494 1.731-.297.446-.775.842-1.364 1.138.825.248 1.435.693 1.829 1.286.396.594.594 1.336.594 2.177 0 .693-.148 1.286-.396 1.781-.248.495-.643.94-1.088 1.237-.445.297-.99.544-1.583.693-.594.148-1.187.198-1.78.198H0V5.35h7.443zm-.446 5.453c.544 0 .99-.148 1.336-.396.346-.247.495-.693.495-1.237 0-.297-.05-.594-.149-.792-.099-.198-.247-.346-.445-.445-.198-.1-.396-.198-.643-.248-.248-.05-.495-.05-.792-.05H3.362v3.168h3.635zm.198 5.751c.297 0 .594-.05.841-.099.248-.05.495-.148.693-.297.198-.148.346-.346.446-.593.099-.248.148-.545.148-.891 0-.693-.198-1.187-.594-1.484-.395-.297-.94-.446-1.583-.446H3.362v3.81h3.833zM16.9 16.505c.445.445 1.09.668 1.929.668.594 0 1.114-.149 1.535-.446.421-.297.68-.618.779-.94h2.276c-.371 1.138-.94 1.954-1.706 2.449-.767.495-1.682.742-2.795.742-.767 0-1.46-.124-2.079-.371-.618-.248-1.138-.594-1.583-1.064-.421-.47-.767-1.014-.99-1.657-.223-.643-.346-1.361-.346-2.128 0-.742.123-1.435.346-2.078.248-.643.594-1.188 1.015-1.657.445-.47.965-.841 1.583-1.114.618-.272 1.286-.396 2.054-.396.841 0 1.583.173 2.226.495.643.322 1.163.767 1.583 1.31.396.545.693 1.163.866 1.855.173.693.223 1.41.173 2.177h-7.418c0 .792.272 1.484.717 1.929l-.165-.774zm3.365-5.157c-.346-.396-.94-.618-1.657-.618-.47 0-.866.074-1.163.247-.297.149-.545.347-.718.545-.173.198-.297.421-.371.643-.074.223-.123.42-.123.594h4.601c-.074-.717-.223-1.014-.569-1.41zM15.19 6.293h5.75v1.4h-5.75v-1.4z"/>',
};

function socialLink({ id, label, url }) {
  return `
    <a href="${url}" target="_blank" rel="noopener" class="contact__social-link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        ${socialIcons[id] ?? ''}
      </svg>
      <span>${label}</span>
      <span class="contact__social-arrow" aria-hidden="true">→</span>
    </a>
  `;
}

function field({ name, labelKey, type = 'text', required = true, rows }) {
  const control = rows
    ? `<textarea id="cf-${name}" name="${name}" rows="${rows}" ${required ? 'required' : ''}
                 class="field__control"></textarea>`
    : `<input id="cf-${name}" name="${name}" type="${type}" ${required ? 'required' : ''}
              class="field__control" />`;

  return `
    <div class="field">
      <label for="cf-${name}" class="field__label meta">
        ${t(labelKey)}${required ? ' *' : ''}
      </label>
      ${control}
      <p class="field__error" data-error-for="${name}" hidden></p>
    </div>
  `;
}

export function renderContact() {
  return `
    <div class="container">
      <header class="page-head">
        <span class="overline">${t('nav.contact')}</span>
        <h1 class="page-head__title">${t('contact.title')}</h1>
        <p class="page-head__lead">${t('contact.lead')}</p>
      </header>

      <div class="frame frame--split contact">
        <!-- Sol hücre: doğrudan kanallar -->
        <div class="cell contact__aside">
          <div>
            <span class="overline">${t('contact.direct')}</span>
            <a href="mailto:${contact.email}" class="contact__email">${contact.email}</a>
            <p class="meta contact__location">${pick(profile.location)}</p>
          </div>

          <div class="contact__social">
            <span class="overline">${t('contact.social')}</span>
            ${contact.social.map(socialLink).join('')}
          </div>
        </div>

        <!-- Sağ hücre: form -->
        <div class="cell">
          <form class="contact__form" data-contact-form novalidate>
            ${field({ name: 'name', labelKey: 'contact.name' })}
            ${field({ name: 'email', labelKey: 'contact.email', type: 'email' })}
            ${field({ name: 'subject', labelKey: 'contact.subject', required: false })}
            ${field({ name: 'message', labelKey: 'contact.message', rows: 7 })}

            <div class="contact__submit">
              <button type="submit" class="btn btn--accent">${t('contact.send')}</button>
              <p class="meta contact__hint">${t('contact.hint')}</p>
            </div>

            <p class="contact__status" data-form-status hidden></p>
          </form>
        </div>
      </div>
    </div>
  `;
}

/* ============================================
   FORM DOĞRULAMA VE GÖNDERİM
   ============================================ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(form, name, messageKey) {
  const box = form.querySelector(`[data-error-for="${name}"]`);
  const input = form.querySelector(`[name="${name}"]`);
  if (!box) return;

  box.textContent = t(messageKey);
  box.hidden = false;
  input?.classList.add('is-invalid');
  input?.setAttribute('aria-invalid', 'true');
}

function clearErrors(form) {
  form.querySelectorAll('[data-error-for]').forEach((box) => {
    box.hidden = true;
    box.textContent = '';
  });
  form.querySelectorAll('.field__control').forEach((input) => {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  });
}

/**
 * İletişim formunu doğrular ve e-posta taslağı açar.
 * main.js'teki submit delegasyonundan çağrılır.
 */
export function submitContactForm(form) {
  clearErrors(form);

  const data = Object.fromEntries(new FormData(form));
  const name = (data.name ?? '').trim();
  const email = (data.email ?? '').trim();
  const subject = (data.subject ?? '').trim();
  const message = (data.message ?? '').trim();

  let firstInvalid = null;

  if (!name) {
    showError(form, 'name', 'contact.errName');
    firstInvalid ??= 'name';
  }
  if (!email) {
    showError(form, 'email', 'contact.errEmailRequired');
    firstInvalid ??= 'email';
  } else if (!EMAIL_PATTERN.test(email)) {
    showError(form, 'email', 'contact.errEmailInvalid');
    firstInvalid ??= 'email';
  }
  if (!message) {
    showError(form, 'message', 'contact.errMessage');
    firstInvalid ??= 'message';
  }

  if (firstInvalid) {
    form.querySelector(`[name="${firstInvalid}"]`)?.focus();
    return;
  }

  // Doğrulama geçti — e-posta taslağını hazırla
  const mailSubject = subject || `${t('contact.mailSubject')} — ${name}`;
  const body = `${message}\n\n—\n${name}\n${email}`;

  const href = `mailto:${contact.email}`
    + `?subject=${encodeURIComponent(mailSubject)}`
    + `&body=${encodeURIComponent(body)}`;

  window.location.href = href;

  const status = form.querySelector('[data-form-status]');
  if (status) {
    status.textContent = t('contact.opened');
    status.hidden = false;
  }
}
