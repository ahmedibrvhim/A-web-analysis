/* ══════════════════════════════════════
   BRAND A — Shared Language Module
   Persists the user's language choice (localStorage) so it carries
   across index.html, login.html and home.html, and provides a small
   helper to translate any element marked up with data-i18n.
══════════════════════════════════════ */

export const STORAGE_KEY = 'brandA_lang';

export const dict = {
  en: {
    /* ── nav / common ── */
    nav_home: 'Home',
    nav_login: 'Login / Register',
    sign_out: 'Sign out',
    lang_label: 'EN',
    lang_other: 'AR',

    /* ── home.html ── */
    hero_sub: '☠ Lower-Third Ratio Calculator ☠',
    about_eyebrow: '☠ The Method ☠',
    about_title: 'A Precise Reading Of Your Lower Third',
    about_lead: "Upload a photo and the engine places four classical landmarks — trichion, nasion, subnasale and menton — the instant it loads. Drag any point to refine it, add a side profile so head tilt is corrected automatically, and receive your lower-third ratio as a clean percentage measured against the classical ideal.",
    feat1_title: 'AI Landmark Detection',
    feat1_text: "Four key points are placed on your photo automatically the moment it's uploaded.",
    feat2_title: 'Manual Precision',
    feat2_text: 'Drag any point to correct it — the final measurement is always in your hands.',
    feat3_title: 'Automatic Tilt Correction',
    feat3_text: 'A side-view photo lets the engine straighten a tilted head before measuring a single pixel.',
    feat4_title: 'Your Ratio, Instantly',
    feat4_text: 'Get a clean percentage, benchmarked against the classical ideal — ready to save.',
    about_cta: '☠ \u00A0 Enter The Tool',
    ratio_caption: 'Classical Lower-Third Ideal',
    hero_cta_text: 'Enter The Tool',
    scroll_cue_text: 'Scroll To Learn More',

    /* ── login.html ── */
    portal_sub: '☠ Client Portal ☠',
    tab_signin: 'Sign In',
    tab_register: 'Register',
    lbl_email: 'Email Address',
    lbl_password: 'Password',
    lbl_fullname: 'Full Name',
    lbl_password_min: 'Password (min 6 characters)',
    lbl_confirm_password: 'Confirm Password',
    lbl_new_password: 'New Password (min 6 characters)',
    lbl_confirm_new_password: 'Confirm New Password',
    forgot_password: 'Forgot password?',
    btn_signin: '☠ \u00A0 Sign In',
    btn_register: '☠ \u00A0 Create Account',
    btn_reset: '☠ \u00A0 Set New Password',
    or_text: 'Or',
    btn_google: 'Continue with Google',
    placeholder_email: 'your@email.com',
    placeholder_password: '••••••••',
    placeholder_name: 'Your name',
    please_wait: 'Please wait...',
    reset_intro_prefix: 'Enter a new password for ',

    /* ── login.html dynamic messages ── */
    msg_account_removed: 'Your account was removed. Please sign in again to restore access.',
    msg_auth_required: 'Sign in or register to unlock the Tool. ☠',
    msg_invalid_email: 'Please enter a valid email.',
    msg_enter_password: 'Please enter your password.',
    msg_enter_name: 'Please enter your name.',
    msg_password_min: 'Password must be at least 6 characters.',
    msg_passwords_no_match: 'Passwords do not match.',
    msg_account_created: 'Account created! Redirecting...',
    msg_welcome_back: '💀 Welcome back!',
    msg_welcome_new: '💀 Welcome to Brand A!',
    msg_welcome_google: '💀 Welcome!',
    msg_forgot_prompt: 'Enter your email address in the field above first, then click "Forgot password?".',
    msg_sending_reset: 'Sending reset email...',
    msg_reset_sent: '✓ Password reset email sent to {email}. Check your inbox (and spam folder).',
    msg_reset_invalid_link: 'This password reset link is invalid or has expired. Please request a new one.',
    msg_password_updated: '✓ Password updated. Please sign in with your new password.',
    msg_password_updated_toast: '💀 Password updated!',
    err_user_not_found: 'No account found with this email. Please register.',
    err_wrong_password: 'Incorrect password. Try again or reset it.',
    err_invalid_credential: 'Invalid email or password.',
    err_email_in_use: 'This email is already registered.',
    err_weak_password: 'Password must be at least 6 characters.',
    err_invalid_email: 'Please enter a valid email address.',
    err_too_many_requests: 'Too many attempts. Please wait a few minutes.',
    err_network: 'Network error. Check your connection.',
    err_generic: 'Something went wrong. Please try again.',
    err_reset_user_not_found: 'No account found with this email address.',
    err_reset_invalid_email: 'Please enter a valid email address.',
    err_reset_too_many: 'Too many requests. Please wait before trying again.',
    err_reset_expired: 'This reset link has expired. Please request a new one.',
    err_reset_invalid_code: 'This reset link is invalid or has already been used.',
    err_reset_generic: 'Could not reset password. Please try again.',
    strength_very_weak: 'Very Weak',
    strength_weak: 'Weak',
    strength_fair: 'Fair',
    strength_strong: 'Strong',
    strength_very_strong: 'Very Strong',
    match_ok: '✓ Passwords match',
    match_bad: '✗ Passwords do not match',
  },
  ar: {
    /* ── nav / common ── */
    nav_home: 'الرئيسية',
    nav_login: 'تسجيل الدخول / إنشاء حساب',
    sign_out: 'تسجيل الخروج',
    lang_label: 'AR',
    lang_other: 'EN',

    /* ── home.html ── */
    hero_sub: '☠ حاسبة نسبة الثلث السفلي ☠',
    about_eyebrow: '☠ الطريقة ☠',
    about_title: 'قراءة دقيقة لنسبة الثلث السفلي من وجهك',
    about_lead: 'ارفع صورة، ويقوم المحرك بوضع أربع نقاط مرجعية كلاسيكية — منبت الشعر، جذر الأنف، قاعدة الأنف، وأسفل الذقن — فور تحميلها. اسحب أي نقطة لتعديلها، أضف صورة جانبية ليتم تصحيح ميل الرأس تلقائياً، واحصل على نسبة الثلث السفلي كنسبة مئوية واضحة مقارنةً بالنسبة الكلاسيكية المثالية.',
    feat1_title: 'كشف النقاط بالذكاء الاصطناعي',
    feat1_text: 'توضع أربع نقاط رئيسية على صورتك تلقائياً فور رفعها.',
    feat2_title: 'دقة يدوية',
    feat2_text: 'اسحب أي نقطة لتصحيحها — القرار النهائي للقياس دائماً بيدك.',
    feat3_title: 'تصحيح الميل تلقائياً',
    feat3_text: 'الصورة الجانبية تتيح للمحرك تقويم ميل الرأس قبل قياس أي بكسل.',
    feat4_title: 'نسبتك فوراً',
    feat4_text: 'احصل على نسبة مئوية واضحة، مقارنةً بالنسبة الكلاسيكية المثالية — جاهزة للحفظ.',
    about_cta: '☠ \u00A0 ادخل إلى الأداة',
    ratio_caption: 'النسبة الكلاسيكية المثالية للثلث السفلي',
    hero_cta_text: 'ادخل إلى الأداة',
    scroll_cue_text: 'مرّر للمزيد',

    /* ── login.html ── */
    portal_sub: '☠ بوابة العملاء ☠',
    tab_signin: 'تسجيل الدخول',
    tab_register: 'إنشاء حساب',
    lbl_email: 'البريد الإلكتروني',
    lbl_password: 'كلمة المرور',
    lbl_fullname: 'الاسم الكامل',
    lbl_password_min: 'كلمة المرور (٦ أحرف على الأقل)',
    lbl_confirm_password: 'تأكيد كلمة المرور',
    lbl_new_password: 'كلمة المرور الجديدة (٦ أحرف على الأقل)',
    lbl_confirm_new_password: 'تأكيد كلمة المرور الجديدة',
    forgot_password: 'نسيت كلمة المرور؟',
    btn_signin: '☠ \u00A0 تسجيل الدخول',
    btn_register: '☠ \u00A0 إنشاء حساب',
    btn_reset: '☠ \u00A0 تعيين كلمة المرور',
    or_text: 'أو',
    btn_google: 'المتابعة عبر جوجل',
    placeholder_email: 'your@email.com',
    placeholder_password: '••••••••',
    placeholder_name: 'اسمك',
    please_wait: 'جارٍ التنفيذ...',
    reset_intro_prefix: 'أدخل كلمة مرور جديدة لـ ',

    /* ── login.html dynamic messages ── */
    msg_account_removed: 'تمت إزالة حسابك. الرجاء تسجيل الدخول مجدداً لاستعادة الوصول.',
    msg_auth_required: 'سجّل الدخول أو أنشئ حساباً لفتح الأداة. ☠',
    msg_invalid_email: 'الرجاء إدخال بريد إلكتروني صحيح.',
    msg_enter_password: 'الرجاء إدخال كلمة المرور.',
    msg_enter_name: 'الرجاء إدخال اسمك.',
    msg_password_min: 'يجب ألا تقل كلمة المرور عن ٦ أحرف.',
    msg_passwords_no_match: 'كلمتا المرور غير متطابقتين.',
    msg_account_created: 'تم إنشاء الحساب! جارٍ التحويل...',
    msg_welcome_back: '💀 أهلاً بعودتك!',
    msg_welcome_new: '💀 أهلاً بك في Brand A!',
    msg_welcome_google: '💀 أهلاً بك!',
    msg_forgot_prompt: 'أدخل بريدك الإلكتروني في الحقل أعلاه أولاً، ثم اضغط على "نسيت كلمة المرور؟".',
    msg_sending_reset: 'جارٍ إرسال رسالة إعادة التعيين...',
    msg_reset_sent: '✓ تم إرسال رسالة إعادة تعيين كلمة المرور إلى {email}. تحقق من بريدك (ومجلد الرسائل غير المرغوبة).',
    msg_reset_invalid_link: 'رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية. الرجاء طلب رابط جديد.',
    msg_password_updated: '✓ تم تحديث كلمة المرور. الرجاء تسجيل الدخول بكلمة المرور الجديدة.',
    msg_password_updated_toast: '💀 تم تحديث كلمة المرور!',
    err_user_not_found: 'لا يوجد حساب بهذا البريد الإلكتروني. الرجاء إنشاء حساب.',
    err_wrong_password: 'كلمة المرور غير صحيحة. حاول مجدداً أو أعد تعيينها.',
    err_invalid_credential: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    err_email_in_use: 'هذا البريد الإلكتروني مسجّل بالفعل.',
    err_weak_password: 'يجب ألا تقل كلمة المرور عن ٦ أحرف.',
    err_invalid_email: 'الرجاء إدخال بريد إلكتروني صحيح.',
    err_too_many_requests: 'محاولات كثيرة جداً. الرجاء الانتظار بضع دقائق.',
    err_network: 'خطأ في الشبكة. تحقق من اتصالك.',
    err_generic: 'حدث خطأ ما. الرجاء المحاولة مجدداً.',
    err_reset_user_not_found: 'لا يوجد حساب بهذا البريد الإلكتروني.',
    err_reset_invalid_email: 'الرجاء إدخال بريد إلكتروني صحيح.',
    err_reset_too_many: 'طلبات كثيرة جداً. الرجاء الانتظار قبل المحاولة مجدداً.',
    err_reset_expired: 'انتهت صلاحية رابط إعادة التعيين. الرجاء طلب رابط جديد.',
    err_reset_invalid_code: 'رابط إعادة التعيين غير صالح أو استُخدم بالفعل.',
    err_reset_generic: 'تعذر إعادة تعيين كلمة المرور. الرجاء المحاولة مجدداً.',
    strength_very_weak: 'ضعيفة جداً',
    strength_weak: 'ضعيفة',
    strength_fair: 'مقبولة',
    strength_strong: 'قوية',
    strength_very_strong: 'قوية جداً',
    match_ok: '✓ كلمتا المرور متطابقتان',
    match_bad: '✗ كلمتا المرور غير متطابقتين',
  }
};

