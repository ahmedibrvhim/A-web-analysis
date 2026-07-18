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
    brand_name: 'Lower Third',
    brand_tag: 'Calculator',
    counter_label: 'Souls That Have Entered',

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

    /* ── tool.html ── */
    tool_step_upload_front_title: 'Upload Your Front Photo',
    tool_step_upload_front_text: 'A clear, front-facing, well-lit photo works best. Look straight at the camera with a neutral expression.',
    tool_step_upload_side_title: 'Upload A Side Photo',
    tool_step_upload_side_text: 'Required for lab-grade accuracy. It lets the engine detect head tilt using the Frankfort plane and correct your ratio automatically. Turn your head 90° so your ear is visible.',
    tool_drop_prefix: 'Drag & drop a photo here, or',
    tool_drop_browse: 'browse',
    tool_change_photo: 'Change Photo',
    tool_use_side: 'Continue →',
    tool_back: '← Back',
    tool_continue: 'Continue →',
    tool_analyzing: 'Reading Your Landmarks…',
    tool_step_adjust_title: 'Confirm The Landmarks',
    tool_step_adjust_text: 'Points were placed automatically on both photos. Drag any of them to correct their position — your measurement is only as accurate as these dots. Both Front and Side must be confirmed.',
    tool_pt_tr: 'Tr — Trichion (hairline)',
    tool_pt_n: 'N — Nasion (between brows)',
    tool_pt_sn: 'Sn — Subnasale (nose base)',
    tool_pt_me: 'Me — Menton (chin)',
    tool_pt_tragion: 'Tragion — front of ear',
    tool_pt_orbit: 'Orbitale — lower eye socket',
    tool_view_front: 'Front',
    tool_view_side: 'Side',
    tool_calculate: '☠ \u00A0 Calculate My Ratio',
    tool_step_result_title: 'Your Lower-Third Ratio',
    tool_result_ideal: 'Classical Ideal',
    tool_result_yours: 'Your Ratio',
    tool_result_tilt_corrected: '✓ Tilt-corrected using your side photo',
    tool_result_no_side: 'Add a side photo next time for tilt-corrected accuracy',
    tool_save_result: '☠ \u00A0 Save To My Account',
    tool_saved: '✓ Saved to your account',
    tool_start_over: 'Start Over',
    tool_err_load_model: 'Could not load the detection engine. Check your connection and try again.',
    tool_err_no_face: 'No face detected — try a clearer, front-facing photo, or place the points manually.',
    tool_err_no_side_pts: 'Side landmarks are required — switch to the Side tab and confirm the Tragion and Orbitale points.',
    tool_err_file_type: 'Please upload a photo (JPG, PNG, or HEIC).',
    tool_err_file_size: 'That photo is too large — please use one under 15MB.',
    tool_err_file_decode: "This photo couldn't be opened on this browser. Try a JPG or PNG instead.",
    tool_err_save: 'Could not save your result. Please try again.',
    tool_manual_hint: 'Detection unavailable — place the points manually by clicking on the photo.',
    tool_side_required_badge: 'Required',
    tool_side_instr_text: "Turn your head 90° so your ear is fully visible and the tragion (front of the ear) and lower eye socket aren't blocked by hair.",
    tool_archetype_title: 'Your Archetype',
    tool_rating_title: 'Rating',
    archetype_short: 'Prettyboy — soft, neotenous lower third',
    archetype_balanced_short: 'Soft Prettyboy — compact, balanced-pretty',
    archetype_golden: 'Golden Chad — textbook classical balance',
    archetype_elongated: 'Masculine — strong, dominant jaw presence',
    archetype_long: 'Hyper-Masculine — elongated, alpha jawline',
    rating_chad: 'Chad',
    rating_above_avg: 'Chadlite',
    rating_average: 'Mid',
    rating_below_avg: 'Low Mid',
    rating_sub5: 'Sub5',
    tool_result_philtrum: 'Philtrum Height',
    tool_result_chin: 'Chin Height',
    tool_pt_ls: 'Ls — Labrale Superius (lip top)',
    tool_pt_li: 'Li — Labrale Inferius (lip bottom)',
    tool_guide_title: 'Reference guide — where these points go, per standard anthropometric landmarks',
  },
  ar: {
    /* ── nav / common ── */
    nav_home: 'الرئيسية',
    nav_login: 'تسجيل الدخول / إنشاء حساب',
    sign_out: 'تسجيل الخروج',
    lang_label: 'AR',
    lang_other: 'EN',
    brand_name: 'الثلث السفلي',
    brand_tag: 'حاسبة',
    counter_label: 'أرواح دخلت الموقع',

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

    /* ── tool.html ── */
    tool_step_upload_front_title: 'ارفع صورتك الأمامية',
    tool_step_upload_front_text: 'يفضّل صورة أمامية واضحة وبإضاءة جيدة. انظر مباشرة إلى الكاميرا بتعبير محايد.',
    tool_step_upload_side_title: 'ارفع صورة جانبية',
    tool_step_upload_side_text: 'مطلوبة لدقة احترافية. تتيح للمحرك اكتشاف ميل الرأس باستخدام مستوى فرانكفورت وتصحيح نسبتك تلقائياً. أدر رأسك ٩٠ درجة حتى تظهر أذنك.',
    tool_drop_prefix: 'اسحب وأفلت صورة هنا، أو',
    tool_drop_browse: 'تصفح',
    tool_change_photo: 'تغيير الصورة',
    tool_use_side: 'متابعة ←',
    tool_back: '→ رجوع',
    tool_continue: 'متابعة ←',
    tool_analyzing: 'جارٍ تحديد النقاط المرجعية…',
    tool_step_adjust_title: 'تأكيد النقاط المرجعية',
    tool_step_adjust_text: 'تم وضع النقاط تلقائياً على كلتا الصورتين. اسحب أي نقطة لتصحيح موضعها — دقة القياس تعتمد بالكامل على دقة هذه النقاط. يجب تأكيد الصورتين الأمامية والجانبية.',
    tool_pt_tr: 'Tr — منبت الشعر',
    tool_pt_n: 'N — جذر الأنف',
    tool_pt_sn: 'Sn — قاعدة الأنف',
    tool_pt_me: 'Me — أسفل الذقن',
    tool_pt_tragion: 'Tragion — أمام الأذن',
    tool_pt_orbit: 'Orbitale — أسفل محجر العين',
    tool_view_front: 'أمامية',
    tool_view_side: 'جانبية',
    tool_calculate: '☠ \u00A0 احسب نسبتي',
    tool_step_result_title: 'نسبة الثلث السفلي لديك',
    tool_result_ideal: 'النسبة الكلاسيكية المثالية',
    tool_result_yours: 'نسبتك',
    tool_result_tilt_corrected: '✓ تم تصحيح الميل باستخدام صورتك الجانبية',
    tool_result_no_side: 'أضف صورة جانبية في المرة القادمة لتصحيح الميل بدقة أعلى',
    tool_save_result: '☠ \u00A0 حفظ في حسابي',
    tool_saved: '✓ تم الحفظ في حسابك',
    tool_start_over: 'البدء من جديد',
    tool_err_load_model: 'تعذر تحميل محرك الكشف. تحقق من اتصالك وحاول مجدداً.',
    tool_err_no_face: 'لم يتم العثور على وجه — جرّب صورة أوضح وأمامية، أو ضع النقاط يدوياً.',
    tool_err_no_side_pts: 'النقاط الجانبية مطلوبة — انتقل إلى تبويب الجانبية وأكّد نقطتي Tragion وOrbitale.',
    tool_err_file_type: 'الرجاء رفع صورة (JPG أو PNG أو HEIC).',
    tool_err_file_size: 'حجم الصورة كبير جداً — الرجاء استخدام صورة أقل من ١٥ ميجابايت.',
    tool_err_file_decode: 'تعذر فتح هذه الصورة على هذا المتصفح. جرّب صيغة JPG أو PNG بدلاً منها.',
    tool_err_save: 'تعذر حفظ نتيجتك. الرجاء المحاولة مجدداً.',
    tool_manual_hint: 'الكشف التلقائي غير متاح — ضع النقاط يدوياً بالنقر على الصورة.',
    tool_side_required_badge: 'مطلوبة',
    tool_side_instr_text: 'أدر رأسك ٩٠ درجة حتى تظهر أذنك بالكامل، وتأكد أن نقطة Tragion (أمام الأذن) وأسفل محجر العين غير مغطاتين بالشعر.',
    tool_archetype_title: 'نمط وجهك',
    tool_rating_title: 'التقييم',
    archetype_short: 'بريتي بوي — ثلث سفلي ناعم وشبابي',
    archetype_balanced_short: 'بريتي بوي متوازن — مضغوط ومتوازن بشكل جميل',
    archetype_golden: 'تشاد ذهبي — توازن كلاسيكي مثالي',
    archetype_elongated: 'رجولي — فك قوي ومهيمن',
    archetype_long: 'رجولي فائق — فك ممتد وقوي جداً',
    rating_chad: 'تشاد',
    rating_above_avg: 'تشاد لايت',
    rating_average: 'ميد',
    rating_below_avg: 'دون المتوسط',
    rating_sub5: 'دون الخمسة',
    tool_result_philtrum: 'ارتفاع الفلتروم',
    tool_result_chin: 'ارتفاع الذقن',
    tool_pt_ls: 'Ls — أعلى الشفة العليا',
    tool_pt_li: 'Li — أسفل الشفة السفلى',
    tool_guide_title: 'دليل مرجعي — أين توضع هذه النقاط وفق معايير القياسات التشريحية القياسية',
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
