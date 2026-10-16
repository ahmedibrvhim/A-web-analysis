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
    nav_privacy: 'Privacy Policy',
    nav_tool: 'Analysis',
    sign_out: 'Sign out',
    auth_gate_checking: 'Checking your session…',
    lang_label: 'EN',
    lang_other: 'AR',
    brand_name: "Mr Skull",
    brand_tag: "Jaw Rotation",
    counter_label: 'Souls That Have Entered',

    /* ── home.html ── */
    hero_sub: "☠ CCW / CW Jaw Rotation ☠",
    about_eyebrow: '☠ The Method ☠',
    about_title: "Forward Or Downward Growth?",
    about_lead: "Pick male or female, upload one true side photo, and Mr Skull measures how your jaw is rotated: forward (CCW) or downward (CW). Place nine landmarks, check them, then get a growth rating scored against the ideal ranges for your gender.",
    feat1_title: "Nine Landmarks",
    feat1_text: "Tap the photo to place porion, orbitale, ramus, gonion, menton, subnasale, pogonion, glabella and forehead top. The Frankfort plane keeps head tilt from changing the result.",
    feat2_title: "Manual Precision",
    feat2_text: "Move any point with the arrow pad to correct it. The final measurement is always in your hands.",
    feat3_title: "Gender-Specific Scoring",
    feat3_text: "Male and female jaws are scored with different gonial angle and mandibular plane angle ranges.",
    feat4_title: "Every Angle, Instantly",
    feat4_text: "Mandibular plane angle and gonial angle are drawn on your photo, with the ideal range beside each.",
    feat5_title: "PSL Growth Rating",
    feat5_text: "Both angles are mapped to the PSL scale, from Sub-3 to Chad (or Stacy), and the skull reads you the verdict.",
    about_cta: '☠ \u00A0 Enter The Tool',
    ratio_caption: "Ideal Mandibular Plane",
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
    msg_welcome_new: "💀 Welcome to Mr Skull!",
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
    tool_drop_prefix: 'Drag & drop a photo here, or',
    tool_drop_browse: 'browse',
    tool_change_photo: 'Change Photo',
    tool_back: '← Back',
    tool_continue: 'Continue →',
    tv_err_not_image: 'Please choose an image file.',
    tv_err_read: 'Could not read this image.',
    tool_dash_step_fine: 'Fine',
    tool_dash_step_normal: 'Normal',
    tool_dash_step_coarse: 'Coarse',
    archetype_short: 'Prettyboy — soft, neotenous lower third',
    archetype_balanced_short: 'Soft Prettyboy — compact, balanced-pretty',
    archetype_golden: 'Golden Chad — textbook classical balance',
    archetype_elongated: 'Masculine — strong, dominant jaw presence',
    archetype_long: 'Hyper-Masculine — elongated, alpha jawline',
    rating_chad: 'Chad',
    rating_chadlite: 'Chadlite',
    rating_htn: 'HTN',
    rating_mtn: 'MTN',
    rating_ltn: 'LTN',
    rating_sub5: 'Sub5',
    growth_forward: 'Forward Growth',
    growth_neutral: 'Neutral Growth',
    growth_downward: 'Downward Growth',

    /* ── V2 engine: validation gate (Phase 2) ── */

    /* ── V2 engine: growth classification (Phase 7) ── */
    growth_class_forward: 'Forward Growth',
    growth_class_slight_forward: 'Slight Forward Growth',
    growth_class_neutral: 'Neutral Growth',
    growth_class_slight_downward: 'Slight Downward Growth',
    growth_class_downward: 'Downward Growth',

    /* ── V2 engine: explanation panel (Phase 11) ── */
    explain_why_title: 'Why This Score',
    explain_confidence_label: 'Measurement Confidence',
    explain_bullet_vertical_good: 'Lower-third ratio sits close to the classical ideal.',
    explain_bullet_vertical_long: 'Lower third runs long relative to the classical ideal.',
    explain_bullet_vertical_short: 'Lower third runs short relative to the classical ideal.',
    explain_bullet_jaw_strong: 'Gonial angle and jaw taper read as a strong, well-defined jaw.',
    explain_bullet_jaw_soft: 'Jaw structure sits softer than the ideal band.',
    explain_bullet_growth_forward: 'Growth pattern reads forward and horizontal.',
    explain_bullet_growth_downward: 'Growth pattern reads downward and vertical.',
    explain_bullet_chin_strong: 'Chin and lip projection read strong.',
    explain_bullet_chin_weak: 'Chin-to-philtrum ratio sits under the ideal range.',
    explain_bullet_harmony_good: 'Features agree well with each other — proportions are balanced.',
    explain_bullet_harmony_poor: 'Some features pull against each other, reducing harmony.',
    explain_bullet_confidence_low: 'Several landmarks were low-confidence or estimated — treat this score as a rough read.',
    explain_bullet_confidence_high: 'Every landmark was detected or confirmed with high confidence.',

    /* ── Step 2: landmark review ── */
    s2_eyebrow: 'Step 2 · Landmarks',
    s2_step_label: 'Step size',
    s2_progress: '{n} / {total} reviewed',
    s2_confirm: 'Confirm Landmarks →',
    s2_up: 'Move up',
    s2_down: 'Move down',
    s2_left: 'Move left',
    s2_right: 'Move right',

    /* ── gender gate + step 3 ── */
    g_title: 'Select Your Gender',
    g_text: "Ideal proportions and the scoring algorithm differ for men and women. Choose one to unlock the photo upload.",
    g_male: 'Male',
    g_female: 'Female',
    g_locked: 'Select your gender above to enable upload',
    g_err: 'Please select your gender before uploading a photo.',
    s3_eyebrow: 'Step 3 · Analysis',
    s3_restart: 'Start Over',

    /* ── privacy-policy.html ── */
    legal_eyebrow: 'Legal',
    legal_title: 'Privacy Policy',
    legal_updated: 'Last updated: July 20, 2026',
    legal_intro: "Mr Skull respects your privacy. Here's the short version of how we handle your data.",
    legal_h_photos: 'Your Photos',
    legal_p_photos: "Your photos are processed entirely in your own browser — they're never uploaded to or stored on our servers. If you're signed in, only the numeric results (ratios, angles, scores) are saved to your account, never the photos themselves.",
    legal_h_account: 'Account Data',
    legal_p_account: 'If you create an account, we use Google Firebase to store your email, display name, and saved results. We never sell or share this data with third parties for marketing.',
    legal_h_cookies: 'Cookies & Ads',
    legal_p_cookies_a: 'We use local storage for basic preferences like your language choice. This Site may show ads via Google AdSense, which may use cookies to personalize ads based on your browsing. You can opt out anytime at',
    legal_p_cookies_b: 'or',
    legal_p_cookies_c: '.',
    legal_h_thirdparty: 'Third-Party Services',
    legal_p_thirdparty_a: 'We rely on Google Firebase (auth, database, hosting) and Google Fonts. Data these services process on our behalf is governed by',
    legal_p_thirdparty_b: '.',
    legal_h_rights: 'Your Rights',
    legal_p_rights: "You can request access to, or deletion of, your account and saved results at any time — just reach out (contact below). This Site isn't intended for anyone under 16.",
    legal_h_contact: 'Contact',
    legal_p_contact: 'Questions about this policy or your data? Reach us on TikTok:',
  },
  ar: {
    /* ── nav / common ── */
    nav_home: 'الرئيسية',
    nav_login: 'تسجيل الدخول / إنشاء حساب',
    nav_privacy: 'سياسة الخصوصية',
    nav_tool: 'التحليل',
    sign_out: 'تسجيل الخروج',
    auth_gate_checking: 'جارٍ التحقق من جلستك…',
    lang_label: 'AR',
    lang_other: 'EN',
    brand_name: "Mr Skull",
    brand_tag: "دوران الفك",
    counter_label: 'أرواح دخلت الموقع',

    /* ── home.html ── */
    hero_sub: "☠ دوران الفك CCW / CW ☠",
    about_eyebrow: '☠ الطريقة ☠',
    about_title: "نمو أمامي أم نحو الأسفل؟",
    about_lead: "اختر ذكراً أو أنثى، وارفع صورة جانبية حقيقية واحدة، وسيقيس Mr Skull دوران فكك: للأمام (CCW) أم للأسفل (CW). ضع تسع نقاط مرجعية وراجعها، ثم احصل على تقييم نمو مقابل المعدلات المثالية لجنسك.",
    feat1_title: "تسع نقاط مرجعية",
    feat1_text: "اضغط على الصورة لوضع Po وOr وRa وGo وMe وSn وPg وG وTr. مستوى فرانكفورت يمنع ميل الرأس من تغيير النتيجة.",
    feat2_title: "دقة يدوية",
    feat2_text: "حرّك أي نقطة بلوحة الأسهم لتصحيحها. القياس النهائي دائماً بيدك.",
    feat3_title: "تقييم خاص بكل جنس",
    feat3_text: "يُقيَّم فك الرجل وفك المرأة بمعدلات مختلفة لزاوية الجونيال وزاوية المستوى الفكي.",
    feat4_title: "كل زاوية فوراً",
    feat4_text: "تُرسم زاوية المستوى الفكي وزاوية الجونيال على صورتك، ومعهما المدى المثالي.",
    feat5_title: "تقييم النمو PSL",
    feat5_text: "تُحوَّل الزاويتان إلى مقياس PSL من Sub-3 إلى تشاد (أو ستاسي)، ثم تقرأ لك الجمجمة الحكم.",
    about_cta: '☠ \u00A0 ادخل إلى الأداة',
    ratio_caption: "المستوى الفكي المثالي",
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
    msg_welcome_new: "💀 أهلاً بك في Mr Skull!",
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
    tool_drop_prefix: 'اسحب وأفلت صورة هنا، أو',
    tool_drop_browse: 'تصفح',
    tool_change_photo: 'تغيير الصورة',
    tool_back: '→ رجوع',
    tool_continue: 'متابعة ←',
    tv_err_not_image: 'الرجاء اختيار ملف صورة.',
    tv_err_read: 'تعذّرت قراءة هذه الصورة.',
    tool_dash_step_fine: 'دقيق',
    tool_dash_step_normal: 'عادي',
    tool_dash_step_coarse: 'كبير',
    archetype_short: 'بريتي بوي — ثلث سفلي ناعم وشبابي',
    archetype_balanced_short: 'بريتي بوي متوازن — مضغوط ومتوازن بشكل جميل',
    archetype_golden: 'تشاد ذهبي — توازن كلاسيكي مثالي',
    archetype_elongated: 'رجولي — فك قوي ومهيمن',
    archetype_long: 'رجولي فائق — فك ممتد وقوي جداً',
    rating_chad: 'تشاد',
    rating_chadlite: 'تشاد لايت',
    rating_htn: 'إتش تي إن',
    rating_mtn: 'إم تي إن',
    rating_ltn: 'إل تي إن',
    rating_sub5: 'دون الخمسة',
    growth_forward: 'نمو أمامي',
    growth_neutral: 'نمو متوازن',
    growth_downward: 'نمو نازل',

    /* ── محرك الإصدار الثاني: بوابة التحقق (المرحلة ٢) ── */

    /* ── محرك الإصدار الثاني: تصنيف النمو (المرحلة ٧) ── */
    growth_class_forward: 'نمو أمامي',
    growth_class_slight_forward: 'نمو أمامي طفيف',
    growth_class_neutral: 'نمو متوازن',
    growth_class_slight_downward: 'نمو نازل طفيف',
    growth_class_downward: 'نمو نازل',

    /* ── محرك الإصدار الثاني: لوحة الشرح (المرحلة ١١) ── */
    explain_why_title: 'سبب هذه النتيجة',
    explain_confidence_label: 'موثوقية القياس',
    explain_bullet_vertical_good: 'نسبة الثلث السفلي قريبة جداً من المثال الكلاسيكي.',
    explain_bullet_vertical_long: 'الثلث السفلي أطول من المثال الكلاسيكي.',
    explain_bullet_vertical_short: 'الثلث السفلي أقصر من المثال الكلاسيكي.',
    explain_bullet_jaw_strong: 'زاوية الفك وتناسقه يعكسان فكاً قوياً وواضح المعالم.',
    explain_bullet_jaw_soft: 'بنية الفك أنعم من النطاق المثالي.',
    explain_bullet_growth_forward: 'نمط النمو أمامي وأفقي.',
    explain_bullet_growth_downward: 'نمط النمو نازل وعمودي.',
    explain_bullet_chin_strong: 'بروز الذقن والشفة قوي.',
    explain_bullet_chin_weak: 'نسبة الذقن إلى الفلتروم أقل من النطاق المثالي.',
    explain_bullet_harmony_good: 'الملامح متناسقة مع بعضها — التناسب متوازن.',
    explain_bullet_harmony_poor: 'بعض الملامح تتعارض مع بعضها، مما يقلل من الانسجام.',
    explain_bullet_confidence_low: 'عدة نقاط مرجعية كانت منخفضة الموثوقية أو تقديرية — تعامل مع هذه النتيجة كتقدير تقريبي.',
    explain_bullet_confidence_high: 'تم رصد أو تأكيد كل نقطة مرجعية بموثوقية عالية.',

    /* ── الخطوة ٢: مراجعة النقاط ── */
    s2_eyebrow: 'الخطوة ٢ · النقاط المرجعية',
    s2_step_label: 'حجم الخطوة',
    s2_progress: 'تمت مراجعة {n} / {total}',
    s2_confirm: 'تأكيد النقاط ←',
    s2_up: 'تحريك للأعلى',
    s2_down: 'تحريك للأسفل',
    s2_left: 'تحريك لليسار',
    s2_right: 'تحريك لليمين',

    /* ── gender gate + step 3 ── */
    g_title: 'اختر جنسك',
    g_text: "تختلف النسب المثالية وخوارزمية التقييم بين الرجال والنساء. اختر واحداً لتفعيل رفع الصورة.",
    g_male: 'ذكر',
    g_female: 'أنثى',
    g_locked: 'اختر جنسك أعلاه لتفعيل الرفع',
    g_err: 'يرجى اختيار الجنس قبل رفع الصورة.',
    s3_eyebrow: 'الخطوة ٣ · التحليل',
    s3_restart: 'البدء من جديد',

    /* ── privacy-policy.html ── */
    legal_eyebrow: 'قانوني',
    legal_title: 'سياسة الخصوصية',
    legal_updated: 'آخر تحديث: ٢٠ يوليو ٢٠٢٦',
    legal_intro: "يحترم Mr Skull خصوصيتك. إليك النسخة المختصرة لكيفية تعاملنا مع بياناتك.",
    legal_h_photos: 'صورك',
    legal_p_photos: 'تتم معالجة صورك بالكامل داخل متصفحك — لا يتم رفعها أو تخزينها على خوادمنا أبداً. إذا كنت مسجلاً الدخول، يتم حفظ النتائج الرقمية فقط (النسب والزوايا والدرجات) في حسابك، وليس الصور نفسها.',
    legal_h_account: 'بيانات الحساب',
    legal_p_account: 'عند إنشاء حساب، نستخدم Google Firebase لتخزين بريدك الإلكتروني واسمك الظاهر ونتائجك المحفوظة. لا نبيع أو نشارك هذه البيانات مع أي جهة خارجية لأغراض تسويقية.',
    legal_h_cookies: 'ملفات تعريف الارتباط والإعلانات',
    legal_p_cookies_a: 'نستخدم التخزين المحلي للمتصفح لحفظ تفضيلات بسيطة مثل لغتك المختارة. قد يعرض هذا الموقع إعلانات عبر Google AdSense، والتي قد تستخدم ملفات تعريف الارتباط لتخصيص الإعلانات بناءً على تصفحك. يمكنك إلغاء الاشتراك في أي وقت من',
    legal_p_cookies_b: 'أو',
    legal_p_cookies_c: '.',
    legal_h_thirdparty: 'خدمات الطرف الثالث',
    legal_p_thirdparty_a: 'نعتمد على Google Firebase (المصادقة وقاعدة البيانات والاستضافة) وGoogle Fonts. تخضع البيانات التي تعالجها هذه الخدمات نيابة عنا لـ',
    legal_p_thirdparty_b: '.',
    legal_h_rights: 'حقوقك',
    legal_p_rights: 'يمكنك طلب الوصول إلى حسابك ونتائجك المحفوظة أو حذفها في أي وقت — فقط تواصل معنا (التواصل أدناه). هذا الموقع غير موجّه لأي شخص دون سن ١٦.',
    legal_h_contact: 'التواصل',
    legal_p_contact: 'لديك أسئلة حول هذه السياسة أو بياناتك؟ تواصل معنا عبر تيك توك:',
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