export function getLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return (saved === 'ar' || saved === 'en') ? saved : 'en';
}

export function saveLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang === 'ar' ? 'ar' : 'en');
}

export function t(key, lang) {
  const L = dict[lang] || dict.en;
  return (key in L) ? L[key] : (dict.en[key] || key);
}

/* Applies dir/lang attributes + the 'lang-ar' body class used across
   style.css / per-page <style> blocks to switch fonts & RTL rules. */
export function applyDocumentDirection(lang) {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-ar', lang === 'ar');
}

/* Translates every element with data-i18n="key" (textContent) and
   data-i18n-placeholder="key" (placeholder attr) for the given lang. */
export function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'), lang);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'), lang);
  });
}

/* Wires up a standard "intro-lang"-style toggle button: expects
   child spans #langCur / #langOther inside it (same markup as index.html). */
export function wireLangToggle(buttonEl, lang, onChange) {
  const curEl = buttonEl.querySelector('.lang-cur');
  const otherEl = buttonEl.querySelector('.lang-other') || buttonEl.querySelector('#langOther');
  function render(l) {
    if (curEl) curEl.textContent = l.toUpperCase();
    if (otherEl) otherEl.textContent = l === 'en' ? 'AR' : 'EN';
  }
  render(lang);
  buttonEl.addEventListener('click', () => {
    const next = getLang() === 'en' ? 'ar' : 'en';
    saveLang(next);
    render(next);
    onChange(next);
  });
}
