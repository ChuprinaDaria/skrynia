export type Language = 'UA' | 'EN' | 'DE' | 'PL' | 'SE' | 'NO' | 'DK' | 'FR';

export interface Translations {
  nav: {
    collections: string;
    'constructor': string;
    about: string;
    contact: string;
    login?: string;
    account?: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    tagline: string;
  };
  collections: {
    title: string;
    subtitle: string;
    slavic: string;
    slavicTagline: string;
    viking: string;
    vikingTagline: string;
    celtic: string;
    celticTagline: string;
    viewAll: string;
  };
  footer: {
    navigation: string;
    contact: string;
    languages: string;
    collections: string;
    about: string;
    shipping: string;
    brandDescription: string;
    location: string;
    copyright: string;
    acceptPayments: string;
  };
  common: {
    loading: string;
    error: string;
    handmade: string;
    items: string;
  };
  home: {
    featuredProducts: {
      title: string;
      subtitle: string;
      viewAll: string;
    };
    about: {
      title: string;
      paragraph1: string;
      paragraph2: string;
      paragraph3: string;
      learnMore: string;
      quality: {
        title: string;
        description: string;
      };
      handmade: {
        title: string;
        description: string;
      };
      freeShipping: {
        title: string;
        description: string;
      };
    };
    bonusSystem: {
      title: string;
      subtitle: string;
      description: string;
      levels: {
        human: {
          name: string;
          description: string;
          bonus: string;
        };
        elf: {
          name: string;
          description: string;
          bonus: string;
          requirement: string;
        };
        dwarf: {
          name: string;
          description: string;
          bonus: string;
          requirement: string;
        };
      };
      benefits: {
        title: string;
        earn: string;
        use: string;
        track: string;
      };
      cta: string;
      register: string;
    };
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    subscribe: string;
    subscribing: string;
    success: {
      title: string;
      message: string;
    };
    privacy: string;
  };
  about: {
    title: string;
    subtitle: string;
    history: {
      title: string;
      content: string;
    };
    mission: {
      title: string;
      content: string;
    };
    quality: {
      title: string;
      intro: string;
      materials: {
        coral: string;
        silver: string;
        amber: string;
        gemstone: string;
      };
      conclusion: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
    };
    otherWays: string;
    location: string;
  };
  shipping: {
    title: string;
    subtitle: string;
    delivery: {
      title: string;
      intro: string;
      free: string;
      standard: string;
      express: string;
    };
    payment: {
      title: string;
      intro: string;
      cards: string;
      paypal: string;
      transfer: string;
      secure: string;
    };
    returns: {
      title: string;
      intro: string;
      days: string;
      condition: string;
      refund: string;
    };
  };
  collectionsPage: {
    title: string;
    subtitle: string;
    found: string;
    items: string;
    filters: string;
    sort: {
      newest: string;
      priceLow: string;
      priceHigh: string;
      name: string;
    };
    noResults: {
      title: string;
      message: string;
    };
  };
  filters: {
    title: string;
    bySymbol: string;
    byMaterial: string;
    byCulture: string;
    price: string;
    clear: string;
    symbols: {
      love: string;
      protection: string;
      wealth: string;
      wisdom: string;
    };
    materials: {
      coral: string;
      silver: string;
      amber: string;
      gemstone: string;
    };
    cultures: {
      all: string;
      slavic: string;
      viking: string;
      celtic: string;
    };
  };
    product: {
      categories: {
        slavic: string;
        viking: string;
        celtic: string;
      };
      breadcrumb: {
        home: string;
        collections: string;
      };
      collection: string;
      materials: string;
      quantity: string;
      addToCart: string;
      legend: string;
      specifications: string;
      related: string;
      quality: string;
      freeShipping: string;
      viewingNow: string;
      valueProps: {
        giftWrap: string;
        warranty: string;
        tracking: string;
        handmadeTooltipLabel: string;
        handmadeTooltip: string;
      };
      madeToOrder?: {
        title: string;
        duration: string;
        orderButton: string;
        formTitle: string;
        name: string;
        email: string;
        phone: string;
        customText: string;
        customTextPlaceholder: string;
        description: string;
        descriptionPlaceholder: string;
        submit: string;
        submitting: string;
        cancel: string;
        success: string;
      };
    };
  cart: {
    title: string;
    empty: {
      title: string;
      message: string;
      continue: string;
    };
    subtotal: string;
    shipping: string;
    free: string;
    total: string;
    checkout: string;
    continueShopping: string;
    remove: string;
    addMoreForFreeShipping: string;
    securePayment: string;
    deliveryDays: string;
    progressiveDiscount: string;
    discount: string;
    subtotalBeforeDiscount: string;
    addMoreForDiscount: string;
    authReminder: {
      title: string;
      message: string;
      login: string;
      register: string;
      benefits: string;
      bonusPoints: string;
      trackOrders: string;
      saveAddresses: string;
    };
  };
  legal: {
    terms: string;
    privacy: string;
    withdrawal: string;
    acceptTerms: string;
    acceptPrivacy: string;
    termsTitle: string;
    privacyTitle: string;
    withdrawalTitle: string;
  };
  blog: {
    title: string;
    subtitle: string;
    loading: string;
    noPosts: string;
    goToBlog: string;
    viewAllPosts: string;
    readMore: string;
  };
  constructor: {
    title: string;
    beads: string;
    stone: string;
    hardware: string;
    extra: string;
    loading: string;
    noBeads: string;
    visualEditor: string;
    clasp: string;
    threads: string;
    thread: string;
    length: string;
    addThread: string;
    deleteThread: string;
    clear: string;
    send: string;
    save: string;
    home: string;
    quoteRequest: string;
    settings: string;
    threadCount: string;
    maxThreads: string;
    activeThread: string;
    threadLength: string;
    instruction: string;
    instruction1: string;
    instruction2: string;
    instruction3: string;
    instruction4: string;
    instruction5: string;
    saveSuccess: string;
    saveError: string;
    loginRequired: string;
    addBeadsFirst: string;
    selectClasp: string;
    threadOf: string;
    beadsOnThread: string;
  };
  auth: {
    login: string;
    loginTitle: string;
    loginSubtitle: string;
    email: string;
    password: string;
    loginButton: string;
    loggingIn: string;
    noAccount: string;
    registerLink: string;
    errors: {
      incorrectCredentials: string;
      accountNotActivated: string;
      emailNotVerified: string;
      networkError: string;
      defaultError: string;
    };
  };
  register: {
    title: string;
    subtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    passwordHint: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    submit: string;
    submitting: string;
    success: {
      title: string;
      message: string;
      redirecting: string;
    };
    hasAccount: string;
    loginLink: string;
    agreement: string;
    termsLink: string;
    privacyLink: string;
    errors: {
      passwordsMismatch: string;
      passwordTooShort: string;
      defaultError: string;
      serverError: string;
    };
  };
  checkout: {
    title: string;
    contactInfo: string;
    email: string;
    fullName: string;
    phone: string;
    delivery: string;
    country: string;
    countries: {
      AT: string;
      BE: string;
      BG: string;
      HR: string;
      CY: string;
      CZ: string;
      DK: string;
      EE: string;
      FI: string;
      FR: string;
      DE: string;
      GR: string;
      HU: string;
      IE: string;
      IT: string;
      LV: string;
      LT: string;
      LU: string;
      MT: string;
      NL: string;
      PL: string;
      PT: string;
      RO: string;
      SK: string;
      SI: string;
      ES: string;
      SE: string;
      UA: string;
      GB: string;
      US: string;
    };
    deliveryMethod: string;
    inpostLabel: string;
    inpostDescription: string;
    novaposhtaLabel: string;
    novaposhtaDescription: string;
    pocztaLabel: string;
    pocztaDescription: string;
    courierLabel: string;
    courierDescription: string;
    courierDescriptionUA: string;
    courierDescriptionOther: string;
    paczkomat: string;
    paczkomatPlaceholder: string;
    paczkomatHint: string;
    selectFromMap: string;
    changePoint: string;
    cancel: string;
    novaposhtaOffice: string;
    novaposhtaOfficePlaceholder: string;
    novaposhtaOfficeHint: string;
    address: string;
    addressPlaceholder: string;
    addressPlaceholderUA: string;
    address2: string;
    address2Placeholder: string;
    address2PlaceholderUA: string;
    city: string;
    cityPlaceholder: string;
    cityPlaceholderUA: string;
    postalCode: string;
    postalCodePlaceholder: string;
    postalCodePlaceholderUA: string;
    billingSameAsShipping: string;
    billingAddress: string;
    paymentMethod: string;
    paymentStripe: string;
    paymentP24: string;
    paymentBLIK: string;
    paymentBankTransfer: string;
    orderNotes: string;
    orderNotesPlaceholder: string;
    orderSummary: string;
    subtotal: string;
    shipping: string;
    total: string;
    submit: string;
    submitting: string;
    backToCart: string;
    errors: {
      defaultError: string;
    };
  };
  orderSuccess: {
    loading: string;
    title: string;
    orderNumber: string;
    thankYou: string;
    status: string;
    paymentMethod: string;
    total: string;
    backToHome: string;
    viewCollections: string;
  };
  adminOrders: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allStatuses: string;
    statusPending: string;
    statusPaid: string;
    statusShipped: string;
    statusDelivered: string;
    statusCancelled: string;
    loading: string;
    noOrders: string;
    tableNumber: string;
    tableClient: string;
    tableAmount: string;
    tableStatus: string;
    tablePayment: string;
    tableDate: string;
    tableActions: string;
    edit: string;
    totalOrders: string;
    totalAmount: string;
    pending: string;
    paid: string;
    orderDetails: string;
    customerInfo: string;
    orderInfo: string;
    subtotal: string;
    shipping: string;
    total: string;
    updateStatus: string;
    orderStatus: string;
    paymentStatus: string;
    paymentCompleted: string;
    paymentFailed: string;
    paymentRefunded: string;
    close: string;
  };
  account: {
    title: string;
    subtitle: string;
    logout: string;
    loading: string;
    errorLoading: string;
    failedToLoad: string;
    shippingAddress: string;
    inpostPaczkomat: string;
    loyaltyStatus: string;
    bonusPoints: string;
    bonusPointsLabel: string;
    toStatus: string;
    remaining: string;
    totalOrders: string;
    inProcessing: string;
    myOrders: string;
    noOrders: string;
    goToCatalog: string;
    orderNumber: string;
    item: string;
    items: string;
    tracking: string;
    openOnCarrierSite: string;
    trackingHistory: string;
    status: {
      completed: string;
      shipped: string;
      inProcessing: string;
      paid: string;
      notPaid: string;
    };
    loyaltyStatuses: {
      human: string;
      elf: string;
      dwarf: string;
    };
  };
}

const translations: Record<Language, Translations> = {
  UA: {
    nav: {
      collections: 'Колекції',
      constructor: 'Конструктор Намиста',
      about: 'Про нас',
      contact: 'Контакт',
    },
    hero: {
      title: 'Rune box',
      subtitle: 'Автентичні Скарби Спадщини',
      cta: 'Відкрити Колекцію',
      tagline: 'Кожна прикраса — портал до історії наших предків',
    },
    collections: {
      title: 'Колекції Спадщини',
      subtitle: 'Три культури. Одна спадщина. Безліч історій.',
      slavic: 'Слов\'янські',
      slavicTagline: 'Символи сили та захисту',
      viking: 'Вікінгські',
      vikingTagline: 'Відвага і доля воїнів',
      celtic: 'Кельтські',
      celticTagline: 'Триєдність і вічність',
      viewAll: 'Переглянути всі колекції',
    },
    footer: {
      navigation: 'Навігація',
      contact: 'Контакт',
      languages: 'Мови',
      collections: 'Колекції',
      about: 'Про нас',
      shipping: 'Доставка',
      brandDescription: 'Автентичні прикраси ручної роботи',
      location: 'Польща, ЄС',
      copyright: 'Rune box. Всі права захищені.',
      acceptPayments: 'Приймаємо:',
    },
    common: {
      loading: 'Завантаження...',
      error: 'Помилка',
      handmade: 'Ручна робота',
      items: 'товари',
    },
    home: {
      featuredProducts: {
        title: 'Обрані Скарби',
        subtitle: 'Унікальні прикраси, створені з душею та натхненням традиціями',
        viewAll: 'Переглянути всі прикраси',
      },
      about: {
        title: 'Про Rune Box',
        paragraph1: 'Кожна прикраса — це не лише аксесуар, а портал до історії наших предків.',
        paragraph2: 'Ми створюємо автентичні вироби за справжніми археологічними зразками, використовуючи давні техніки та натуральні матеріали.',
        paragraph3: 'Натуральний корал, срібло 925 проби, бурштин — кожен елемент обирається з любов\'ю та повагою до традицій слов\'янської, вікінгської та кельтської культур.',
        learnMore: 'Дізнатися більше',
        quality: {
          title: 'Гарантія якості',
          description: 'Кожна прикраса виготовлена з натуральних матеріалів',
        },
        handmade: {
          title: 'Ручна робота',
          description: 'Створюємо за старовинними техніками',
        },
        freeShipping: {
          title: 'Доставка',
          description: 'По всьому Європейському Союзу',
        },
      },
      bonusSystem: {
        title: 'Бонусна Система',
        subtitle: 'Отримуйте бонуси з кожної покупки',
        description: 'Зареєструйтеся та отримуйте бонусні бали з кожної покупки. Використовуйте їх для оплати до 20% вартості товарів.',
        levels: {
          human: {
            name: 'Людина',
            description: 'Початковий статус',
            bonus: '1% бонусу з кожної покупки',
          },
          elf: {
            name: 'Ельф',
            description: 'Після покупок на 1000+ PLN',
            bonus: '2% бонусу з кожної покупки',
            requirement: 'Потрібно: 1000 PLN',
          },
          dwarf: {
            name: 'Гном',
            description: 'Після покупок на 5000+ PLN',
            bonus: '3% бонусу з кожної покупки',
            requirement: 'Потрібно: 5000 PLN',
          },
        },
        benefits: {
          title: 'Переваги реєстрації',
          earn: 'Отримуйте бонуси з кожної покупки',
          use: 'Оплачуйте до 20% товарів бонусами',
          track: 'Відстежуйте статус замовлень',
        },
        cta: 'Зареєструватися зараз',
        register: 'Зареєструватися',
      },
    },
    newsletter: {
      title: 'Отримуйте Магічні Пропозиції',
      subtitle: 'Підпишіться на розсилку та дізнавайтеся першими про нові колекції та ексклюзивні знижки',
      placeholder: 'Ваш email',
      subscribe: 'Підписатися',
      subscribing: 'Зачекайте...',
      success: {
        title: 'Дякуємо за підписку!',
        message: 'Перевірте свою пошту для підтвердження',
      },
      privacy: 'Ми поважаємо вашу конфіденційність. Відписатися можна будь-коли.',
    },
    about: {
      title: 'Про Rune Box',
      subtitle: 'Автентичні прикраси ручної роботи з душею та історією',
      history: {
        title: 'Наша Історія',
        content: 'Кожна прикраса в нашій колекції — це не просто аксесуар, а портал до історії наших предків. Ми створюємо автентичні вироби за справжніми археологічними зразками, використовуючи давні техніки та натуральні матеріали.',
      },
      mission: {
        title: 'Наша Місія',
        content: 'Зберегти та передати красу слов\'янської, вікінгської та кельтської культур через унікальні вироби ручної роботи. Кожна прикраса несе в собі символіку, силу та мудрість древніх традицій.',
      },
      quality: {
        title: 'Якість та Автентичність',
        intro: 'Ми використовуємо тільки натуральні матеріали:',
        materials: {
          coral: 'Натуральний корал із Середземномор\'я',
          silver: 'Срібло 925 проби',
          amber: 'Бурштин із Балтики',
          gemstone: 'Натуральне каміння',
        },
        conclusion: 'Кожен виріб створюється вручну з дотриманням старовинних технік та з повагою до традицій наших предків.',
      },
    },
    contact: {
      title: 'Контакт',
      subtitle: 'Маєте питання? Ми завжди раді відповісти',
      form: {
        name: 'Ім\'я',
        namePlaceholder: 'Ваше ім\'я',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        subject: 'Тема',
        subjectPlaceholder: 'Тема повідомлення',
        message: 'Повідомлення',
        messagePlaceholder: 'Ваше повідомлення...',
        submit: 'Надіслати',
      },
      otherWays: 'Інші способи зв\'язку',
      location: 'Польща, Європейський Союз',
    },
    shipping: {
      title: 'Доставка та Оплата',
      subtitle: 'Інформація про доставку та способи оплати',
      delivery: {
        title: 'Доставка',
        intro: 'Ми відправляємо замовлення по всьому Європейському Союзу через надійні кур\'єрські служби.',
        free: 'Безкоштовна доставка при замовленні від 1000 zł',
        standard: 'Стандартна доставка: 50 zł (3-5 робочих днів)',
        express: 'Експрес доставка: 100 zł (1-2 робочі дні)',
      },
      payment: {
        title: 'Способи оплати',
        intro: 'Ми приймаємо наступні способи оплати:',
        cards: 'Кредитні/дебетові картки (Visa, Mastercard)',
        paypal: 'PayPal',
        transfer: 'Банківський переказ',
        secure: 'Усі платежі захищені SSL-шифруванням',
      },
      returns: {
        title: 'Повернення',
        intro: 'Ми хочемо, щоб ви були задоволені своєю покупкою. Якщо з якоїсь причини ви не задоволені, ви можете повернути товар протягом 14 днів.',
        days: '14 днів на повернення',
        condition: 'Товар має бути в оригінальному стані',
        refund: 'Повне відшкодування коштів',
      },
    },
    collectionsPage: {
      title: 'Колекції Прикрас',
      subtitle: 'Унікальні вироби ручної роботи, що поєднують красу та символіку древніх культур',
      found: 'Знайдено',
      items: 'виробів',
      filters: 'Фільтри',
      sort: {
        newest: 'Найновіші',
        priceLow: 'Ціна: низька → висока',
        priceHigh: 'Ціна: висока → низька',
        name: 'За алфавітом',
      },
      noResults: {
        title: 'Нічого не знайдено',
        message: 'Спробуйте змінити фільтри для перегляду виробів',
      },
    },
    filters: {
      title: 'Фільтри',
      bySymbol: 'За символом',
      byMaterial: 'За матеріалом',
      byCulture: 'За культурою',
      price: 'Ціна (zł)',
      clear: 'Очистити фільтри',
      symbols: {
        love: 'Любов',
        protection: 'Захист',
        wealth: 'Багатство',
        wisdom: 'Мудрість',
      },
      materials: {
        coral: 'Корал',
        silver: 'Срібло',
        amber: 'Бурштин',
        gemstone: 'Дорогоцінне каміння',
      },
      cultures: {
        all: 'Всі',
        slavic: 'Слов\'янські',
        viking: 'Вікінгські',
        celtic: 'Кельтські',
      },
    },
    product: {
      categories: {
        slavic: 'Слов\'янські',
        viking: 'Вікінгські',
        celtic: 'Кельтські',
      },
      breadcrumb: {
        home: 'Головна',
        collections: 'Колекції',
      },
      collection: 'колекція',
      materials: 'Матеріали',
      quantity: 'Кількість:',
      addToCart: 'Додати до кошика',
      legend: 'Легенда',
      specifications: 'Специфікації',
      related: 'Схожі Вироби',
      quality: 'Гарантія якості',
      freeShipping: 'Безкоштовна доставка в ЄС (3-5 днів)',
      viewingNow: 'людей дивляться зараз',
      valueProps: {
        giftWrap: 'Безкоштовне подарункове пакування до кожного замовлення',
        warranty: 'Гарантія оригінальності та ручної роботи',
        tracking: 'Легкий трекінг кожного етапу доставки',
        handmadeTooltipLabel: 'Про матеріали',
        handmadeTooltip: 'Натуральні матеріали: корал, срібло 925 та інше. Кожен виріб збирається вручну.',
      },
      madeToOrder: {
        title: 'Під замовлення',
        duration: 'Строк виготовлення',
        orderButton: 'Замовити під замовлення',
        orderWithPayment: 'Замовити з оплатою 50%',
        depositTitle: 'Передоплата',
        depositDescription: 'Оплата 50% від вартості при замовленні, решта - при готовності',
        formTitle: 'Форма замовлення',
        name: 'Ім\'я',
        email: 'Email',
        phone: 'Телефон',
        customText: 'Текст для нанесення (якщо потрібно)',
        customTextPlaceholder: 'Введіть текст, який хочете додати на прикрасу...',
        description: 'Опис / Коментар',
        descriptionPlaceholder: 'Опишіть свої побажання щодо виготовлення...',
        submit: 'Відправити замовлення',
        submitting: 'Відправка...',
        cancel: 'Скасувати',
        success: 'Ваше замовлення прийнято! Ми зв\'яжемося з вами найближчим часом.',
      },
    },
    cart: {
      title: 'Кошик',
      empty: {
        title: 'Кошик порожній',
        message: 'Додайте прикраси, щоб продовжити покупки',
        continue: 'Продовжити покупки',
      },
      subtotal: 'Проміжний підсумок',
      shipping: 'Доставка',
      free: 'Безкоштовно',
      total: 'Разом',
      checkout: 'Перейти до оплати',
      continueShopping: 'Продовжити покупки',
      remove: 'Видалити',
      addMoreForFreeShipping: 'Додайте ще {amount} zł для безкоштовної доставки',
      securePayment: 'Безпечна оплата',
      deliveryDays: 'Доставка 3-5 днів',
      progressiveDiscount: 'Прогресивна знижка',
      discount: 'Знижка',
      subtotalBeforeDiscount: 'Сума до знижки',
      addMoreForDiscount: 'Додай ще 1 товар і отримай -10%!',
      authReminder: {
        title: 'Зарєєструйтеся або увійдіть',
        message: 'Зарєєструйтеся, щоб отримувати бонуси з кожної покупки та відстежувати замовлення',
        login: 'Увійти',
        register: 'Зареєструватися',
        benefits: 'Переваги реєстрації',
        bonusPoints: 'Нараховуйте бонуси з кожної покупки',
        trackOrders: 'Відстежуйте статус замовлень',
        saveAddresses: 'Зберігайте адреси доставки',
      },
    },
    legal: {
      terms: 'Регламент',
      privacy: 'Політика конфіденційності',
      withdrawal: 'Форма відступу',
      acceptTerms: 'Я приймаю Регламент магазину',
      acceptPrivacy: 'Я приймаю Політику конфіденційності',
      termsTitle: 'Регламент інтернет-магазину RuneBox',
      privacyTitle: 'Політика конфіденційності',
      withdrawalTitle: 'Форма відступу від договору',
    },
    blog: {
      title: 'Блог Rune box',
      subtitle: 'Дізнайтеся більше про традиції, символи та майстерність етнічних прикрас',
      loading: 'Завантаження статей...',
      noPosts: 'Статті блогу з\'являться найближчим часом',
      goToBlog: 'Перейти до блогу',
      viewAllPosts: 'Всі Статті Блогу',
      readMore: 'Читати далі',
    },
    constructor: {
      title: 'Конструктор Намиста',
      beads: 'Бусини',
      stone: 'Камінь',
      hardware: 'Фурнітура',
      extra: 'Додатково',
      loading: 'Завантаження...',
      noBeads: 'Бусини не знайдено',
      visualEditor: 'Візуальний Редактор',
      clasp: 'Застібка',
      threads: 'Ниті',
      thread: 'Нить',
      length: 'Довжина',
      addThread: 'Додати нить',
      deleteThread: 'Видалити нить',
      clear: 'Очистити',
      send: 'Відправити',
      save: 'Зберегти',
      home: 'Головна',
      quoteRequest: 'Запит на Прорахунок',
      settings: 'Налаштування',
      threadCount: 'Кількість ниток',
      maxThreads: 'Максимум: 5 ниток',
      activeThread: 'Активна нитка',
      threadLength: 'Довжина нитки',
      instruction: 'Інструкція:',
      instruction1: 'Клацніть на бусину зліва, щоб додати її',
      instruction2: 'Використовуйте Zoom для приближення',
      instruction3: 'Клацніть на бусину та натисніть Rotate',
      instruction4: 'Оберіть застібку внизу панелі',
      instruction5: 'Збережіть або надішліть запит',
      saveSuccess: 'Конфігурацію збережено!',
      saveError: 'Помилка збереження. Перевірте авторизацію.',
      loginRequired: 'Будь ласка, увійдіть в систему для збереження конфігурації',
      addBeadsFirst: 'Додайте бусини до намиста перед відправкою запиту!',
      selectClasp: 'Будь ласка, виберіть застібку!',
      threadOf: 'з',
      beadsOnThread: 'на нитці',
    },
    auth: {
      login: 'Увійти',
      loginTitle: 'Вхід',
      loginSubtitle: 'Увійдіть до свого акаунту',
      email: 'Email',
      password: 'Пароль',
      loginButton: 'Увійти',
      loggingIn: 'Вхід...',
      noAccount: 'Немає акаунту?',
      registerLink: 'Зареєструватися',
      errors: {
        incorrectCredentials: 'Невірний email або пароль',
        accountNotActivated: 'Акаунт не активовано. Будь ласка, підтвердіть свою електронну пошту.',
        emailNotVerified: 'Електронну пошту не підтверджено. Будь ласка, перевірте свою електронну пошту для посилання підтвердження.',
        networkError: 'Не вдалося підключитися до сервера',
        defaultError: 'Помилка авторизації',
      },
    },
    register: {
      title: 'Реєстрація',
      subtitle: 'Створіть акаунт для отримання бонусів та відстеження замовлень',
      fullName: 'Ім\'я та прізвище',
      fullNamePlaceholder: 'Іван Іванов',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      password: 'Пароль',
      passwordPlaceholder: 'Мінімум 6 символів',
      passwordHint: 'Мінімум 6 символів',
      confirmPassword: 'Підтвердження пароля',
      confirmPasswordPlaceholder: 'Повторіть пароль',
      submit: 'Зареєструватися',
      submitting: 'Реєстрація...',
      success: {
        title: 'Реєстрація успішна!',
        message: 'Ми надіслали лист для підтвердження email на адресу',
        redirecting: 'Перенаправлення на сторінку входу...',
      },
      hasAccount: 'Вже маєте акаунт?',
      loginLink: 'Увійти',
      agreement: 'Реєструючись, ви погоджуєтесь з нашими',
      termsLink: 'умовами використання',
      privacyLink: 'політикою конфіденційності',
      errors: {
        passwordsMismatch: 'Паролі не співпадають',
        passwordTooShort: 'Пароль повинен містити мінімум 6 символів',
        defaultError: 'Помилка реєстрації',
        serverError: 'Помилка сервера. Будь ласка, спробуйте пізніше або зв\'яжіться з підтримкою.',
      },
    },
    checkout: {
      title: 'Оформлення замовлення',
      contactInfo: 'Контактна інформація',
      email: 'Email',
      fullName: 'Ім\'я та прізвище',
      phone: 'Телефон',
      delivery: 'Доставка',
      country: 'Країна',
      countries: {
        AT: 'Австрія',
        BE: 'Бельгія',
        BG: 'Болгарія',
        HR: 'Хорватія',
        CY: 'Кіпр',
        CZ: 'Чехія',
        DK: 'Данія',
        EE: 'Естонія',
        FI: 'Фінляндія',
        FR: 'Франція',
        DE: 'Німеччина',
        GR: 'Греція',
        HU: 'Угорщина',
        IE: 'Ірландія',
        IT: 'Італія',
        LV: 'Латвія',
        LT: 'Литва',
        LU: 'Люксембург',
        MT: 'Мальта',
        NL: 'Нідерланди',
        PL: 'Польща',
        PT: 'Португалія',
        RO: 'Румунія',
        SK: 'Словаччина',
        SI: 'Словенія',
        ES: 'Іспанія',
        SE: 'Швеція',
        UA: 'Україна',
        GB: 'Великобританія',
        US: 'США',
      },
      deliveryMethod: 'Спосіб доставки',
      inpostLabel: 'InPost Paczkomat',
      inpostDescription: 'Odbiór z paczkomatu',
      novaposhtaLabel: 'Нова Пошта',
      novaposhtaDescription: 'Відділення Нової Пошти',
      pocztaLabel: 'Poczta Polska',
      pocztaDescription: 'Dostawa do domu',
      courierLabel: 'Кур\'єр',
      courierDescription: 'Dostawa kurierem',
      courierDescriptionUA: 'Кур\'єрська доставка',
      courierDescriptionOther: 'Courier delivery',
      paczkomat: 'Paczkomat',
      paczkomatPlaceholder: 'Wpisz kod paczkomatu lub adres (np. WAW01M)',
      paczkomatHint: '💡 W przyszłości będziesz mógł wybrać paczkomat z mapy. Na razie wpisz kod paczkomatu ręcznie.',
      selectFromMap: 'Вибрати з карти',
      changePoint: 'Змінити',
      cancel: 'Скасувати',
      novaposhtaOffice: 'Відділення',
      novaposhtaOfficePlaceholder: 'Введіть номер відділення (напр. Відділення №1)',
      novaposhtaOfficeHint: '💡 Незабаром ви зможете обрати відділення з карти. Поки що введіть адресу відділення вручну.',
      address: 'Adres',
      addressPlaceholder: 'ul. Główna 1',
      addressPlaceholderUA: 'вул. Хрещатик, 1',
      address2: 'Adres (dodatkowy)',
      address2Placeholder: 'Mieszkanie, biuro',
      address2PlaceholderUA: 'Квартира, офіс',
      city: 'Miasto',
      cityPlaceholder: 'Warszawa',
      cityPlaceholderUA: 'Київ',
      postalCode: 'Kod pocztowy',
      postalCodePlaceholder: '00-001',
      postalCodePlaceholderUA: '01001',
      billingSameAsShipping: 'Адреса оплати така ж, як адреса доставки',
      billingAddress: 'Адреса оплати',
      paymentMethod: 'Спосіб оплати',
      paymentStripe: 'Stripe (Картка)',
      paymentP24: 'Przelewy24',
      paymentBLIK: 'BLIK',
      paymentBankTransfer: 'Банківський переказ',
      orderNotes: 'Примітки до замовлення',
      orderNotesPlaceholder: 'Додаткові побажання або інформація...',
      orderSummary: 'Ваше замовлення',
      subtotal: 'Підсумок',
      shipping: 'Доставка',
      total: 'Всього',
      submit: 'Оформити замовлення',
      submitting: 'Обробка...',
      backToCart: '← Повернутися до кошика',
      errors: {
        defaultError: 'Помилка оформлення замовлення',
      },
    },
    orderSuccess: {
      loading: 'Завантаження...',
      title: 'Замовлення прийнято!',
      orderNumber: 'Номер замовлення',
      thankYou: 'Дякуємо за ваше замовлення! Ми надіслали підтвердження на вашу електронну пошту.',
      status: 'Статус',
      paymentMethod: 'Спосіб оплати',
      total: 'Всього',
      backToHome: 'Повернутися на головну',
      viewCollections: 'Переглянути колекції',
    },
    adminOrders: {
      title: 'Замовлення',
      subtitle: 'Управління всіма замовленнями',
      searchPlaceholder: 'Пошук за номером, ім\'ям або email...',
      allStatuses: 'Всі статуси',
      statusPending: 'Очікує',
      statusPaid: 'Оплачено',
      statusShipped: 'Відправлено',
      statusDelivered: 'Доставлено',
      statusCancelled: 'Скасовано',
      loading: 'Завантаження...',
      noOrders: 'Замовлення не знайдено.',
      tableNumber: 'Номер',
      tableClient: 'Клієнт',
      tableAmount: 'Сума',
      tableStatus: 'Статус',
      tablePayment: 'Оплата',
      tableDate: 'Дата',
      tableActions: 'Дії',
      edit: 'Редагувати',
      totalOrders: 'Всього замовлень',
      totalAmount: 'Загальна сума',
      pending: 'Очікують',
      paid: 'Оплачено',
      orderDetails: 'Замовлення',
      customerInfo: 'Інформація про клієнта',
      orderInfo: 'Деталі замовлення',
      subtotal: 'Підсумок',
      shipping: 'Доставка',
      total: 'Всього',
      updateStatus: 'Оновити статус',
      orderStatus: 'Статус замовлення',
      paymentStatus: 'Статус оплати',
      paymentCompleted: 'Оплачено',
      paymentFailed: 'Помилка',
      paymentRefunded: 'Повернено',
      close: 'Закрити',
    },
    account: {
      title: 'Особистий кабінет',
      subtitle: 'Керуйте своїм профілем та замовленнями',
      logout: 'Вийти',
      loading: 'Завантаження...',
      errorLoading: 'Помилка завантаження профілю',
      failedToLoad: 'Не вдалося завантажити профіль',
      shippingAddress: 'Адреса доставки',
      inpostPaczkomat: 'InPost Paczkomat:',
      loyaltyStatus: 'Статус лояльності:',
      bonusPoints: 'балів',
      bonusPointsLabel: 'Бонусні бали',
      toStatus: 'До статусу',
      remaining: 'Залишилось:',
      totalOrders: 'Всього замовлень',
      inProcessing: 'В обробці',
      myOrders: 'Мої замовлення',
      noOrders: 'У вас поки немає замовлень',
      goToCatalog: 'Перейти до каталогу',
      orderNumber: 'Замовлення #',
      item: 'товар',
      items: 'товарів',
      tracking: 'Відстеження:',
      openOnCarrierSite: 'Відкрити на сайті перевізника',
      trackingHistory: 'Історія відстеження:',
      status: {
        completed: 'Завершено',
        shipped: 'Відправлено',
        inProcessing: 'В обробці',
        paid: 'Оплачено',
        notPaid: 'Не оплачено',
      },
      loyaltyStatuses: {
        human: 'Людина',
        elf: 'Ельф',
        dwarf: 'Гном/Дворф',
      },
    },
  },
  EN: {
    nav: {
      collections: 'Collections',
      constructor: 'Necklace Constructor',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      account: 'Account',
    },
    hero: {
      title: 'Rune box',
      subtitle: 'Authentic Heritage Treasures',
      cta: 'Open Collection',
      tagline: 'Each piece is a portal to our ancestors\' history',
    },
    collections: {
      title: 'Heritage Collections',
      subtitle: 'Three cultures. One heritage. Countless stories.',
      slavic: 'Slavic',
      slavicTagline: 'Symbols of strength and protection',
      viking: 'Viking',
      vikingTagline: 'Courage and fate of warriors',
      celtic: 'Celtic',
      celticTagline: 'Trinity and eternity',
      viewAll: 'View all collections',
    },
    footer: {
      navigation: 'Navigation',
      contact: 'Contact',
      languages: 'Languages',
      collections: 'Collections',
      about: 'About',
      shipping: 'Shipping',
      brandDescription: 'Authentic handmade jewelry',
      location: 'Poland, EU',
      copyright: 'Rune box. All rights reserved.',
      acceptPayments: 'We accept:',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      handmade: 'Handmade',
      items: 'items',
    },
    home: {
      featuredProducts: {
        title: 'Featured Treasures',
        subtitle: 'Unique pieces created with soul and inspired by traditions',
        viewAll: 'View all jewelry',
      },
      about: {
        title: 'About Rune Box',
        paragraph1: 'Each piece is not just an accessory, but a portal to our ancestors\' history.',
        paragraph2: 'We create authentic pieces based on real archaeological samples, using ancient techniques and natural materials.',
        paragraph3: 'Natural coral, 925 silver, amber — each element is chosen with love and respect for the traditions of Slavic, Viking, and Celtic cultures.',
        learnMore: 'Learn more',
        quality: {
          title: 'Quality Guarantee',
          description: 'Each piece is made from natural materials',
        },
        handmade: {
          title: 'Handmade',
          description: 'Created using ancient techniques',
        },
        freeShipping: {
          title: 'Shipping',
          description: 'Throughout the European Union',
        },
      },
      bonusSystem: {
        title: 'Bonus System',
        subtitle: 'Earn bonuses with every purchase',
        description: 'Register and earn bonus points with every purchase. Use them to pay up to 20% of product costs.',
        levels: {
          human: {
            name: 'Human',
            description: 'Starting status',
            bonus: '1% bonus from each purchase',
          },
          elf: {
            name: 'Elf',
            description: 'After purchases of 1000+ PLN',
            bonus: '2% bonus from each purchase',
            requirement: 'Requires: 1000 PLN',
          },
          dwarf: {
            name: 'Dwarf',
            description: 'After purchases of 5000+ PLN',
            bonus: '3% bonus from each purchase',
            requirement: 'Requires: 5000 PLN',
          },
        },
        benefits: {
          title: 'Registration Benefits',
          earn: 'Earn bonuses with every purchase',
          use: 'Pay up to 20% of products with bonuses',
          track: 'Track order status',
        },
        cta: 'Register now',
        register: 'Register',
      },
    },
    newsletter: {
      title: 'Receive Magical Offers',
      subtitle: 'Subscribe to our newsletter and be the first to know about new collections and exclusive discounts',
      placeholder: 'Your email',
      subscribe: 'Subscribe',
      subscribing: 'Please wait...',
      success: {
        title: 'Thank you for subscribing!',
        message: 'Please check your email for confirmation',
      },
      privacy: 'We respect your privacy. You can unsubscribe at any time.',
    },
    about: {
      title: 'About Rune box',
      subtitle: 'Authentic handmade jewelry with soul and history',
      history: {
        title: 'Our History',
        content: 'Each piece in our collection is not just an accessory, but a portal to our ancestors\' history. We create authentic pieces based on real archaeological samples, using ancient techniques and natural materials.',
      },
      mission: {
        title: 'Our Mission',
        content: 'To preserve and pass on the beauty of Slavic, Viking, and Celtic cultures through unique handmade pieces. Each piece carries symbolism, strength, and wisdom of ancient traditions.',
      },
      quality: {
        title: 'Quality and Authenticity',
        intro: 'We use only natural materials:',
        materials: {
          coral: 'Natural coral from the Mediterranean',
          silver: '925 silver',
          amber: 'Baltic amber',
          gemstone: 'Natural gemstones',
        },
        conclusion: 'Each piece is created by hand following ancient techniques and with respect for our ancestors\' traditions.',
      },
    },
    contact: {
      title: 'Contact',
      subtitle: 'Have questions? We\'re always happy to help',
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        subject: 'Subject',
        subjectPlaceholder: 'Message subject',
        message: 'Message',
        messagePlaceholder: 'Your message...',
        submit: 'Send',
      },
      otherWays: 'Other ways to contact',
      location: 'Poland, European Union',
    },
    shipping: {
      title: 'Shipping & Payment',
      subtitle: 'Information about shipping and payment methods',
      delivery: {
        title: 'Shipping',
        intro: 'We ship orders throughout the European Union via reliable courier services.',
        free: 'Free shipping on orders over 1000 zł',
        standard: 'Standard shipping: 50 zł (3-5 business days)',
        express: 'Express shipping: 100 zł (1-2 business days)',
      },
      payment: {
        title: 'Payment Methods',
        intro: 'We accept the following payment methods:',
        cards: 'Credit/debit cards (Visa, Mastercard)',
        paypal: 'PayPal',
        transfer: 'Bank transfer',
        secure: 'All payments are protected by SSL encryption',
      },
      returns: {
        title: 'Returns',
        intro: 'We want you to be satisfied with your purchase. If for any reason you are not satisfied, you can return the item within 14 days.',
        days: '14 days to return',
        condition: 'Item must be in original condition',
        refund: 'Full refund',
      },
    },
    collectionsPage: {
      title: 'Jewelry Collections',
      subtitle: 'Unique handmade pieces combining beauty and symbolism of ancient cultures',
      found: 'Found',
      items: 'items',
      filters: 'Filters',
      sort: {
        newest: 'Newest',
        priceLow: 'Price: low → high',
        priceHigh: 'Price: high → low',
        name: 'Alphabetically',
      },
      noResults: {
        title: 'Nothing found',
        message: 'Try changing filters to view items',
      },
    },
    filters: {
      title: 'Filters',
      bySymbol: 'By Symbol',
      byMaterial: 'By Material',
      byCulture: 'By Culture',
      price: 'Price (zł)',
      clear: 'Clear filters',
      symbols: {
        love: 'Love',
        protection: 'Protection',
        wealth: 'Wealth',
        wisdom: 'Wisdom',
      },
      materials: {
        coral: 'Coral',
        silver: 'Silver',
        amber: 'Amber',
        gemstone: 'Precious stones',
      },
      cultures: {
        all: 'All',
        slavic: 'Slavic',
        viking: 'Viking',
        celtic: 'Celtic',
      },
    },
    product: {
      categories: {
        slavic: 'Slavic',
        viking: 'Viking',
        celtic: 'Celtic',
      },
      breadcrumb: {
        home: 'Home',
        collections: 'Collections',
      },
      collection: 'collection',
      materials: 'Materials',
      quantity: 'Quantity:',
      addToCart: 'Add to cart',
      legend: 'Legend',
      specifications: 'Specifications',
      related: 'Related Products',
      quality: 'Quality Guarantee',
      freeShipping: 'Free shipping in EU (3-5 days)',
      viewingNow: 'people viewing now',
      valueProps: {
        giftWrap: 'Free gift wrapping with every order',
        warranty: 'Authenticity & handmade craftsmanship guarantee',
        tracking: 'Easy tracking at every delivery stage',
        handmadeTooltipLabel: 'About materials',
        handmadeTooltip: 'Natural materials: coral, 925 silver and more. Each piece is assembled by hand.',
      },
      madeToOrder: {
        title: 'Made to Order',
        duration: 'Production time',
        orderButton: 'Order custom made',
        orderWithPayment: 'Order with 50% payment',
        depositTitle: 'Deposit',
        depositDescription: '50% payment upon order, remaining amount upon completion',
        formTitle: 'Order Form',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        customText: 'Text for engraving (if needed)',
        customTextPlaceholder: 'Enter text you want to add to the jewelry...',
        description: 'Description / Comment',
        descriptionPlaceholder: 'Describe your wishes for production...',
        submit: 'Submit order',
        submitting: 'Submitting...',
        cancel: 'Cancel',
        success: 'Your order has been received! We will contact you soon.',
      },
    },
    cart: {
      title: 'Cart',
      empty: {
        title: 'Cart is empty',
        message: 'Add jewelry to continue shopping',
        continue: 'Continue shopping',
      },
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      total: 'Total',
      checkout: 'Proceed to checkout',
      continueShopping: 'Continue shopping',
      remove: 'Remove',
      addMoreForFreeShipping: 'Add {amount} zł more for free shipping',
      securePayment: 'Secure payment',
      deliveryDays: 'Delivery 3-5 days',
      progressiveDiscount: 'Progressive discount',
      discount: 'Discount',
      subtotalBeforeDiscount: 'Subtotal before discount',
      addMoreForDiscount: 'Add 1 more item for -10% discount!',
      authReminder: {
        title: 'Register or log in',
        message: 'Register to earn bonuses with every purchase and track your orders',
        login: 'Log in',
        register: 'Register',
        benefits: 'Registration benefits',
        bonusPoints: 'Earn bonuses with every purchase',
        trackOrders: 'Track order status',
        saveAddresses: 'Save delivery addresses',
      },
    },
    legal: {
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      withdrawal: 'Withdrawal Form',
      acceptTerms: 'I accept the Terms & Conditions',
      acceptPrivacy: 'I accept the Privacy Policy',
      termsTitle: 'RuneBox Online Store Terms & Conditions',
      privacyTitle: 'Privacy Policy',
      withdrawalTitle: 'Withdrawal Form',
    },
    blog: {
      title: 'Rune box Blog',
      subtitle: 'Learn more about traditions, symbols, and craftsmanship of ethnic jewelry',
      loading: 'Loading articles...',
      noPosts: 'Blog articles will appear soon',
      goToBlog: 'Go to Blog',
      viewAllPosts: 'View All Blog Posts',
      readMore: 'Read more',
    },
    constructor: {
      title: 'Necklace Constructor',
      beads: 'Beads',
      stone: 'Stone',
      hardware: 'Hardware',
      extra: 'Extra',
      loading: 'Loading...',
      noBeads: 'No beads found',
      visualEditor: 'Visual Editor',
      clasp: 'Clasp',
      threads: 'Threads',
      thread: 'Thread',
      length: 'Length',
      addThread: 'Add Thread',
      deleteThread: 'Delete Thread',
      clear: 'Clear',
      send: 'Send',
      save: 'Save',
      home: 'Home',
      quoteRequest: 'Quote Request',
      settings: 'Settings',
      threadCount: 'Thread Count',
      maxThreads: 'Maximum: 5 threads',
      activeThread: 'Active Thread',
      threadLength: 'Thread Length',
      instruction: 'Instruction:',
      instruction1: 'Click on a bead on the left to add it',
      instruction2: 'Use Zoom to zoom in',
      instruction3: 'Click on a bead and press Rotate',
      instruction4: 'Select a clasp at the bottom panel',
      instruction5: 'Save or send request',
      saveSuccess: 'Configuration saved!',
      saveError: 'Save error. Check authorization.',
      loginRequired: 'Please log in to save configuration',
      addBeadsFirst: 'Add beads to necklace before sending request!',
      selectClasp: 'Please select a clasp!',
      threadOf: 'of',
      beadsOnThread: 'on thread',
    },
    auth: {
      login: 'Log in',
      loginTitle: 'Login',
      loginSubtitle: 'Log in to your account',
      email: 'Email',
      password: 'Password',
      loginButton: 'Log in',
      loggingIn: 'Logging in...',
      noAccount: 'No account?',
      registerLink: 'Register',
      errors: {
        incorrectCredentials: 'Incorrect email or password',
        accountNotActivated: 'Account not activated. Please verify your email.',
        emailNotVerified: 'Email not verified. Please check your email for verification link.',
        networkError: 'Failed to connect to server',
        defaultError: 'Authentication error',
      },
    },
    register: {
      title: 'Registration',
      subtitle: 'Create an account to receive bonuses and track orders',
      fullName: 'Full name',
      fullNamePlaceholder: 'John Doe',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      password: 'Password',
      passwordPlaceholder: 'Minimum 6 characters',
      passwordHint: 'Minimum 6 characters',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Repeat password',
      submit: 'Register',
      submitting: 'Registering...',
      success: {
        title: 'Registration successful!',
        message: 'We have sent an email confirmation to',
        redirecting: 'Redirecting to login page...',
      },
      hasAccount: 'Already have an account?',
      loginLink: 'Log in',
      agreement: 'By registering, you agree to our',
      termsLink: 'terms of use',
      privacyLink: 'privacy policy',
      errors: {
        passwordsMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must contain at least 6 characters',
        defaultError: 'Registration error',
        serverError: 'Server error. Please try again later or contact support.',
      },
    },
    checkout: {
      title: 'Checkout',
      contactInfo: 'Contact Information',
      email: 'Email',
      fullName: 'Full name',
      phone: 'Phone',
      delivery: 'Delivery',
      country: 'Country',
      countries: {
        AT: 'Austria',
        BE: 'Belgium',
        BG: 'Bulgaria',
        HR: 'Croatia',
        CY: 'Cyprus',
        CZ: 'Czech Republic',
        DK: 'Denmark',
        EE: 'Estonia',
        FI: 'Finland',
        FR: 'France',
        DE: 'Germany',
        GR: 'Greece',
        HU: 'Hungary',
        IE: 'Ireland',
        IT: 'Italy',
        LV: 'Latvia',
        LT: 'Lithuania',
        LU: 'Luxembourg',
        MT: 'Malta',
        NL: 'Netherlands',
        PL: 'Poland',
        PT: 'Portugal',
        RO: 'Romania',
        SK: 'Slovakia',
        SI: 'Slovenia',
        ES: 'Spain',
        SE: 'Sweden',
        UA: 'Ukraine',
        GB: 'United Kingdom',
        US: 'United States',
      },
      deliveryMethod: 'Delivery method',
      inpostLabel: 'InPost Paczkomat',
      inpostDescription: 'Pickup from parcel locker',
      novaposhtaLabel: 'Nova Poshta',
      novaposhtaDescription: 'Nova Poshta branch',
      pocztaLabel: 'Poczta Polska',
      pocztaDescription: 'Home delivery',
      courierLabel: 'Courier',
      courierDescription: 'Courier delivery',
      courierDescriptionUA: 'Courier delivery',
      courierDescriptionOther: 'Courier delivery',
      paczkomat: 'Paczkomat',
      paczkomatPlaceholder: 'Enter paczkomat code or address (e.g. WAW01M)',
      paczkomatHint: '💡 In the future you will be able to select a paczkomat from the map. For now, enter the paczkomat code manually.',
      selectFromMap: 'Select from map',
      changePoint: 'Change',
      cancel: 'Cancel',
      novaposhtaOffice: 'Branch',
      novaposhtaOfficePlaceholder: 'Enter branch number (e.g. Branch #1)',
      novaposhtaOfficeHint: '💡 Soon you will be able to select a branch from the map. For now, enter the branch address manually.',
      address: 'Address',
      addressPlaceholder: 'Main St. 1',
      addressPlaceholderUA: 'Khreshchatyk St. 1',
      address2: 'Address (additional)',
      address2Placeholder: 'Apartment, office',
      address2PlaceholderUA: 'Apartment, office',
      city: 'City',
      cityPlaceholder: 'Warsaw',
      cityPlaceholderUA: 'Kyiv',
      postalCode: 'Postal code',
      postalCodePlaceholder: '00-001',
      postalCodePlaceholderUA: '01001',
      billingSameAsShipping: 'Billing address same as shipping address',
      billingAddress: 'Billing Address',
      paymentMethod: 'Payment method',
      paymentStripe: 'Stripe (Card)',
      paymentP24: 'Przelewy24',
      paymentBLIK: 'BLIK',
      paymentBankTransfer: 'Bank transfer',
      orderNotes: 'Order notes',
      orderNotesPlaceholder: 'Additional wishes or information...',
      orderSummary: 'Your order',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      submit: 'Place order',
      submitting: 'Processing...',
      backToCart: '← Back to cart',
      errors: {
        defaultError: 'Order processing error',
      },
    },
    orderSuccess: {
      loading: 'Loading...',
      title: 'Order accepted!',
      orderNumber: 'Order number',
      thankYou: 'Thank you for your order! We have sent a confirmation to your email.',
      status: 'Status',
      paymentMethod: 'Payment method',
      total: 'Total',
      backToHome: 'Back to home',
      viewCollections: 'View collections',
    },
    adminOrders: {
      title: 'Orders',
      subtitle: 'Manage all orders',
      searchPlaceholder: 'Search by number, name or email...',
      allStatuses: 'All statuses',
      statusPending: 'Pending',
      statusPaid: 'Paid',
      statusShipped: 'Shipped',
      statusDelivered: 'Delivered',
      statusCancelled: 'Cancelled',
      loading: 'Loading...',
      noOrders: 'No orders found.',
      tableNumber: 'Number',
      tableClient: 'Client',
      tableAmount: 'Amount',
      tableStatus: 'Status',
      tablePayment: 'Payment',
      tableDate: 'Date',
      tableActions: 'Actions',
      edit: 'Edit',
      totalOrders: 'Total orders',
      totalAmount: 'Total amount',
      pending: 'Pending',
      paid: 'Paid',
      orderDetails: 'Order',
      customerInfo: 'Customer information',
      orderInfo: 'Order details',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      updateStatus: 'Update status',
      orderStatus: 'Order status',
      paymentStatus: 'Payment status',
      paymentCompleted: 'Completed',
      paymentFailed: 'Failed',
      paymentRefunded: 'Refunded',
      close: 'Close',
    },
    account: {
      title: 'Personal Account',
      subtitle: 'Manage your profile and orders',
      logout: 'Logout',
      loading: 'Loading...',
      errorLoading: 'Error loading profile',
      failedToLoad: 'Failed to load profile',
      shippingAddress: 'Shipping Address',
      inpostPaczkomat: 'InPost Paczkomat:',
      loyaltyStatus: 'Loyalty Status:',
      bonusPoints: 'points',
      bonusPointsLabel: 'Bonus Points',
      toStatus: 'To status',
      remaining: 'Remaining:',
      totalOrders: 'Total Orders',
      inProcessing: 'In Processing',
      myOrders: 'My Orders',
      noOrders: 'You have no orders yet',
      goToCatalog: 'Go to Catalog',
      orderNumber: 'Order #',
      item: 'item',
      items: 'items',
      tracking: 'Tracking:',
      openOnCarrierSite: 'Open on carrier website',
      trackingHistory: 'Tracking History:',
      status: {
        completed: 'Completed',
        shipped: 'Shipped',
        inProcessing: 'In Processing',
        paid: 'Paid',
        notPaid: 'Not Paid',
      },
      loyaltyStatuses: {
        human: 'Human',
        elf: 'Elf',
        dwarf: 'Dwarf',
      },
    },
  },
  DE: {
    nav: {
      collections: 'Kollektionen',
      constructor: 'Halsketten-Konstruktor',
      about: 'Über uns',
      contact: 'Kontakt',
      login: 'Anmelden',
      account: 'Konto',
    },
    hero: {
      title: 'Rune box',
      subtitle: 'Authentische Erbschätze',
      cta: 'Die Truhe öffnen',
      tagline: 'Jedes Stück ist ein Portal zur Geschichte unserer Vorfahren',
    },
    collections: {
      title: 'Erbe-Kollektionen',
      subtitle: 'Drei Kulturen. Ein Erbe. Unzählige Geschichten.',
      slavic: 'Slawisch',
      slavicTagline: 'Symbole der Stärke und des Schutzes',
      viking: 'Wikinger',
      vikingTagline: 'Mut und Schicksal der Krieger',
      celtic: 'Keltisch',
      celticTagline: 'Dreifaltigkeit und Ewigkeit',
      viewAll: 'Alle Kollektionen anzeigen',
    },
    footer: {
      navigation: 'Navigation',
      contact: 'Kontakt',
      languages: 'Sprachen',
      collections: 'Kollektionen',
      about: 'Über uns',
      shipping: 'Versand',
      brandDescription: 'Authentischer handgefertigter Schmuck',
      location: 'Polen, EU',
      copyright: 'Rune box. Alle Rechte vorbehalten.',
      acceptPayments: 'Wir akzeptieren:',
    },
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      handmade: 'Handgefertigt',
      items: 'Artikel',
    },
    home: {
      featuredProducts: {
        title: 'Ausgewählte Schätze',
        subtitle: 'Einzigartige Stücke, die mit Seele geschaffen und von Traditionen inspiriert sind',
        viewAll: 'Alle Schmuckstücke anzeigen',
      },
      about: {
        title: 'Über die Truhe',
        paragraph1: 'Jedes Stück ist nicht nur ein Accessoire, sondern ein Portal zur Geschichte unserer Vorfahren.',
        paragraph2: 'Wir schaffen authentische Stücke basierend auf echten archäologischen Proben unter Verwendung alter Techniken und natürlicher Materialien.',
        paragraph3: 'Natürliche Koralle, 925 Silber, Bernstein — jedes Element wird mit Liebe und Respekt für die Traditionen der slawischen, wikinger und keltischen Kulturen ausgewählt.',
        learnMore: 'Mehr erfahren',
        quality: {
          title: 'Qualitätsgarantie',
          description: 'Jedes Stück besteht aus natürlichen Materialien',
        },
        handmade: {
          title: 'Handgefertigt',
          description: 'Erstellt mit alten Techniken',
        },
        freeShipping: {
          title: 'Versand',
        description: 'In der gesamten Europäischen Union',
      },
    },
    bonusSystem: {
      title: 'Bonussystem',
      subtitle: 'Verdienen Sie Boni bei jedem Kauf',
      description: 'Registrieren Sie sich und verdienen Sie Bonuspunkte bei jedem Kauf. Nutzen Sie sie, um bis zu 20% der Produktkosten zu bezahlen.',
      levels: {
        human: {
          name: 'Mensch',
          description: 'Anfangsstatus',
          bonus: '1% Bonus bei jedem Kauf',
        },
        elf: {
          name: 'Elf',
          description: 'Nach Käufen ab 1000+ PLN',
          bonus: '2% Bonus bei jedem Kauf',
          requirement: 'Erfordert: 1000 PLN',
        },
        dwarf: {
          name: 'Zwerg',
          description: 'Nach Käufen ab 5000+ PLN',
          bonus: '3% Bonus bei jedem Kauf',
          requirement: 'Erfordert: 5000 PLN',
        },
      },
      benefits: {
        title: 'Registrierungsvorteile',
        earn: 'Verdienen Sie Boni bei jedem Kauf',
        use: 'Bezahlen Sie bis zu 20% der Produkte mit Boni',
        track: 'Verfolgen Sie den Bestellstatus',
      },
      cta: 'Jetzt registrieren',
      register: 'Registrieren',
    },
  },
  newsletter: {
      title: 'Magische Angebote erhalten',
      subtitle: 'Abonnieren Sie unseren Newsletter und erfahren Sie als Erster von neuen Kollektionen und exklusiven Rabatten',
      placeholder: 'Ihre E-Mail',
      subscribe: 'Abonnieren',
      subscribing: 'Bitte warten...',
      success: {
        title: 'Vielen Dank für Ihr Abonnement!',
        message: 'Bitte überprüfen Sie Ihre E-Mail zur Bestätigung',
      },
      privacy: 'Wir respektieren Ihre Privatsphäre. Sie können sich jederzeit abmelden.',
    },
    about: {
      title: 'Über Skrynia Pani Darii',
      subtitle: 'Authentischer handgefertigter Schmuck mit Seele und Geschichte',
      history: {
        title: 'Unsere Geschichte',
        content: 'Jedes Stück in unserer Kollektion ist nicht nur ein Accessoire, sondern ein Portal zur Geschichte unserer Vorfahren. Wir schaffen authentische Stücke basierend auf echten archäologischen Proben unter Verwendung alter Techniken und natürlicher Materialien.',
      },
      mission: {
        title: 'Unsere Mission',
        content: 'Die Schönheit der slawischen, wikinger und keltischen Kulturen durch einzigartige handgefertigte Stücke zu bewahren und weiterzugeben. Jedes Stück trägt Symbolik, Stärke und Weisheit alter Traditionen.',
      },
      quality: {
        title: 'Qualität und Authentizität',
        intro: 'Wir verwenden nur natürliche Materialien:',
        materials: {
          coral: 'Natürliche Koralle aus dem Mittelmeer',
          silver: '925 Silber',
          amber: 'Baltischer Bernstein',
          gemstone: 'Natürliche Edelsteine',
        },
        conclusion: 'Jedes Stück wird von Hand nach alten Techniken und mit Respekt für die Traditionen unserer Vorfahren hergestellt.',
      },
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Haben Sie Fragen? Wir helfen Ihnen gerne',
      form: {
        name: 'Name',
        namePlaceholder: 'Ihr Name',
        email: 'E-Mail',
        emailPlaceholder: 'ihre@email.com',
        subject: 'Betreff',
        subjectPlaceholder: 'Nachrichtenbetreff',
        message: 'Nachricht',
        messagePlaceholder: 'Ihre Nachricht...',
        submit: 'Senden',
      },
      otherWays: 'Andere Kontaktmöglichkeiten',
      location: 'Polen, Europäische Union',
    },
    shipping: {
      title: 'Versand & Zahlung',
      subtitle: 'Informationen zu Versand und Zahlungsmethoden',
      delivery: {
        title: 'Versand',
        intro: 'Wir versenden Bestellungen in der gesamten Europäischen Union über zuverlässige Kurierdienste.',
        free: 'Kostenloser Versand bei Bestellungen über 1000 zł',
        standard: 'Standardversand: 50 zł (3-5 Werktage)',
        express: 'Expressversand: 100 zł (1-2 Werktage)',
      },
      payment: {
        title: 'Zahlungsmethoden',
        intro: 'Wir akzeptieren folgende Zahlungsmethoden:',
        cards: 'Kredit-/Debitkarten (Visa, Mastercard)',
        paypal: 'PayPal',
        transfer: 'Banküberweisung',
        secure: 'Alle Zahlungen sind durch SSL-Verschlüsselung geschützt',
      },
      returns: {
        title: 'Rückgabe',
        intro: 'Wir möchten, dass Sie mit Ihrem Kauf zufrieden sind. Wenn Sie aus irgendeinem Grund nicht zufrieden sind, können Sie den Artikel innerhalb von 14 Tagen zurückgeben.',
        days: '14 Tage Rückgaberecht',
        condition: 'Artikel muss im Originalzustand sein',
        refund: 'Vollständige Rückerstattung',
      },
    },
    collectionsPage: {
      title: 'Schmuckkollektionen',
      subtitle: 'Einzigartige handgefertigte Stücke, die Schönheit und Symbolik alter Kulturen vereinen',
      found: 'Gefunden',
      items: 'Artikel',
      filters: 'Filter',
      sort: {
        newest: 'Neueste',
        priceLow: 'Preis: niedrig → hoch',
        priceHigh: 'Preis: hoch → niedrig',
        name: 'Alphabetisch',
      },
      noResults: {
        title: 'Nichts gefunden',
        message: 'Versuchen Sie, die Filter zu ändern, um Artikel anzuzeigen',
      },
    },
    filters: {
      title: 'Filter',
      bySymbol: 'Nach Symbol',
      byMaterial: 'Nach Material',
      byCulture: 'Nach Kultur',
      price: 'Preis (zł)',
      clear: 'Filter löschen',
      symbols: {
        love: 'Liebe',
        protection: 'Schutz',
        wealth: 'Reichtum',
        wisdom: 'Weisheit',
      },
      materials: {
        coral: 'Koralle',
        silver: 'Silber',
        amber: 'Bernstein',
        gemstone: 'Edelsteine',
      },
      cultures: {
        all: 'Alle',
        slavic: 'Slawisch',
        viking: 'Wikinger',
        celtic: 'Keltisch',
      },
    },
    product: {
      categories: {
        slavic: 'Slawisch',
        viking: 'Wikinger',
        celtic: 'Keltisch',
      },
      breadcrumb: {
        home: 'Startseite',
        collections: 'Kollektionen',
      },
      collection: 'Kollektion',
      materials: 'Materialien',
      quantity: 'Menge:',
      addToCart: 'In den Warenkorb',
      legend: 'Legende',
      specifications: 'Spezifikationen',
      related: 'Ähnliche Produkte',
      quality: 'Qualitätsgarantie',
      freeShipping: 'Kostenloser Versand in der EU (3-5 Tage)',
      viewingNow: 'Personen sehen sich das gerade an',
      valueProps: {
        giftWrap: 'Kostenlose Geschenkverpackung zu jeder Bestellung',
        warranty: 'Garantie für Originalität & Handarbeit',
        tracking: 'Einfaches Tracking jeder Lieferphase',
        handmadeTooltipLabel: 'Über Materialien',
        handmadeTooltip: 'Natürliche Materialien: Koralle, 925er Silber und mehr. Jedes Stück wird von Hand gefertigt.',
      },
      madeToOrder: {
        title: 'Auf Bestellung',
        duration: 'Produktionszeit',
        orderButton: 'Auf Bestellung anfertigen',
        orderWithPayment: 'Mit 50% Anzahlung bestellen',
        depositTitle: 'Anzahlung',
        depositDescription: '50% Zahlung bei Bestellung, Restbetrag bei Fertigstellung',
        formTitle: 'Bestellformular',
        name: 'Name',
        email: 'E-Mail',
        phone: 'Telefon',
        customText: 'Text für Gravur (falls gewünscht)',
        customTextPlaceholder: 'Geben Sie den Text ein, den Sie auf dem Schmuck haben möchten...',
        description: 'Beschreibung / Kommentar',
        descriptionPlaceholder: 'Beschreiben Sie Ihre Wünsche für die Anfertigung...',
        submit: 'Bestellung absenden',
        submitting: 'Wird gesendet...',
        cancel: 'Abbrechen',
        success: 'Ihre Bestellung wurde angenommen! Wir werden uns bald bei Ihnen melden.',
      },
    },
    cart: {
      title: 'Warenkorb',
      empty: {
        title: 'Warenkorb ist leer',
        message: 'Fügen Sie Schmuck hinzu, um weiter einzukaufen',
        continue: 'Weiter einkaufen',
      },
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      free: 'Kostenlos',
      total: 'Gesamt',
      checkout: 'Zur Kasse gehen',
      continueShopping: 'Weiter einkaufen',
      remove: 'Entfernen',
      addMoreForFreeShipping: 'Fügen Sie noch {amount} zł hinzu für kostenlosen Versand',
      securePayment: 'Sichere Zahlung',
      deliveryDays: 'Lieferung 3-5 Tage',
      progressiveDiscount: 'Progressiver Rabatt',
      discount: 'Rabatt',
      subtotalBeforeDiscount: 'Zwischensumme vor Rabatt',
      addMoreForDiscount: 'Fügen Sie 1 weiteren Artikel hinzu für -10%!',
      authReminder: {
        title: 'Registrieren Sie sich oder melden Sie sich an',
        message: 'Registrieren Sie sich, um Boni bei jedem Kauf zu verdienen und Ihre Bestellungen zu verfolgen',
        login: 'Anmelden',
        register: 'Registrieren',
        benefits: 'Registrierungsvorteile',
        bonusPoints: 'Verdienen Sie Boni bei jedem Kauf',
        trackOrders: 'Verfolgen Sie den Bestellstatus',
        saveAddresses: 'Speichern Sie Lieferadressen',
      },
    },
    legal: {
      terms: 'AGB',
      privacy: 'Datenschutzerklärung',
      withdrawal: 'Widerrufsformular',
      acceptTerms: 'Ich akzeptiere die AGB',
      acceptPrivacy: 'Ich akzeptiere die Datenschutzerklärung',
      termsTitle: 'AGB des Online-Shops RuneBox',
      privacyTitle: 'Datenschutzerklärung',
      withdrawalTitle: 'Widerrufsformular',
    },
    blog: {
      title: 'Rune box Blog',
      subtitle: 'Erfahren Sie mehr über Traditionen, Symbole und Handwerkskunst ethnischen Schmucks',
      loading: 'Artikel werden geladen...',
      noPosts: 'Blog-Artikel erscheinen in Kürze',
      goToBlog: 'Zum Blog gehen',
      viewAllPosts: 'Alle Blog-Beiträge anzeigen',
      readMore: 'Weiterlesen',
    },
    constructor: {
      title: 'Halsketten-Konstruktor',
      beads: 'Perlen',
      stone: 'Stein',
      hardware: 'Beschläge',
      extra: 'Extra',
      loading: 'Laden...',
      noBeads: 'Keine Perlen gefunden',
      visualEditor: 'Visueller Editor',
      clasp: 'Verschluss',
      threads: 'Fäden',
      thread: 'Faden',
      length: 'Länge',
      addThread: 'Faden hinzufügen',
      deleteThread: 'Faden löschen',
      clear: 'Löschen',
      send: 'Senden',
      save: 'Speichern',
      home: 'Startseite',
      quoteRequest: 'Anfrage für Angebot',
      settings: 'Einstellungen',
      threadCount: 'Fadenanzahl',
      maxThreads: 'Maximum: 5 Fäden',
      activeThread: 'Aktiver Faden',
      threadLength: 'Fadenlänge',
      instruction: 'Anleitung:',
      instruction1: 'Klicken Sie auf eine Perle links, um sie hinzuzufügen',
      instruction2: 'Verwenden Sie Zoom zum Vergrößern',
      instruction3: 'Klicken Sie auf eine Perle und drücken Sie Rotate',
      instruction4: 'Wählen Sie einen Verschluß im unteren Panel',
      instruction5: 'Speichern oder Anfrage senden',
      saveSuccess: 'Konfiguration gespeichert!',
      saveError: 'Speicherfehler. Überprüfen Sie die Autorisierung.',
      loginRequired: 'Bitte melden Sie sich an, um die Konfiguration zu speichern',
      addBeadsFirst: 'Fügen Sie Perlen zur Halskette hinzu, bevor Sie eine Anfrage senden!',
      selectClasp: 'Bitte wählen Sie einen Verschluß!',
      threadOf: 'von',
      beadsOnThread: 'auf Faden',
    },
    auth: {
      login: 'Anmelden',
      loginTitle: 'Anmeldung',
      loginSubtitle: 'Melden Sie sich in Ihrem Konto an',
      email: 'E-Mail',
      password: 'Passwort',
      loginButton: 'Anmelden',
      loggingIn: 'Anmeldung...',
      noAccount: 'Kein Konto?',
      registerLink: 'Registrieren',
      errors: {
        incorrectCredentials: 'Falsche E-Mail oder Passwort',
        accountNotActivated: 'Konto nicht aktiviert. Bitte bestätigen Sie Ihre E-Mail.',
        emailNotVerified: 'E-Mail nicht bestätigt. Bitte überprüfen Sie Ihre E-Mail auf den Bestätigungslink.',
        networkError: 'Verbindung zum Server fehlgeschlagen',
        defaultError: 'Authentifizierungsfehler',
      },
    },
    register: {
      title: 'Registrierung',
      subtitle: 'Erstellen Sie ein Konto, um Boni zu erhalten und Bestellungen zu verfolgen',
      fullName: 'Vollständiger Name',
      fullNamePlaceholder: 'Max Mustermann',
      email: 'E-Mail',
      emailPlaceholder: 'beispiel@email.com',
      password: 'Passwort',
      passwordPlaceholder: 'Mindestens 6 Zeichen',
      passwordHint: 'Mindestens 6 Zeichen',
      confirmPassword: 'Passwort bestätigen',
      confirmPasswordPlaceholder: 'Passwort wiederholen',
      submit: 'Registrieren',
      submitting: 'Registrierung...',
      success: {
        title: 'Registrierung erfolgreich!',
        message: 'Wir haben eine E-Mail-Bestätigung gesendet an',
        redirecting: 'Weiterleitung zur Anmeldeseite...',
      },
      hasAccount: 'Haben Sie bereits ein Konto?',
      loginLink: 'Anmelden',
      agreement: 'Mit der Registrierung stimmen Sie unseren',
      termsLink: 'Nutzungsbedingungen',
      privacyLink: 'Datenschutzrichtlinie',
      errors: {
        passwordsMismatch: 'Passwörter stimmen nicht überein',
        passwordTooShort: 'Passwort muss mindestens 6 Zeichen enthalten',
        defaultError: 'Registrierungsfehler',
        serverError: 'Serverfehler. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.',
      },
    },
    checkout: {
      title: 'Kasse',
      contactInfo: 'Kontaktinformationen',
      email: 'E-Mail',
      fullName: 'Vollständiger Name',
      phone: 'Telefon',
      delivery: 'Lieferung',
      country: 'Land',
      countries: {
        AT: 'Österreich',
        BE: 'Belgien',
        BG: 'Bulgarien',
        HR: 'Kroatien',
        CY: 'Zypern',
        CZ: 'Tschechien',
        DK: 'Dänemark',
        EE: 'Estland',
        FI: 'Finnland',
        FR: 'Frankreich',
        DE: 'Deutschland',
        GR: 'Griechenland',
        HU: 'Ungarn',
        IE: 'Irland',
        IT: 'Italien',
        LV: 'Lettland',
        LT: 'Litauen',
        LU: 'Luxemburg',
        MT: 'Malta',
        NL: 'Niederlande',
        PL: 'Polen',
        PT: 'Portugal',
        RO: 'Rumänien',
        SK: 'Slowakei',
        SI: 'Slowenien',
        ES: 'Spanien',
        SE: 'Schweden',
        UA: 'Ukraine',
        GB: 'Vereinigtes Königreich',
        US: 'Vereinigte Staaten',
      },
      deliveryMethod: 'Liefermethode',
      inpostLabel: 'InPost Paczkomat',
      inpostDescription: 'Abholung am Paketautomaten',
      novaposhtaLabel: 'Nova Poshta',
      novaposhtaDescription: 'Nova Poshta Filiale',
      pocztaLabel: 'Poczta Polska',
      pocztaDescription: 'Hauslieferung',
      courierLabel: 'Kurier',
      courierDescription: 'Kurierlieferung',
      courierDescriptionUA: 'Kurierlieferung',
      courierDescriptionOther: 'Kurierlieferung',
      paczkomat: 'Paczkomat',
      paczkomatPlaceholder: 'Paczkomat-Code oder Adresse eingeben (z.B. WAW01M)',
      paczkomatHint: '💡 In Zukunft können Sie einen Paczkomat auf der Karte auswählen. Geben Sie vorerst den Paczkomat-Code manuell ein.',
      selectFromMap: 'Von Karte auswählen',
      changePoint: 'Ändern',
      cancel: 'Abbrechen',
      novaposhtaOffice: 'Filiale',
      novaposhtaOfficePlaceholder: 'Filialnummer eingeben (z.B. Filiale #1)',
      novaposhtaOfficeHint: '💡 Bald können Sie eine Filiale auf der Karte auswählen. Geben Sie vorerst die Filialadresse manuell ein.',
      address: 'Adresse',
      addressPlaceholder: 'Hauptstr. 1',
      addressPlaceholderUA: 'Chreschtschatyk-Str. 1',
      address2: 'Adresse (zusätzlich)',
      address2Placeholder: 'Wohnung, Büro',
      address2PlaceholderUA: 'Wohnung, Büro',
      city: 'Stadt',
      cityPlaceholder: 'Warschau',
      cityPlaceholderUA: 'Kiew',
      postalCode: 'Postleitzahl',
      postalCodePlaceholder: '00-001',
      postalCodePlaceholderUA: '01001',
      billingSameAsShipping: 'Rechnungsadresse entspricht Lieferadresse',
      billingAddress: 'Rechnungsadresse',
      paymentMethod: 'Zahlungsmethode',
      paymentStripe: 'Stripe (Karte)',
      paymentP24: 'Przelewy24',
      paymentBLIK: 'BLIK',
      paymentBankTransfer: 'Banküberweisung',
      orderNotes: 'Bestellnotizen',
      orderNotesPlaceholder: 'Zusätzliche Wünsche oder Informationen...',
      orderSummary: 'Ihre Bestellung',
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      total: 'Gesamt',
      submit: 'Bestellung aufgeben',
      submitting: 'Verarbeitung...',
      backToCart: '← Zurück zum Warenkorb',
      errors: {
        defaultError: 'Bestellverarbeitungsfehler',
      },
    },
    orderSuccess: {
      loading: 'Laden...',
      title: 'Bestellung angenommen!',
      orderNumber: 'Bestellnummer',
      thankYou: 'Vielen Dank für Ihre Bestellung! Wir haben eine Bestätigung an Ihre E-Mail gesendet.',
      status: 'Status',
      paymentMethod: 'Zahlungsmethode',
      total: 'Gesamt',
      backToHome: 'Zurück zur Startseite',
      viewCollections: 'Kollektionen anzeigen',
    },
    adminOrders: {
      title: 'Bestellungen',
      subtitle: 'Verwaltung aller Bestellungen',
      searchPlaceholder: 'Suche nach Nummer, Name oder E-Mail...',
      allStatuses: 'Alle Status',
      statusPending: 'Ausstehend',
      statusPaid: 'Bezahlt',
      statusShipped: 'Versandt',
      statusDelivered: 'Geliefert',
      statusCancelled: 'Storniert',
      loading: 'Laden...',
      noOrders: 'Keine Bestellungen gefunden.',
      tableNumber: 'Nummer',
      tableClient: 'Kunde',
      tableAmount: 'Betrag',
      tableStatus: 'Status',
      tablePayment: 'Zahlung',
      tableDate: 'Datum',
      tableActions: 'Aktionen',
      edit: 'Bearbeiten',
      totalOrders: 'Gesamtbestellungen',
      totalAmount: 'Gesamtbetrag',
      pending: 'Ausstehend',
      paid: 'Bezahlt',
      orderDetails: 'Bestellung',
      customerInfo: 'Kundeninformationen',
      orderInfo: 'Bestelldetails',
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      total: 'Gesamt',
      updateStatus: 'Status aktualisieren',
      orderStatus: 'Bestellstatus',
      paymentStatus: 'Zahlungsstatus',
      paymentCompleted: 'Abgeschlossen',
      paymentFailed: 'Fehlgeschlagen',
      paymentRefunded: 'Erstattet',
      close: 'Schließen',
    },
    account: {
      title: 'Persönliches Konto',
      subtitle: 'Verwalten Sie Ihr Profil und Ihre Bestellungen',
      logout: 'Abmelden',
      loading: 'Laden...',
      errorLoading: 'Fehler beim Laden des Profils',
      failedToLoad: 'Profil konnte nicht geladen werden',
      shippingAddress: 'Lieferadresse',
      inpostPaczkomat: 'InPost Paczkomat:',
      loyaltyStatus: 'Treuestatus:',
      bonusPoints: 'Punkte',
      bonusPointsLabel: 'Bonuspunkte',
      toStatus: 'Zum Status',
      remaining: 'Verbleibend:',
      totalOrders: 'Gesamtbestellungen',
      inProcessing: 'In Bearbeitung',
      myOrders: 'Meine Bestellungen',
      noOrders: 'Sie haben noch keine Bestellungen',
      goToCatalog: 'Zum Katalog gehen',
      orderNumber: 'Bestellung #',
      item: 'Artikel',
      items: 'Artikel',
      tracking: 'Sendungsverfolgung:',
      openOnCarrierSite: 'Auf der Website des Versandunternehmens öffnen',
      trackingHistory: 'Sendungsverfolgungsverlauf:',
      status: {
        completed: 'Abgeschlossen',
        shipped: 'Versandt',
        inProcessing: 'In Bearbeitung',
        paid: 'Bezahlt',
        notPaid: 'Nicht bezahlt',
      },
      loyaltyStatuses: {
        human: 'Mensch',
        elf: 'Elf',
        dwarf: 'Zwerg',
      },
    },
  },
  PL: {
    nav: {
      collections: 'Kolekcje',
      constructor: 'Konstruktor Naszyjników',
      about: 'O nas',
      contact: 'Kontakt',
      login: 'Zaloguj się',
      account: 'Konto',
    },
    hero: {
      title: 'Rune box',
      subtitle: 'Autentyczne Skarby Dziedzictwa',
      cta: 'Otwórz Skrzynię',
      tagline: 'Każda ozdoba to portal do historii naszych przodków',
    },
    collections: {
      title: 'Kolekcje Dziedzictwa',
      subtitle: 'Trzy kultury. Jedno dziedzictwo. Nieskończone historie.',
      slavic: 'Słowiańskie',
      slavicTagline: 'Symbole siły i ochrony',
      viking: 'Wikingowie',
      vikingTagline: 'Odwaga i los wojowników',
      celtic: 'Celtyckie',
      celticTagline: 'Trójca i wieczność',
      viewAll: 'Zobacz wszystkie kolekcje',
    },
    footer: {
      navigation: 'Nawigacja',
      contact: 'Kontakt',
      languages: 'Języki',
      collections: 'Kolekcje',
      about: 'O nas',
      shipping: 'Dostawa',
      brandDescription: 'Autentyczna biżuteria ręcznie robiona',
      location: 'Polska, UE',
      copyright: 'Skrynia Pani Darii. Wszelkie prawa zastrzeżone.',
      acceptPayments: 'Przyjmujemy:',
    },
    common: {
      loading: 'Ładowanie...',
      error: 'Błąd',
      handmade: 'Ręcznie robione',
      items: 'przedmioty',
    },
    home: {
      featuredProducts: {
        title: 'Wybrane Skarby',
        subtitle: 'Unikalne ozdoby stworzone z duszą i inspirowane tradycjami',
        viewAll: 'Zobacz wszystkie ozdoby',
      },
      about: {
        title: 'O Skrzyni',
        paragraph1: 'Każda ozdoba to nie tylko akcesorium, ale portal do historii naszych przodków.',
        paragraph2: 'Tworzymy autentyczne wyroby na podstawie prawdziwych próbek archeologicznych, używając starożytnych technik i naturalnych materiałów.',
        paragraph3: 'Naturalny koral, srebro 925, bursztyn — każdy element jest wybierany z miłością i szacunkiem dla tradycji kultur słowiańskich, wikińskich i celtyckich.',
        learnMore: 'Dowiedz się więcej',
        quality: {
          title: 'Gwarancja jakości',
          description: 'Każda ozdoba wykonana z naturalnych materiałów',
        },
        handmade: {
          title: 'Ręcznie robione',
          description: 'Tworzone starożytnymi technikami',
        },
        freeShipping: {
          title: 'Dostawa',
          description: 'W całej Unii Europejskiej',
        },
      },
      bonusSystem: {
        title: 'System Bonusowy',
        subtitle: 'Zarabiaj bonusy przy każdym zakupie',
        description: 'Zarejestruj się i zarabiaj punkty bonusowe przy każdym zakupie. Użyj ich, aby zapłacić do 20% kosztów produktów.',
        levels: {
          human: {
            name: 'Człowiek',
            description: 'Status początkowy',
            bonus: '1% bonusu z każdego zakupu',
          },
          elf: {
            name: 'Elf',
            description: 'Po zakupach za 1000+ PLN',
            bonus: '2% bonusu z każdego zakupu',
            requirement: 'Wymaga: 1000 PLN',
          },
          dwarf: {
            name: 'Krasnolud',
            description: 'Po zakupach za 5000+ PLN',
            bonus: '3% bonusu z każdego zakupu',
            requirement: 'Wymaga: 5000 PLN',
          },
        },
        benefits: {
          title: 'Korzyści z rejestracji',
          earn: 'Zarabiaj bonusy przy każdym zakupie',
          use: 'Płać do 20% produktów bonusami',
          track: 'Śledź status zamówień',
        },
        cta: 'Zarejestruj się teraz',
        register: 'Zarejestruj się',
      },
    },
    newsletter: {
      title: 'Otrzymuj Magiczne Oferty',
      subtitle: 'Zapisz się do newslettera i dowiedz się jako pierwszy o nowych kolekcjach i ekskluzywnych zniżkach',
      placeholder: 'Twój email',
      subscribe: 'Zapisz się',
      subscribing: 'Proszę czekać...',
      success: {
        title: 'Dziękujemy za zapisanie się!',
        message: 'Sprawdź swoją skrzynkę e-mail w celu potwierdzenia',
      },
      privacy: 'Szanujemy Twoją prywatność. Możesz zrezygnować w dowolnym momencie.',
    },
    about: {
      title: 'O Skrzyni Pani Darii',
      subtitle: 'Autentyczna biżuteria ręcznie robiona z duszą i historią',
      history: {
        title: 'Nasza Historia',
        content: 'Każda ozdoba w naszej kolekcji to nie tylko akcesorium, ale portal do historii naszych przodków. Tworzymy autentyczne wyroby na podstawie prawdziwych próbek archeologicznych, używając starożytnych technik i naturalnych materiałów.',
      },
      mission: {
        title: 'Nasza Misja',
        content: 'Zachować i przekazać piękno kultur słowiańskich, wikińskich i celtyckich poprzez unikalne wyroby ręcznie robione. Każda ozdoba niesie w sobie symbolikę, siłę i mądrość starożytnych tradycji.',
      },
      quality: {
        title: 'Jakość i Autentyczność',
        intro: 'Używamy tylko naturalnych materiałów:',
        materials: {
          coral: 'Naturalny koral z Morza Śródziemnego',
          silver: 'Srebro 925',
          amber: 'Bursztyn bałtycki',
          gemstone: 'Naturalne kamienie szlachetne',
        },
        conclusion: 'Każdy wyrób jest tworzony ręcznie z zachowaniem starożytnych technik i z szacunkiem dla tradycji naszych przodków.',
      },
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Masz pytania? Zawsze chętnie pomożemy',
      form: {
        name: 'Imię',
        namePlaceholder: 'Twoje imię',
        email: 'Email',
        emailPlaceholder: 'twoj@email.com',
        subject: 'Temat',
        subjectPlaceholder: 'Temat wiadomości',
        message: 'Wiadomość',
        messagePlaceholder: 'Twoja wiadomość...',
        submit: 'Wyślij',
      },
      otherWays: 'Inne sposoby kontaktu',
      location: 'Polska, Unia Europejska',
    },
    shipping: {
      title: 'Dostawa i Płatność',
      subtitle: 'Informacje o dostawie i metodach płatności',
      delivery: {
        title: 'Dostawa',
        intro: 'Wysyłamy zamówienia w całej Unii Europejskiej za pośrednictwem niezawodnych firm kurierskich.',
        free: 'Darmowa dostawa przy zamówieniu powyżej 1000 zł',
        standard: 'Standardowa dostawa: 50 zł (3-5 dni roboczych)',
        express: 'Ekspresowa dostawa: 100 zł (1-2 dni robocze)',
      },
      payment: {
        title: 'Metody Płatności',
        intro: 'Akceptujemy następujące metody płatności:',
        cards: 'Karty kredytowe/debetowe (Visa, Mastercard)',
        paypal: 'PayPal',
        transfer: 'Przelew bankowy',
        secure: 'Wszystkie płatności są chronione szyfrowaniem SSL',
      },
      returns: {
        title: 'Zwroty',
        intro: 'Chcemy, abyś był zadowolony ze swojego zakupu. Jeśli z jakiegokolwiek powodu nie jesteś zadowolony, możesz zwrócić przedmiot w ciągu 14 dni.',
        days: '14 dni na zwrot',
        condition: 'Przedmiot musi być w stanie oryginalnym',
        refund: 'Pełny zwrot kosztów',
      },
    },
    collectionsPage: {
      title: 'Kolekcje Biżuterii',
      subtitle: 'Unikalne wyroby ręcznie robione łączące piękno i symbolikę starożytnych kultur',
      found: 'Znaleziono',
      items: 'przedmiotów',
      filters: 'Filtry',
      sort: {
        newest: 'Najnowsze',
        priceLow: 'Cena: niska → wysoka',
        priceHigh: 'Cena: wysoka → niska',
        name: 'Alfabetycznie',
      },
      noResults: {
        title: 'Nic nie znaleziono',
        message: 'Spróbuj zmienić filtry, aby zobaczyć przedmioty',
      },
    },
    filters: {
      title: 'Filtry',
      bySymbol: 'Według Symbolu',
      byMaterial: 'Według Materiału',
      byCulture: 'Według Kultury',
      price: 'Cena (zł)',
      clear: 'Wyczyść filtry',
      symbols: {
        love: 'Miłość',
        protection: 'Ochrona',
        wealth: 'Bogactwo',
        wisdom: 'Mądrość',
      },
      materials: {
        coral: 'Koral',
        silver: 'Srebro',
        amber: 'Bursztyn',
        gemstone: 'Kamienie szlachetne',
      },
      cultures: {
        all: 'Wszystkie',
        slavic: 'Słowiańskie',
        viking: 'Wikingowie',
        celtic: 'Celtyckie',
      },
    },
    product: {
      categories: {
        slavic: 'Słowiańskie',
        viking: 'Wikingowie',
        celtic: 'Celtyckie',
      },
      breadcrumb: {
        home: 'Strona główna',
        collections: 'Kolekcje',
      },
      collection: 'kolekcja',
      materials: 'Materiały',
      quantity: 'Ilość:',
      addToCart: 'Dodaj do koszyka',
      legend: 'Legenda',
      specifications: 'Specyfikacje',
      related: 'Podobne Produkty',
      quality: 'Gwarancja jakości',
      freeShipping: 'Darmowa dostawa w UE (3-5 dni)',
      viewingNow: 'osób ogląda teraz',
      valueProps: {
        giftWrap: 'Darmowe pakowanie prezentowe do każdego zamówienia',
        warranty: 'Gwarancja oryginalności i ręcznego wykonania',
        tracking: 'Łatwe śledzenie każdego etapu dostawy',
        handmadeTooltipLabel: 'O materiałach',
        handmadeTooltip: 'Naturalne materiały: koral, srebro 925 i inne. Każdy wyrób powstaje ręcznie.',
      },
      madeToOrder: {
        title: 'Na zamówienie',
        duration: 'Czas realizacji',
        orderButton: 'Zamów wykonanie',
        orderWithPayment: 'Zamów z opłatą 50%',
        depositTitle: 'Zadatek',
        depositDescription: '50% płatności przy zamówieniu, pozostała kwota po ukończeniu',
        formTitle: 'Formularz zamówienia',
        name: 'Imię',
        email: 'Email',
        phone: 'Telefon',
        customText: 'Tekst do grawerowania (jeśli potrzebny)',
        customTextPlaceholder: 'Wpisz tekst, który chcesz dodać do biżuterii...',
        description: 'Opis / Komentarz',
        descriptionPlaceholder: 'Opisz swoje życzenia dotyczące wykonania...',
        submit: 'Wyślij zamówienie',
        submitting: 'Wysyłanie...',
        cancel: 'Anuluj',
        success: 'Twoje zamówienie zostało przyjęte! Skontaktujemy się z Tobą wkrótce.',
      },
    },
    cart: {
      title: 'Koszyk',
      empty: {
        title: 'Koszyk jest pusty',
        message: 'Dodaj biżuterię, aby kontynuować zakupy',
        continue: 'Kontynuuj zakupy',
      },
      subtotal: 'Suma częściowa',
      shipping: 'Dostawa',
      free: 'Darmowa',
      total: 'Razem',
      checkout: 'Przejdź do kasy',
      continueShopping: 'Kontynuuj zakupy',
      remove: 'Usuń',
      addMoreForFreeShipping: 'Dodaj jeszcze {amount} zł, aby uzyskać darmową dostawę',
      securePayment: 'Bezpieczna płatność',
      deliveryDays: 'Dostawa 3-5 dni',
      progressiveDiscount: 'Progresywna zniżka',
      discount: 'Zniżka',
      subtotalBeforeDiscount: 'Suma przed zniżką',
      addMoreForDiscount: 'Dodaj jeszcze 1 przedmiot i otrzymaj -10%!',
      authReminder: {
        title: 'Zarejestruj się lub zaloguj',
        message: 'Zarejestruj się, aby zarabiać bonusy przy każdym zakupie i śledzić zamówienia',
        login: 'Zaloguj się',
        register: 'Zarejestruj się',
        benefits: 'Korzyści z rejestracji',
        bonusPoints: 'Zarabiaj bonusy przy każdym zakupie',
        trackOrders: 'Śledź status zamówień',
        saveAddresses: 'Zapisz adresy dostawy',
      },
    },
    legal: {
      terms: 'Regulamin',
      privacy: 'Polityka prywatności',
      withdrawal: 'Formularz odstąpienia',
      acceptTerms: 'Akceptuję Regulamin sklepu',
      acceptPrivacy: 'Akceptuję Politykę prywatności',
      termsTitle: 'Regulamin sklepu internetowego RuneBox',
      privacyTitle: 'Polityka Prywatności',
      withdrawalTitle: 'Formularz odstąpienia od umowy',
    },
    blog: {
      title: 'Blog Rune box',
      subtitle: 'Dowiedz się więcej o tradycjach, symbolach i rzemiośle etnicznej biżuterii',
      loading: 'Ładowanie artykułów...',
      noPosts: 'Artykuły na blogu pojawią się wkrótce',
      goToBlog: 'Przejdź do bloga',
      viewAllPosts: 'Wszystkie artykuły na blogu',
      readMore: 'Czytaj więcej',
    },
    constructor: {
      title: 'Konstruktor Naszyjników',
      beads: 'Koraliki',
      stone: 'Kamień',
      hardware: 'Okucia',
      extra: 'Dodatkowe',
      loading: 'Ładowanie...',
      noBeads: 'Nie znaleziono koralików',
      visualEditor: 'Edytor Wizualny',
      clasp: 'Zapięcie',
      threads: 'Nici',
      thread: 'Nić',
      length: 'Długość',
      addThread: 'Dodaj nić',
      deleteThread: 'Usuń nić',
      clear: 'Wyczyść',
      send: 'Wyślij',
      save: 'Zapisz',
      home: 'Strona główna',
      quoteRequest: 'Zapytanie o Wycenę',
      settings: 'Ustawienia',
      threadCount: 'Liczba Nici',
      maxThreads: 'Maksimum: 5 nici',
      activeThread: 'Aktywna Nić',
      threadLength: 'Długość Nici',
      instruction: 'Instrukcja:',
      instruction1: 'Kliknij koralik po lewej, aby go dodać',
      instruction2: 'Użyj Zoom do powiększenia',
      instruction3: 'Kliknij koralik i naciśnij Rotate',
      instruction4: 'Wybierz zapięcie w dolnym panelu',
      instruction5: 'Zapisz lub wyślij zapytanie',
      saveSuccess: 'Konfiguracja zapisana!',
      saveError: 'Błąd zapisu. Sprawdź autoryzację.',
      loginRequired: 'Proszę zalogować się, aby zapisać konfigurację',
      addBeadsFirst: 'Dodaj koraliki do naszyjnika przed wysłaniem zapytania!',
      selectClasp: 'Proszę wybrać zapięcie!',
      threadOf: 'z',
      beadsOnThread: 'na nitce',
    },
    auth: {
      login: 'Zaloguj się',
      loginTitle: 'Logowanie',
      loginSubtitle: 'Zaloguj się do swojego konta',
      email: 'Email',
      password: 'Hasło',
      loginButton: 'Zaloguj się',
      loggingIn: 'Logowanie...',
      noAccount: 'Nie masz konta?',
      registerLink: 'Zarejestruj się',
      errors: {
        incorrectCredentials: 'Nieprawidłowy email lub hasło',
        accountNotActivated: 'Konto nieaktywne. Proszę potwierdzić email.',
        emailNotVerified: 'Email niezweryfikowany. Proszę sprawdzić email pod kątem linku weryfikacyjnego.',
        networkError: 'Nie udało się połączyć z serwerem',
        defaultError: 'Błąd uwierzytelniania',
      },
    },
    register: {
      title: 'Rejestracja',
      subtitle: 'Utwórz konto, aby otrzymywać bonusy i śledzić zamówienia',
      fullName: 'Imię i nazwisko',
      fullNamePlaceholder: 'Jan Kowalski',
      email: 'Email',
      emailPlaceholder: 'przyklad@email.com',
      password: 'Hasło',
      passwordPlaceholder: 'Minimum 6 znaków',
      passwordHint: 'Minimum 6 znaków',
      confirmPassword: 'Potwierdzenie hasła',
      confirmPasswordPlaceholder: 'Powtórz hasło',
      submit: 'Zarejestruj się',
      submitting: 'Rejestracja...',
      success: {
        title: 'Rejestracja udana!',
        message: 'Wysłaliśmy e-mail potwierdzający na adres',
        redirecting: 'Przekierowywanie do strony logowania...',
      },
      hasAccount: 'Masz już konto?',
      loginLink: 'Zaloguj się',
      agreement: 'Rejestrując się, zgadzasz się z naszymi',
      termsLink: 'warunkami użytkowania',
      privacyLink: 'polityką prywatności',
      errors: {
        passwordsMismatch: 'Hasła nie są zgodne',
        passwordTooShort: 'Hasło musi zawierać co najmniej 6 znaków',
        defaultError: 'Błąd rejestracji',
        serverError: 'Błąd serwera. Proszę spróbować ponownie później lub skontaktować się z pomocą.',
      },
    },
    checkout: {
      title: 'Zamówienie',
      contactInfo: 'Informacje kontaktowe',
      email: 'Email',
      fullName: 'Imię i nazwisko',
      phone: 'Telefon',
      delivery: 'Dostawa',
      country: 'Kraj',
      countries: {
        AT: 'Austria',
        BE: 'Belgia',
        BG: 'Bułgaria',
        HR: 'Chorwacja',
        CY: 'Cypr',
        CZ: 'Czechy',
        DK: 'Dania',
        EE: 'Estonia',
        FI: 'Finlandia',
        FR: 'Francja',
        DE: 'Niemcy',
        GR: 'Grecja',
        HU: 'Węgry',
        IE: 'Irlandia',
        IT: 'Włochy',
        LV: 'Łotwa',
        LT: 'Litwa',
        LU: 'Luksemburg',
        MT: 'Malta',
        NL: 'Holandia',
        PL: 'Polska',
        PT: 'Portugalia',
        RO: 'Rumunia',
        SK: 'Słowacja',
        SI: 'Słowenia',
        ES: 'Hiszpania',
        SE: 'Szwecja',
        UA: 'Ukraina',
        GB: 'Wielka Brytania',
        US: 'Stany Zjednoczone',
      },
      deliveryMethod: 'Sposób dostawy',
      inpostLabel: 'InPost Paczkomat',
      inpostDescription: 'Odbiór z paczkomatu',
      novaposhtaLabel: 'Nova Poshta',
      novaposhtaDescription: 'Oddział Nova Poshta',
      pocztaLabel: 'Poczta Polska',
      pocztaDescription: 'Dostawa do domu',
      courierLabel: 'Kurier',
      courierDescription: 'Dostawa kurierem',
      courierDescriptionUA: 'Dostawa kurierem',
      courierDescriptionOther: 'Dostawa kurierem',
      paczkomat: 'Paczkomat',
      paczkomatPlaceholder: 'Wpisz kod paczkomatu lub adres (np. WAW01M)',
      paczkomatHint: '💡 W przyszłości będziesz mógł wybrać paczkomat z mapy. Na razie wpisz kod paczkomatu ręcznie.',
      selectFromMap: 'Wybierz z mapy',
      changePoint: 'Zmień',
      cancel: 'Anuluj',
      novaposhtaOffice: 'Oddział',
      novaposhtaOfficePlaceholder: 'Wpisz numer oddziału (np. Oddział #1)',
      novaposhtaOfficeHint: '💡 Wkrótce będziesz mógł wybrać oddział z mapy. Na razie wpisz adres oddziału ręcznie.',
      address: 'Adres',
      addressPlaceholder: 'ul. Główna 1',
      addressPlaceholderUA: 'ul. Chreszczatyk 1',
      address2: 'Adres (dodatkowy)',
      address2Placeholder: 'Mieszkanie, biuro',
      address2PlaceholderUA: 'Mieszkanie, biuro',
      city: 'Miasto',
      cityPlaceholder: 'Warszawa',
      cityPlaceholderUA: 'Kijów',
      postalCode: 'Kod pocztowy',
      postalCodePlaceholder: '00-001',
      postalCodePlaceholderUA: '01001',
      billingSameAsShipping: 'Adres rozliczeniowy taki sam jak adres dostawy',
      billingAddress: 'Adres rozliczeniowy',
      paymentMethod: 'Sposób płatności',
      paymentStripe: 'Stripe (Karta)',
      paymentP24: 'Przelewy24',
      paymentBLIK: 'BLIK',
      paymentBankTransfer: 'Przelew bankowy',
      orderNotes: 'Uwagi do zamówienia',
      orderNotesPlaceholder: 'Dodatkowe życzenia lub informacje...',
      orderSummary: 'Twoje zamówienie',
      subtotal: 'Podsumowanie',
      shipping: 'Dostawa',
      total: 'Razem',
      submit: 'Złóż zamówienie',
      submitting: 'Przetwarzanie...',
      backToCart: '← Wróć do koszyka',
      errors: {
        defaultError: 'Błąd przetwarzania zamówienia',
      },
    },
    orderSuccess: {
      loading: 'Ładowanie...',
      title: 'Zamówienie przyjęte!',
      orderNumber: 'Numer zamówienia',
      thankYou: 'Dziękujemy za zamówienie! Wysłaliśmy potwierdzenie na Twój adres e-mail.',
      status: 'Status',
      paymentMethod: 'Metoda płatności',
      total: 'Razem',
      backToHome: 'Powrót do strony głównej',
      viewCollections: 'Przejrzyj kolekcje',
    },
    adminOrders: {
      title: 'Zamówienia',
      subtitle: 'Zarządzanie wszystkimi zamówieniami',
      searchPlaceholder: 'Szukaj po numerze, imieniu lub e-mailu...',
      allStatuses: 'Wszystkie statusy',
      statusPending: 'Oczekujące',
      statusPaid: 'Opłacone',
      statusShipped: 'Wysłane',
      statusDelivered: 'Dostarczone',
      statusCancelled: 'Anulowane',
      loading: 'Ładowanie...',
      noOrders: 'Nie znaleziono zamówień.',
      tableNumber: 'Numer',
      tableClient: 'Klient',
      tableAmount: 'Kwota',
      tableStatus: 'Status',
      tablePayment: 'Płatność',
      tableDate: 'Data',
      tableActions: 'Akcje',
      edit: 'Edytuj',
      totalOrders: 'Wszystkie zamówienia',
      totalAmount: 'Łączna kwota',
      pending: 'Oczekujące',
      paid: 'Opłacone',
      orderDetails: 'Zamówienie',
      customerInfo: 'Informacje o kliencie',
      orderInfo: 'Szczegóły zamówienia',
      subtotal: 'Suma częściowa',
      shipping: 'Dostawa',
      total: 'Razem',
      updateStatus: 'Aktualizuj status',
      orderStatus: 'Status zamówienia',
      paymentStatus: 'Status płatności',
      paymentCompleted: 'Zakończone',
      paymentFailed: 'Niepowodzenie',
      paymentRefunded: 'Zwrócone',
      close: 'Zamknij',
    },
    account: {
      title: 'Konto osobiste',
      subtitle: 'Zarządzaj swoim profilem i zamówieniami',
      logout: 'Wyloguj się',
      loading: 'Ładowanie...',
      errorLoading: 'Błąd ładowania profilu',
      failedToLoad: 'Nie udało się załadować profilu',
      shippingAddress: 'Adres dostawy',
      inpostPaczkomat: 'InPost Paczkomat:',
      loyaltyStatus: 'Status lojalnościowy:',
      bonusPoints: 'punktów',
      bonusPointsLabel: 'Punkty bonusowe',
      toStatus: 'Do statusu',
      remaining: 'Pozostało:',
      totalOrders: 'Wszystkie zamówienia',
      inProcessing: 'W przetwarzaniu',
      myOrders: 'Moje zamówienia',
      noOrders: 'Nie masz jeszcze zamówień',
      goToCatalog: 'Przejdź do katalogu',
      orderNumber: 'Zamówienie #',
      item: 'produkt',
      items: 'produktów',
      tracking: 'Śledzenie:',
      openOnCarrierSite: 'Otwórz na stronie przewoźnika',
      trackingHistory: 'Historia śledzenia:',
      status: {
        completed: 'Zakończone',
        shipped: 'Wysłane',
        inProcessing: 'W przetwarzaniu',
        paid: 'Opłacone',
        notPaid: 'Nie opłacone',
      },
      loyaltyStatuses: {
        human: 'Człowiek',
        elf: 'Elf',
        dwarf: 'Krasnolud',
      },
    },
  },
  SE: {
    nav: {
      collections: 'Kollektioner',
      constructor: 'Halsbandskonstruktör',
      about: 'Om oss',
      contact: 'Kontakt',
    },
    hero: {
      title: 'Rune box',
      subtitle: 'Autentiska Arvskatter',
      cta: 'Öppna Kollektionen',
      tagline: 'Varje smycke är en portal till våra förfäders historia',
    },
    collections: {
      title: 'Arvskollektioner',
      subtitle: 'Tre kulturer. Ett arv. Otaliga berättelser.',
      slavic: 'Slaviska',
      slavicTagline: 'Symboler för styrka och skydd',
      viking: 'Viking',
      vikingTagline: 'Mod och krigarnas öde',
      celtic: 'Keltiska',
      celticTagline: 'Treenighet och evighet',
      viewAll: 'Visa alla kollektioner',
    },
    footer: {
      navigation: 'Navigering',
      contact: 'Kontakt',
      languages: 'Språk',
      collections: 'Kollektioner',
      about: 'Om oss',
      shipping: 'Frakt',
      brandDescription: 'Autentiska handgjorda smycken',
      location: 'Polen, EU',
      copyright: 'Rune box. Alla rättigheter förbehållna.',
      acceptPayments: 'Vi accepterar:',
    },
    common: {
      loading: 'Laddar...',
      error: 'Fel',
      handmade: 'Handgjort',
      items: 'artiklar',
    },
    home: {
      featuredProducts: {
        title: 'Utvalda Skatter',
        subtitle: 'Unika smycken skapade med själ och inspirerade av traditioner',
        viewAll: 'Visa alla smycken',
      },
      about: {
        title: 'Om Din Skatt',
        paragraph1: 'Varje smycke är inte bara ett accessoar, utan en portal till våra förfäders historia.',
        paragraph2: 'Vi skapar autentiska smycken baserade på äkta arkeologiska prov, med hjälp av uråldriga tekniker och naturliga material.',
        paragraph3: 'Naturlig korall, 925 silver, bärnsten — varje element väljs med kärlek och respekt för traditionerna i slaviska, viking- och keltiska kulturer.',
        learnMore: 'Läs mer',
        quality: {
          title: 'Kvalitetsgaranti',
          description: 'Varje smycke är tillverkat av naturliga material',
        },
        handmade: {
          title: 'Handgjort',
          description: 'Skapat med uråldriga tekniker',
        },
        freeShipping: {
          title: 'Frakt',
          description: 'I hela Europeiska unionen',
        },
      },
      bonusSystem: {
        title: 'Bonussystem',
        subtitle: 'Tjäna bonusar vid varje köp',
        description: 'Registrera dig och tjäna bonuspoäng vid varje köp. Använd dem för att betala upp till 20% av produktkostnader.',
        levels: {
          human: {
            name: 'Människa',
            description: 'Startstatus',
            bonus: '1% bonus från varje köp',
          },
          elf: {
            name: 'Alv',
            description: 'Efter köp på 1000+ PLN',
            bonus: '2% bonus från varje köp',
            requirement: 'Kräver: 1000 PLN',
          },
          dwarf: {
            name: 'Dvärg',
            description: 'Efter köp på 5000+ PLN',
            bonus: '3% bonus från varje köp',
            requirement: 'Kräver: 5000 PLN',
          },
        },
        benefits: {
          title: 'Registreringsfördelar',
          earn: 'Tjäna bonusar vid varje köp',
          use: 'Betala upp till 20% av produkter med bonusar',
          track: 'Spåra orderstatus',
        },
        cta: 'Registrera dig nu',
        register: 'Registrera',
      },
    },
    newsletter: {
      title: 'Få Magiska Erbjudanden',
      subtitle: 'Prenumerera på vårt nyhetsbrev och var först med att få veta om nya kollektioner och exklusiva rabatter',
      placeholder: 'Din e-post',
      subscribe: 'Prenumerera',
      subscribing: 'Var god vänta...',
      success: {
        title: 'Tack för din prenumeration!',
        message: 'Kontrollera din e-post för bekräftelse',
      },
      privacy: 'Vi respekterar din integritet. Du kan avsluta prenumerationen när som helst.',
    },
    about: {
      title: 'Om Skrynia Pani Darii',
      subtitle: 'Autentiska handgjorda smycken med själ och historia',
      history: {
        title: 'Vår Historia',
        content: 'Varje smycke i vår kollektion är inte bara ett accessoar, utan en portal till våra förfäders historia. Vi skapar autentiska smycken baserade på äkta arkeologiska prov, med hjälp av uråldriga tekniker och naturliga material.',
      },
      mission: {
        title: 'Vårt Uppdrag',
        content: 'Att bevara och förmedla skönheten i slaviska, viking- och keltiska kulturer genom unika handgjorda smycken. Varje smycke bär på symbolik, styrka och visdom från uråldriga traditioner.',
      },
      quality: {
        title: 'Kvalitet och Autenticitet',
        intro: 'Vi använder endast naturliga material:',
        materials: {
          coral: 'Naturlig korall från Medelhavet',
          silver: '925 silver',
          amber: 'Baltisk bärnsten',
          gemstone: 'Naturliga ädelstenar',
        },
        conclusion: 'Varje smycke skapas för hand enligt uråldriga tekniker och med respekt för våra förfäders traditioner.',
      },
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Har du frågor? Vi hjälper dig gärna',
      form: {
        name: 'Namn',
        namePlaceholder: 'Ditt namn',
        email: 'E-post',
        emailPlaceholder: 'din@epost.se',
        subject: 'Ämne',
        subjectPlaceholder: 'Meddelandeämne',
        message: 'Meddelande',
        messagePlaceholder: 'Ditt meddelande...',
        submit: 'Skicka',
      },
      otherWays: 'Andra sätt att kontakta oss',
      location: 'Polen, Europeiska unionen',
    },
    shipping: {
      title: 'Frakt & Betalning',
      subtitle: 'Information om frakt och betalningsmetoder',
      delivery: {
        title: 'Frakt',
        intro: 'Vi skickar beställningar i hela Europeiska unionen via pålitliga budtjänster.',
        free: 'Fri frakt vid beställningar över 1000 zł',
        standard: 'Standardfrakt: 50 zł (3-5 arbetsdagar)',
        express: 'Expressfrakt: 100 zł (1-2 arbetsdagar)',
      },
      payment: {
        title: 'Betalningsmetoder',
        intro: 'Vi accepterar följande betalningsmetoder:',
        cards: 'Kredit-/betalkort (Visa, Mastercard)',
        paypal: 'PayPal',
        transfer: 'Banköverföring',
        secure: 'Alla betalningar skyddas av SSL-kryptering',
      },
      returns: {
        title: 'Returer',
        intro: 'Vi vill att du ska vara nöjd med ditt köp. Om du av någon anledning inte är nöjd kan du returnera varan inom 14 dagar.',
        days: '14 dagars returrätt',
        condition: 'Varan måste vara i originalskick',
        refund: 'Full återbetalning',
      },
    },
    collectionsPage: {
      title: 'Smyckeskollektioner',
      subtitle: 'Unika handgjorda smycken som kombinerar skönhet och symbolik från uråldriga kulturer',
      found: 'Hittade',
      items: 'artiklar',
      filters: 'Filter',
      sort: {
        newest: 'Nyaste',
        priceLow: 'Pris: lågt → högt',
        priceHigh: 'Pris: högt → lågt',
        name: 'Alfabetiskt',
      },
      noResults: {
        title: 'Inget hittades',
        message: 'Försök ändra filter för att visa artiklar',
      },
    },
    filters: {
      title: 'Filter',
      bySymbol: 'Efter Symbol',
      byMaterial: 'Efter Material',
      byCulture: 'Efter Kultur',
      price: 'Pris (zł)',
      clear: 'Rensa filter',
      symbols: {
        love: 'Kärlek',
        protection: 'Skydd',
        wealth: 'Välstånd',
        wisdom: 'Visdom',
      },
      materials: {
        coral: 'Korall',
        silver: 'Silver',
        amber: 'Bärnsten',
        gemstone: 'Ädelstenar',
      },
      cultures: {
        all: 'Alla',
        slavic: 'Slaviska',
        viking: 'Viking',
        celtic: 'Keltiska',
      },
    },
    product: {
      categories: {
        slavic: 'Slaviska',
        viking: 'Viking',
        celtic: 'Keltiska',
      },
      breadcrumb: {
        home: 'Hem',
        collections: 'Kollektioner',
      },
      collection: 'kollektion',
      materials: 'Material',
      quantity: 'Antal:',
      addToCart: 'Lägg i varukorg',
      legend: 'Legend',
      specifications: 'Specifikationer',
      related: 'Relaterade Produkter',
      quality: 'Kvalitetsgaranti',
      freeShipping: 'Fri frakt i EU (3-5 dagar)',
      viewingNow: 'personer tittar nu',
      valueProps: {
        giftWrap: 'Gratis presentinslagning med varje beställning',
        warranty: 'Garanti för äkthet och handgjort hantverk',
        tracking: 'Enkel spårning i varje leveranssteg',
        handmadeTooltipLabel: 'Om material',
        handmadeTooltip: 'Naturliga material: korall, 925 silver och mer. Varje smycke sätts ihop för hand.',
      },
      madeToOrder: {
        title: 'På beställning',
        duration: 'Produktionstid',
        orderButton: 'Beställ specialtillverkning',
        orderWithPayment: 'Beställ med 50% betalning',
        depositTitle: 'Handpenning',
        depositDescription: '50% betalning vid beställning, återstående belopp vid slutförande',
        formTitle: 'Beställningsformulär',
        name: 'Namn',
        email: 'E-post',
        phone: 'Telefon',
        customText: 'Text för gravering (om önskas)',
        customTextPlaceholder: 'Ange texten du vill ha på smycket...',
        description: 'Beskrivning / Kommentar',
        descriptionPlaceholder: 'Beskriv dina önskemål för tillverkningen...',
        submit: 'Skicka beställning',
        submitting: 'Skickar...',
        cancel: 'Avbryt',
        success: 'Din beställning har mottagits! Vi kontaktar dig snart.',
      },
    },
    cart: {
      title: 'Varukorg',
      empty: {
        title: 'Varukorgen är tom',
        message: 'Lägg till smycken för att fortsätta handla',
        continue: 'Fortsätt handla',
      },
      subtotal: 'Delsumma',
      shipping: 'Frakt',
      free: 'Gratis',
      total: 'Totalt',
      checkout: 'Gå till kassan',
      continueShopping: 'Fortsätt handla',
      remove: 'Ta bort',
      addMoreForFreeShipping: 'Lägg till {amount} zł till för fri frakt',
      securePayment: 'Säker betalning',
      deliveryDays: 'Leverans 3-5 dagar',
      progressiveDiscount: 'Progressiv rabatt',
      discount: 'Rabatt',
      subtotalBeforeDiscount: 'Delsumma före rabatt',
      addMoreForDiscount: 'Lägg till 1 artikel till för -10% rabatt!',
      authReminder: {
        title: 'Registrera dig eller logga in',
        message: 'Registrera dig för att tjäna bonusar vid varje köp och spåra dina beställningar',
        login: 'Logga in',
        register: 'Registrera',
        benefits: 'Registreringsfördelar',
        bonusPoints: 'Tjäna bonusar vid varje köp',
        trackOrders: 'Spåra orderstatus',
        saveAddresses: 'Spara leveransadresser',
      },
    },
    legal: {
      terms: 'Villkor',
      privacy: 'Integritetspolicy',
      withdrawal: 'Ångerrätt',
      acceptTerms: 'Jag accepterar villkoren',
      acceptPrivacy: 'Jag accepterar integritetspolicyn',
      termsTitle: 'RuneBox Villkor & Bestämmelser',
      privacyTitle: 'Integritetspolicy',
      withdrawalTitle: 'Ångerrättsformulär',
    },
    blog: {
      title: 'Rune box Blog',
      subtitle: 'Lär dig mer om traditioner, symboler och hantverk av etniskt smycken',
      loading: 'Laddar artiklar...',
      noPosts: 'Bloggartiklar kommer snart',
      goToBlog: 'Gå till bloggen',
      viewAllPosts: 'Visa alla blogginlägg',
      readMore: 'Läs mer',
    },
    constructor: {
      title: 'Halsbandskonstruktör',
      beads: 'Pärlor',
      stone: 'Sten',
      hardware: 'Hårdvara',
      extra: 'Extra',
      loading: 'Laddar...',
      noBeads: 'Inga pärlor hittades',
      visualEditor: 'Visuell Editor',
      clasp: 'Lås',
      threads: 'Trådar',
      thread: 'Tråd',
      length: 'Längd',
      addThread: 'Lägg till tråd',
      deleteThread: 'Ta bort tråd',
      clear: 'Rensa',
      send: 'Skicka',
      save: 'Spara',
      home: 'Hem',
      quoteRequest: 'Begäran om Offer',
      settings: 'Inställningar',
      threadCount: 'Trådantal',
      maxThreads: 'Maximalt: 5 trådar',
      activeThread: 'Aktiv Tråd',
      threadLength: 'Trådlängd',
      instruction: 'Instruktion:',
      instruction1: 'Klicka på en pärla till vänster för att lägga till den',
      instruction2: 'Använd Zoom för att zooma in',
      instruction3: 'Klicka på en pärla och tryck på Rotate',
      instruction4: 'Välj ett lås i nedre panelen',
      instruction5: 'Spara eller skicka begäran',
      saveSuccess: 'Konfiguration sparad!',
      saveError: 'Sparfel. Kontrollera auktorisering.',
      loginRequired: 'Vänligen logga in för att spara konfiguration',
      addBeadsFirst: 'Lägg till pärlor till halsbandet innan du skickar begäran!',
      selectClasp: 'Vänligen välj ett lås!',
      threadOf: 'av',
      beadsOnThread: 'på tråd',
    },
    auth: {
      login: 'Logga in',
      loginTitle: 'Inloggning',
      loginSubtitle: 'Logga in på ditt konto',
      email: 'E-post',
      password: 'Lösenord',
      loginButton: 'Logga in',
      loggingIn: 'Loggar in...',
      noAccount: 'Inget konto?',
      registerLink: 'Registrera',
      errors: {
        incorrectCredentials: 'Felaktig e-post eller lösenord',
        accountNotActivated: 'Kontot är inte aktiverat. Vänligen verifiera din e-post.',
        emailNotVerified: 'E-posten är inte verifierad. Vänligen kontrollera din e-post för verifieringslänk.',
        networkError: 'Kunde inte ansluta till servern',
        defaultError: 'Autentiseringsfel',
      },
    },
    register: {
      title: 'Registrering',
      subtitle: 'Skapa ett konto för att få bonusar och spåra beställningar',
      fullName: 'Fullständigt namn',
      fullNamePlaceholder: 'Jan Andersson',
      email: 'E-post',
      emailPlaceholder: 'exempel@email.com',
      password: 'Lösenord',
      passwordPlaceholder: 'Minst 6 tecken',
      passwordHint: 'Minst 6 tecken',
      confirmPassword: 'Bekräfta lösenord',
      confirmPasswordPlaceholder: 'Upprepa lösenord',
      submit: 'Registrera',
      submitting: 'Registrerar...',
      success: {
        title: 'Registrering lyckades!',
        message: 'Vi har skickat ett e-postbekräftelse till',
        redirecting: 'Omdirigerar till inloggningssidan...',
      },
      hasAccount: 'Har du redan ett konto?',
      loginLink: 'Logga in',
      agreement: 'Genom att registrera dig godkänner du våra',
      termsLink: 'användarvillkor',
      privacyLink: 'integritetspolicy',
      errors: {
        passwordsMismatch: 'Lösenorden matchar inte',
        passwordTooShort: 'Lösenordet måste innehålla minst 6 tecken',
        defaultError: 'Registreringsfel',
        serverError: 'Serverfel. Vänligen försök igen senare eller kontakta support.',
      },
    },
    checkout: {
      title: 'Kassa',
      contactInfo: 'Kontaktinformation',
      email: 'E-post',
      fullName: 'Fullständigt namn',
      phone: 'Telefon',
      delivery: 'Leverans',
      country: 'Land',
      countries: {
        AT: 'Österrike',
        BE: 'Belgien',
        BG: 'Bulgarien',
        HR: 'Kroatien',
        CY: 'Cypern',
        CZ: 'Tjeckien',
        DK: 'Danmark',
        EE: 'Estland',
        FI: 'Finland',
        FR: 'Frankrike',
        DE: 'Tyskland',
        GR: 'Grekland',
        HU: 'Ungern',
        IE: 'Irland',
        IT: 'Italien',
        LV: 'Lettland',
        LT: 'Litauen',
        LU: 'Luxemburg',
        MT: 'Malta',
        NL: 'Nederländerna',
        PL: 'Polen',
        PT: 'Portugal',
        RO: 'Rumänien',
        SK: 'Slovakien',
        SI: 'Slovenien',
        ES: 'Spanien',
        SE: 'Sverige',
        UA: 'Ukraina',
        GB: 'Storbritannien',
        US: 'USA',
      },
      deliveryMethod: 'Leveransmetod',
      inpostLabel: 'InPost Paczkomat',
      inpostDescription: 'Hämta från paketlåda',
      novaposhtaLabel: 'Nova Poshta',
      novaposhtaDescription: 'Nova Poshta-filial',
      pocztaLabel: 'Poczta Polska',
      pocztaDescription: 'Hemleverans',
      courierLabel: 'Kurir',
      courierDescription: 'Kurirleverans',
      courierDescriptionUA: 'Kurirleverans',
      courierDescriptionOther: 'Kurirleverans',
      paczkomat: 'Paczkomat',
      paczkomatPlaceholder: 'Ange paczkomat-kod eller adress (t.ex. WAW01M)',
      paczkomatHint: '💡 I framtiden kommer du att kunna välja en paczkomat från kartan. För närvarande, ange paczkomat-koden manuellt.',
      selectFromMap: 'Välj från karta',
      changePoint: 'Ändra',
      cancel: 'Avbryt',
      novaposhtaOffice: 'Filial',
      novaposhtaOfficePlaceholder: 'Ange filialnummer (t.ex. Filial #1)',
      novaposhtaOfficeHint: '💡 Snart kommer du att kunna välja en filial från kartan. För närvarande, ange filialadressen manuellt.',
      address: 'Adress',
      addressPlaceholder: 'Huvudgatan 1',
      addressPlaceholderUA: 'Chresjtjatikgatan 1',
      address2: 'Adress (ytterligare)',
      address2Placeholder: 'Lägenhet, kontor',
      address2PlaceholderUA: 'Lägenhet, kontor',
      city: 'Stad',
      cityPlaceholder: 'Warszawa',
      cityPlaceholderUA: 'Kiev',
      postalCode: 'Postnummer',
      postalCodePlaceholder: '00-001',
      postalCodePlaceholderUA: '01001',
      billingSameAsShipping: 'Faktureringsadress samma som leveransadress',
      billingAddress: 'Faktureringsadress',
      paymentMethod: 'Betalningsmetod',
      paymentStripe: 'Stripe (Kort)',
      paymentP24: 'Przelewy24',
      paymentBLIK: 'BLIK',
      paymentBankTransfer: 'Banköverföring',
      orderNotes: 'Beställningsanteckningar',
      orderNotesPlaceholder: 'Ytterligare önskemål eller information...',
      orderSummary: 'Din beställning',
      subtotal: 'Delsumma',
      shipping: 'Frakt',
      total: 'Totalt',
      submit: 'Lägg beställning',
      submitting: 'Bearbetar...',
      backToCart: '← Tillbaka till varukorgen',
      errors: {
        defaultError: 'Beställningsbearbetningsfel',
      },
    },
    orderSuccess: {
      loading: 'Laddar...',
      title: 'Beställning accepterad!',
      orderNumber: 'Beställningsnummer',
      thankYou: 'Tack för din beställning! Vi har skickat en bekräftelse till din e-post.',
      status: 'Status',
      paymentMethod: 'Betalningsmetod',
      total: 'Totalt',
      backToHome: 'Tillbaka till startsidan',
      viewCollections: 'Visa kollektioner',
    },
    adminOrders: {
      title: 'Beställningar',
      subtitle: 'Hantera alla beställningar',
      searchPlaceholder: 'Sök efter nummer, namn eller e-post...',
      allStatuses: 'Alla statusar',
      statusPending: 'Väntande',
      statusPaid: 'Betald',
      statusShipped: 'Skickad',
      statusDelivered: 'Levererad',
      statusCancelled: 'Inställd',
      loading: 'Laddar...',
      noOrders: 'Inga beställningar hittades.',
      tableNumber: 'Nummer',
      tableClient: 'Kund',
      tableAmount: 'Belopp',
      tableStatus: 'Status',
      tablePayment: 'Betalning',
      tableDate: 'Datum',
      tableActions: 'Åtgärder',
      edit: 'Redigera',
      totalOrders: 'Totalt antal beställningar',
      totalAmount: 'Totalt belopp',
      pending: 'Väntande',
      paid: 'Betald',
      orderDetails: 'Beställning',
      customerInfo: 'Kundinformation',
      orderInfo: 'Beställningsdetaljer',
      subtotal: 'Delsumma',
      shipping: 'Frakt',
      total: 'Totalt',
      updateStatus: 'Uppdatera status',
      orderStatus: 'Beställningsstatus',
      paymentStatus: 'Betalningsstatus',
      paymentCompleted: 'Genomförd',
      paymentFailed: 'Misslyckades',
      paymentRefunded: 'Återbetalad',
      close: 'Stäng',
    },
    account: {
      title: 'Personligt Konto',
      subtitle: 'Hantera din profil och beställningar',
      logout: 'Logga ut',
      loading: 'Laddar...',
      errorLoading: 'Fel vid laddning av profil',
      failedToLoad: 'Kunde inte ladda profil',
      shippingAddress: 'Leveransadress',
      inpostPaczkomat: 'InPost Paczkomat:',
      loyaltyStatus: 'Lojalitetsstatus:',
      bonusPoints: 'poäng',
      bonusPointsLabel: 'Bonuspoäng',
      toStatus: 'Till status',
      remaining: 'Återstående:',
      totalOrders: 'Totalt antal beställningar',
      inProcessing: 'Under behandling',
      myOrders: 'Mina beställningar',
      noOrders: 'Du har inga beställningar ännu',
      goToCatalog: 'Gå till katalog',
      orderNumber: 'Beställning #',
      item: 'artikel',
      items: 'artiklar',
      tracking: 'Spårning:',
      openOnCarrierSite: 'Öppna på transportföretagets webbplats',
      trackingHistory: 'Spårningshistorik:',
      status: {
        completed: 'Genomförd',
        shipped: 'Skickad',
        inProcessing: 'Under behandling',
        paid: 'Betald',
        notPaid: 'Inte betald',
      },
      loyaltyStatuses: {
        human: 'Människa',
        elf: 'Alv',
        dwarf: 'Dvärg',
      },
    },
  },
  NO: {
    nav: {
      collections: 'Kolleksjoner',
      constructor: 'Halsbandkonstruktør',
      about: 'Om oss',
      contact: 'Kontakt',
    },
    hero: {
      title: 'Rune box',
      subtitle: 'Autentiske Arvskatter',
      cta: 'Åpne Kolleksjonen',
      tagline: 'Hvert smykke er en portal til våre forfedres historie',
    },
    collections: {
      title: 'Arvskolleksjoner',
      subtitle: 'Tre kulturer. Én arv. Utallige historier.',
      slavic: 'Slaviske',
      slavicTagline: 'Symboler for styrke og beskyttelse',
      viking: 'Viking',
      vikingTagline: 'Mot og krigerens skjebne',
      celtic: 'Keltiske',
      celticTagline: 'Treenighet og evighet',
      viewAll: 'Vis alle kolleksjoner',
    },
    footer: {
      navigation: 'Navigasjon',
      contact: 'Kontakt',
      languages: 'Språk',
      collections: 'Kolleksjoner',
      about: 'Om oss',
      shipping: 'Frakt',
      brandDescription: 'Autentiske håndlagde smykker',
      location: 'Polen, EU',
      copyright: 'Rune box. Alle rettigheter reservert.',
      acceptPayments: 'Vi aksepterer:',
    },
    common: {
      loading: 'Laster...',
      error: 'Feil',
      handmade: 'Håndlaget',
      items: 'varer',
    },
    home: {
      featuredProducts: {
        title: 'Utvalgte Skatter',
        subtitle: 'Unike smykker skapt med sjel og inspirert av tradisjoner',
        viewAll: 'Vis alle smykker',
      },
      about: {
        title: 'Om Din Skatt',
        paragraph1: 'Hvert smykke er ikke bare et tilbehør, men en portal til våre forfedres historie.',
        paragraph2: 'Vi skaper autentiske smykker basert på ekte arkeologiske prøver, ved bruk av eldgamle teknikker og naturlige materialer.',
        paragraph3: 'Naturlig korall, 925 sølv, rav — hvert element er valgt med kjærlighet og respekt for tradisjonene i slaviske, viking- og keltiske kulturer.',
        learnMore: 'Les mer',
        quality: {
          title: 'Kvalitetsgaranti',
          description: 'Hvert smykke er laget av naturlige materialer',
        },
        handmade: {
          title: 'Håndlaget',
          description: 'Skapt med eldgamle teknikker',
        },
        freeShipping: {
          title: 'Frakt',
          description: 'I hele Den europeiske union',
        },
      },
      bonusSystem: {
        title: 'Bonussystem',
        subtitle: 'Tjen bonuser ved hvert kjøp',
        description: 'Registrer deg og tjen bonuspoeng ved hvert kjøp. Bruk dem til å betale opptil 20% av produktkostnader.',
        levels: {
          human: {
            name: 'Menneske',
            description: 'Startstatus',
            bonus: '1% bonus fra hvert kjøp',
          },
          elf: {
            name: 'Alv',
            description: 'Etter kjøp på 1000+ PLN',
            bonus: '2% bonus fra hvert kjøp',
            requirement: 'Krever: 1000 PLN',
          },
          dwarf: {
            name: 'Dverg',
            description: 'Etter kjøp på 5000+ PLN',
            bonus: '3% bonus fra hvert kjøp',
            requirement: 'Krever: 5000 PLN',
          },
        },
        benefits: {
          title: 'Registreringsfordeler',
          earn: 'Tjen bonuser ved hvert kjøp',
          use: 'Betal opptil 20% av produkter med bonuser',
          track: 'Spor ordrestatus',
        },
        cta: 'Registrer deg nå',
        register: 'Registrer',
      },
    },
    newsletter: {
      title: 'Motta Magiske Tilbud',
      subtitle: 'Abonner på vårt nyhetsbrev og vær først til å få vite om nye kolleksjoner og eksklusive rabatter',
      placeholder: 'Din e-post',
      subscribe: 'Abonner',
      subscribing: 'Vennligst vent...',
      success: {
        title: 'Takk for ditt abonnement!',
        message: 'Sjekk din e-post for bekreftelse',
      },
      privacy: 'Vi respekterer ditt personvern. Du kan avslutte abonnementet når som helst.',
    },
    about: {
      title: 'Om Skrynia Pani Darii',
      subtitle: 'Autentiske håndlagde smykker med sjel og historie',
      history: {
        title: 'Vår Historie',
        content: 'Hvert smykke i vår kolleksjon er ikke bare et tilbehør, men en portal til våre forfedres historie. Vi skaper autentiske smykker basert på ekte arkeologiske prøver, ved bruk av eldgamle teknikker og naturlige materialer.',
      },
      mission: {
        title: 'Vårt Oppdrag',
        content: 'Å bevare og formidle skjønnheten i slaviske, viking- og keltiske kulturer gjennom unike håndlagde smykker. Hvert smykke bærer symbolikk, styrke og visdom fra eldgamle tradisjoner.',
      },
      quality: {
        title: 'Kvalitet og Autentisitet',
        intro: 'Vi bruker kun naturlige materialer:',
        materials: {
          coral: 'Naturlig korall fra Middelhavet',
          silver: '925 sølv',
          amber: 'Baltisk rav',
          gemstone: 'Naturlige edelstener',
        },
        conclusion: 'Hvert smykke er skapt for hånd etter eldgamle teknikker og med respekt for våre forfedres tradisjoner.',
      },
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Har du spørsmål? Vi hjelper deg gjerne',
      form: {
        name: 'Navn',
        namePlaceholder: 'Ditt navn',
        email: 'E-post',
        emailPlaceholder: 'din@epost.no',
        subject: 'Emne',
        subjectPlaceholder: 'Meldingsemne',
        message: 'Melding',
        messagePlaceholder: 'Din melding...',
        submit: 'Send',
      },
      otherWays: 'Andre måter å kontakte oss på',
      location: 'Polen, Den europeiske union',
    },
    shipping: {
      title: 'Frakt & Betaling',
      subtitle: 'Informasjon om frakt og betalingsmetoder',
      delivery: {
        title: 'Frakt',
        intro: 'Vi sender bestillinger i hele Den europeiske union via pålitelige budtjenester.',
        free: 'Gratis frakt ved bestillinger over 1000 zł',
        standard: 'Standardfrakt: 50 zł (3-5 virkedager)',
        express: 'Expressfrakt: 100 zł (1-2 virkedager)',
      },
      payment: {
        title: 'Betalingsmetoder',
        intro: 'Vi aksepterer følgende betalingsmetoder:',
        cards: 'Kreditt-/debetkort (Visa, Mastercard)',
        paypal: 'PayPal',
        transfer: 'Bankoverføring',
        secure: 'Alle betalinger er beskyttet av SSL-kryptering',
      },
      returns: {
        title: 'Returer',
        intro: 'Vi vil at du skal være fornøyd med kjøpet ditt. Hvis du av en eller annen grunn ikke er fornøyd, kan du returnere varen innen 14 dager.',
        days: '14 dagers returrett',
        condition: 'Varen må være i originalstand',
        refund: 'Full refusjon',
      },
    },
    collectionsPage: {
      title: 'Smykkekolleksjoner',
      subtitle: 'Unike håndlagde smykker som kombinerer skjønnhet og symbolikk fra eldgamle kulturer',
      found: 'Fant',
      items: 'varer',
      filters: 'Filtre',
      sort: {
        newest: 'Nyeste',
        priceLow: 'Pris: lav → høy',
        priceHigh: 'Pris: høy → lav',
        name: 'Alfabetisk',
      },
      noResults: {
        title: 'Ingenting funnet',
        message: 'Prøv å endre filtre for å vise varer',
      },
    },
    filters: {
      title: 'Filtre',
      bySymbol: 'Etter Symbol',
      byMaterial: 'Etter Material',
      byCulture: 'Etter Kultur',
      price: 'Pris (zł)',
      clear: 'Fjern filtre',
      symbols: {
        love: 'Kjærlighet',
        protection: 'Beskyttelse',
        wealth: 'Rikdom',
        wisdom: 'Visdom',
      },
      materials: {
        coral: 'Korall',
        silver: 'Sølv',
        amber: 'Rav',
        gemstone: 'Edelstener',
      },
      cultures: {
        all: 'Alle',
        slavic: 'Slaviske',
        viking: 'Viking',
        celtic: 'Keltiske',
      },
    },
    product: {
      categories: {
        slavic: 'Slaviske',
        viking: 'Viking',
        celtic: 'Keltiske',
      },
      breadcrumb: {
        home: 'Hjem',
        collections: 'Kolleksjoner',
      },
      collection: 'kolleksjon',
      materials: 'Materialer',
      quantity: 'Antall:',
      addToCart: 'Legg i handlekurv',
      legend: 'Legende',
      specifications: 'Spesifikasjoner',
      related: 'Relaterte Produkter',
      quality: 'Kvalitetsgaranti',
      freeShipping: 'Gratis frakt i EU (3-5 dager)',
      viewingNow: 'personer ser nå',
      valueProps: {
        giftWrap: 'Gratis gaveinnpakning med hver bestilling',
        warranty: 'Garanti for originalitet og håndlaget arbeid',
        tracking: 'Enkel sporing i hvert leveringssteg',
        handmadeTooltipLabel: 'Om materialer',
        handmadeTooltip: 'Naturlige materialer: korall, 925 sølv og mer. Hvert smykke settes sammen for hånd.',
      },
      madeToOrder: {
        title: 'På bestilling',
        duration: 'Produksjonstid',
        orderButton: 'Bestill spesialtilvirkning',
        orderWithPayment: 'Bestill med 50% betaling',
        depositTitle: 'Depositum',
        depositDescription: '50% betaling ved bestilling, resterende beløp ved fullføring',
        formTitle: 'Bestillingsskjema',
        name: 'Navn',
        email: 'E-post',
        phone: 'Telefon',
        customText: 'Tekst for gravering (om ønskelig)',
        customTextPlaceholder: 'Skriv inn teksten du vil ha på smykket...',
        description: 'Beskrivelse / Kommentar',
        descriptionPlaceholder: 'Beskriv dine ønsker for produksjonen...',
        submit: 'Send bestilling',
        submitting: 'Sender...',
        cancel: 'Avbryt',
        success: 'Din bestilling er mottatt! Vi kontakter deg snart.',
      },
    },
    cart: {
      title: 'Handlekurv',
      empty: {
        title: 'Handlekurven er tom',
        message: 'Legg til smykker for å fortsette å handle',
        continue: 'Fortsett å handle',
      },
      subtotal: 'Delsum',
      shipping: 'Frakt',
      free: 'Gratis',
      total: 'Totalt',
      checkout: 'Gå til kassen',
      continueShopping: 'Fortsett å handle',
      remove: 'Fjern',
      addMoreForFreeShipping: 'Legg til {amount} zł til for gratis frakt',
      securePayment: 'Sikker betaling',
      deliveryDays: 'Levering 3-5 dager',
      progressiveDiscount: 'Progressiv rabatt',
      discount: 'Rabatt',
      subtotalBeforeDiscount: 'Delsum før rabatt',
      addMoreForDiscount: 'Legg til 1 vare til for -10% rabatt!',
      authReminder: {
        title: 'Registrer deg eller logg inn',
        message: 'Registrer deg for å tjene bonuser ved hvert kjøp og spore dine bestillinger',
        login: 'Logg inn',
        register: 'Registrer',
        benefits: 'Registreringsfordeler',
        bonusPoints: 'Tjen bonuser ved hvert kjøp',
        trackOrders: 'Spor ordrestatus',
        saveAddresses: 'Lagre leveringsadresser',
      },
    },
    legal: {
      terms: 'Vilkår',
      privacy: 'Personvernregler',
      withdrawal: 'Angrerett',
      acceptTerms: 'Jeg aksepterer vilkårene',
      acceptPrivacy: 'Jeg aksepterer personvernreglene',
      termsTitle: 'RuneBox Vilkår & Betingelser',
      privacyTitle: 'Personvernregler',
      withdrawalTitle: 'Angreretts skjema',
    },
    blog: {
      title: 'Rune box Blog',
      subtitle: 'Lær mer om tradisjoner, symboler og håndverk av etnisk smykker',
      loading: 'Laster artikler...',
      noPosts: 'Bloggartikler kommer snart',
      goToBlog: 'Gå til bloggen',
      viewAllPosts: 'Se alle blogginnlegg',
      readMore: 'Les mer',
    },
    constructor: {
      title: 'Halsbåndkonstruktør',
      beads: 'Perler',
      stone: 'Stein',
      hardware: 'Beslag',
      extra: 'Ekstra',
      loading: 'Laster...',
      noBeads: 'Ingen perler funnet',
      visualEditor: 'Visuell Editor',
      clasp: 'Lås',
      threads: 'Tråder',
      thread: 'Tråd',
      length: 'Lengde',
      addThread: 'Legg til tråd',
      deleteThread: 'Slett tråd',
      clear: 'Tøm',
      send: 'Send',
      save: 'Lagre',
      home: 'Hjem',
      quoteRequest: 'Forespørsel om Tilbud',
      settings: 'Innstillinger',
      threadCount: 'Trådantal',
      maxThreads: 'Maksimum: 5 tråder',
      activeThread: 'Aktiv Tråd',
      threadLength: 'Trådlengde',
      instruction: 'Instruksjon:',
      instruction1: 'Klikk på en perle til venstre for å legge den til',
      instruction2: 'Bruk Zoom for å zoome inn',
      instruction3: 'Klikk på en perle og trykk på Rotate',
      instruction4: 'Velg et lås i nedre panelen',
      instruction5: 'Lagre eller send forespørsel',
      saveSuccess: 'Konfigurasjon lagret!',
      saveError: 'Lagringsfel. Sjekk autentisering.',
      loginRequired: 'Vennligst logg inn for å lagre konfigurasjon',
      addBeadsFirst: 'Legg til perler til halsbåndet før du sender forespørsel!',
      selectClasp: 'Vennligst velg et lås!',
      threadOf: 'av',
      beadsOnThread: 'på tråd',
    },
    auth: {
      login: 'Logg inn',
      loginTitle: 'Innlogging',
      loginSubtitle: 'Logg inn på din konto',
      email: 'E-post',
      password: 'Passord',
      loginButton: 'Logg inn',
      loggingIn: 'Logger inn...',
      noAccount: 'Ingen konto?',
      registerLink: 'Registrer',
      errors: {
        incorrectCredentials: 'Feil e-post eller passord',
        accountNotActivated: 'Konto ikke aktivert. Vennligst bekreft e-posten din.',
        emailNotVerified: 'E-post ikke bekreftet. Vennligst sjekk e-posten din for bekreftelseslenke.',
        networkError: 'Kunne ikke koble til serveren',
        defaultError: 'Autentiseringsfeil',
      },
    },
    register: {
      title: 'Registrering',
      subtitle: 'Opprett en konto for å motta bonuser og spore bestillinger',
      fullName: 'Fullt navn',
      fullNamePlaceholder: 'Ola Nordmann',
      email: 'E-post',
      emailPlaceholder: 'example@email.com',
      password: 'Passord',
      passwordPlaceholder: 'Minimum 6 tegn',
      passwordHint: 'Minimum 6 tegn',
      confirmPassword: 'Bekreft passord',
      confirmPasswordPlaceholder: 'Gjenta passord',
      submit: 'Registrer',
      submitting: 'Registrerer...',
      success: {
        title: 'Registrering vellykket!',
        message: 'Vi har sendt en e-postbekreftelse til',
        redirecting: 'Omdirigerer til innloggingssiden...',
      },
      hasAccount: 'Har du allerede en konto?',
      loginLink: 'Logg inn',
      agreement: 'Ved å registrere deg godtar du våre',
      termsLink: 'vilkår for bruk',
      privacyLink: 'personvernregler',
      errors: {
        passwordsMismatch: 'Passordene stemmer ikke overens',
        passwordTooShort: 'Passordet må inneholde minst 6 tegn',
        defaultError: 'Registreringsfeil',
        serverError: 'Serverfeil. Prøv igjen senere eller kontakt support.',
      },
    },
    checkout: {
      title: 'Kasse',
      contactInfo: 'Kontaktinformasjon',
      email: 'E-post',
      fullName: 'Fullt navn',
      phone: 'Telefon',
      delivery: 'Levering',
      country: 'Land',
      countries: {
        AT: 'Østerrike',
        BE: 'Belgia',
        BG: 'Bulgaria',
        HR: 'Kroatia',
        CY: 'Kypros',
        CZ: 'Tsjekkia',
        DK: 'Danmark',
        EE: 'Estland',
        FI: 'Finland',
        FR: 'Frankrike',
        DE: 'Tyskland',
        GR: 'Hellas',
        HU: 'Ungarn',
        IE: 'Irland',
        IT: 'Italia',
        LV: 'Latvia',
        LT: 'Litauen',
        LU: 'Luxemburg',
        MT: 'Malta',
        NL: 'Nederland',
        PL: 'Polen',
        PT: 'Portugal',
        RO: 'Romania',
        SK: 'Slovakia',
        SI: 'Slovenia',
        ES: 'Spania',
        SE: 'Sverige',
        UA: 'Ukraina',
        GB: 'Storbritannia',
        US: 'USA',
      },
      deliveryMethod: 'Leveringsmetode',
      inpostLabel: 'InPost Paczkomat',
      inpostDescription: 'Henting fra pakkelager',
      novaposhtaLabel: 'Nova Poshta',
      novaposhtaDescription: 'Nova Poshta-filial',
      pocztaLabel: 'Poczta Polska',
      pocztaDescription: 'Hjemlevering',
      courierLabel: 'Bud',
      courierDescription: 'Budlevering',
      courierDescriptionUA: 'Budlevering',
      courierDescriptionOther: 'Budlevering',
      paczkomat: 'Paczkomat',
      paczkomatPlaceholder: 'Skriv inn paczkomat-kode eller adresse (f.eks. WAW01M)',
      paczkomatHint: '💡 I fremtiden vil du kunne velge en paczkomat fra kartet. For nå, skriv inn paczkomat-koden manuelt.',
      selectFromMap: 'Velg fra kart',
      changePoint: 'Endre',
      cancel: 'Avbryt',
      novaposhtaOffice: 'Filial',
      novaposhtaOfficePlaceholder: 'Skriv inn filialnummer (f.eks. Filial #1)',
      novaposhtaOfficeHint: '💡 Snart vil du kunne velge en filial fra kartet. For nå, skriv inn filialadressen manuelt.',
      address: 'Adresse',
      addressPlaceholder: 'Hovedgata 1',
      addressPlaceholderUA: 'Khreshchatyk St. 1',
      address2: 'Adresse (tillegg)',
      address2Placeholder: 'Leilighet, kontor',
      address2PlaceholderUA: 'Leilighet, kontor',
      city: 'By',
      cityPlaceholder: 'Oslo',
      cityPlaceholderUA: 'Kyiv',
      postalCode: 'Postnummer',
      postalCodePlaceholder: '0001',
      postalCodePlaceholderUA: '01001',
      billingSameAsShipping: 'Faktureringsadresse samme som leveringsadresse',
      billingAddress: 'Faktureringsadresse',
      paymentMethod: 'Betalingsmetode',
      paymentStripe: 'Stripe (Kort)',
      paymentP24: 'Przelewy24',
      paymentBLIK: 'BLIK',
      paymentBankTransfer: 'Bankoverføring',
      orderNotes: 'Ordrenotater',
      orderNotesPlaceholder: 'Tilleggsønske eller informasjon...',
      orderSummary: 'Din bestilling',
      subtotal: 'Delsum',
      shipping: 'Frakt',
      total: 'Totalt',
      submit: 'Send bestilling',
      submitting: 'Behandler...',
      backToCart: '← Tilbake til handlekurv',
      errors: {
        defaultError: 'Ordrebehandlingsfeil',
      },
    },
    orderSuccess: {
      loading: 'Laster...',
      title: 'Bestilling akseptert!',
      orderNumber: 'Bestillingsnummer',
      thankYou: 'Takk for din bestilling! Vi har sendt en bekreftelse til din e-post.',
      status: 'Status',
      paymentMethod: 'Betalingsmetode',
      total: 'Totalt',
      backToHome: 'Tilbake til hjem',
      viewCollections: 'Se kolleksjoner',
    },
    adminOrders: {
      title: 'Bestillinger',
      subtitle: 'Administrer alle bestillinger',
      searchPlaceholder: 'Søk etter nummer, navn eller e-post...',
      allStatuses: 'Alle statuser',
      statusPending: 'Venter',
      statusPaid: 'Betalt',
      statusShipped: 'Sendt',
      statusDelivered: 'Levert',
      statusCancelled: 'Kansellert',
      loading: 'Laster...',
      noOrders: 'Ingen bestillinger funnet.',
      tableNumber: 'Nummer',
      tableClient: 'Klient',
      tableAmount: 'Beløp',
      tableStatus: 'Status',
      tablePayment: 'Betaling',
      tableDate: 'Dato',
      tableActions: 'Handlinger',
      edit: 'Rediger',
      totalOrders: 'Totalt antall bestillinger',
      totalAmount: 'Totalt beløp',
      pending: 'Venter',
      paid: 'Betalt',
      orderDetails: 'Bestilling',
      customerInfo: 'Kundeinformasjon',
      orderInfo: 'Bestillingsdetaljer',
      subtotal: 'Delsum',
      shipping: 'Frakt',
      total: 'Totalt',
      updateStatus: 'Oppdater status',
      orderStatus: 'Bestillingsstatus',
      paymentStatus: 'Betalingsstatus',
      paymentCompleted: 'Fullført',
      paymentFailed: 'Mislyktes',
      paymentRefunded: 'Refundert',
      close: 'Lukk',
    },
    account: {
      title: 'Personlig Konto',
      subtitle: 'Administrer din profil og bestillinger',
      logout: 'Logg ut',
      loading: 'Laster...',
      errorLoading: 'Feil ved lasting av profil',
      failedToLoad: 'Kunne ikke laste profil',
      shippingAddress: 'Leveringsadresse',
      inpostPaczkomat: 'InPost Paczkomat:',
      loyaltyStatus: 'Lojalitetsstatus:',
      bonusPoints: 'poeng',
      bonusPointsLabel: 'Bonuspoeng',
      toStatus: 'Til status',
      remaining: 'Gjenstående:',
      totalOrders: 'Totalt antall bestillinger',
      inProcessing: 'Under behandling',
      myOrders: 'Mine bestillinger',
      noOrders: 'Du har ingen bestillinger ennå',
      goToCatalog: 'Gå til katalog',
      orderNumber: 'Bestilling #',
      item: 'vare',
      items: 'varer',
      tracking: 'Sporing:',
      openOnCarrierSite: 'Åpne på transportfirmaets nettsted',
      trackingHistory: 'Sporingshistorikk:',
      status: {
        completed: 'Fullført',
        shipped: 'Sendt',
        inProcessing: 'Under behandling',
        paid: 'Betalt',
        notPaid: 'Ikke betalt',
      },
      loyaltyStatuses: {
        human: 'Menneske',
        elf: 'Alv',
        dwarf: 'Dverg',
      },
    },
  },
  DK: {
    nav: {
      collections: 'Kollektioner',
      constructor: 'Halsbåndskonstruktør',
      about: 'Om os',
      contact: 'Kontakt',
    },
    hero: {
      title: 'Rune box',
      subtitle: 'Autentiske Arvskatte',
      cta: 'Åbn Kollektionen',
      tagline: 'Hvert smykke er en portal til vores forfædres historie',
    },
    collections: {
      title: 'Arvskollektioner',
      subtitle: 'Tre kulturer. Én arv. Utallige historier.',
      slavic: 'Slaviske',
      slavicTagline: 'Symboler for styrke og beskyttelse',
      viking: 'Viking',
      vikingTagline: 'Mod og krigerens skæbne',
      celtic: 'Keltiske',
      celticTagline: 'Treenighed og evighed',
      viewAll: 'Se alle kollektioner',
    },
    footer: {
      navigation: 'Navigation',
      contact: 'Kontakt',
      languages: 'Sprog',
      collections: 'Kollektioner',
      about: 'Om os',
      shipping: 'Fragt',
      brandDescription: 'Autentiske håndlavede smykker',
      location: 'Polen, EU',
      copyright: 'Rune box. Alle rettigheder forbeholdes.',
      acceptPayments: 'Vi accepterer:',
    },
    common: {
      loading: 'Indlæser...',
      error: 'Fejl',
      handmade: 'Håndlavet',
      items: 'varer',
    },
    home: {
      featuredProducts: {
        title: 'Udvalgte Skatte',
        subtitle: 'Unikke smykker skabt med sjæl og inspireret af traditioner',
        viewAll: 'Se alle smykker',
      },
      about: {
        title: 'Om Din Skat',
        paragraph1: 'Hvert smykke er ikke bare et tilbehør, men en portal til vores forfædres historie.',
        paragraph2: 'Vi skaber autentiske smykker baseret på ægte arkæologiske prøver ved hjælp af ældgamle teknikker og naturlige materialer.',
        paragraph3: 'Naturlig koral, 925 sølv, rav — hvert element er valgt med kærlighed og respekt for traditionerne i slaviske, viking- og keltiske kulturer.',
        learnMore: 'Læs mere',
        quality: {
          title: 'Kvalitetsgaranti',
          description: 'Hvert smykke er lavet af naturlige materialer',
        },
        handmade: {
          title: 'Håndlavet',
          description: 'Skabt med ældgamle teknikker',
        },
        freeShipping: {
          title: 'Fragt',
          description: 'I hele Den Europæiske Union',
        },
      },
      bonusSystem: {
        title: 'Bonussystem',
        subtitle: 'Tjen bonusser ved hvert køb',
        description: 'Registrer dig og tjen bonuspoint ved hvert køb. Brug dem til at betale op til 20% af produktomkostninger.',
        levels: {
          human: {
            name: 'Menneske',
            description: 'Startstatus',
            bonus: '1% bonus fra hvert køb',
          },
          elf: {
            name: 'Alf',
            description: 'Efter køb på 1000+ PLN',
            bonus: '2% bonus fra hvert køb',
            requirement: 'Kræver: 1000 PLN',
          },
          dwarf: {
            name: 'Dværg',
            description: 'Efter køb på 5000+ PLN',
            bonus: '3% bonus fra hvert køb',
            requirement: 'Kræver: 5000 PLN',
          },
        },
        benefits: {
          title: 'Registreringsfordele',
          earn: 'Tjen bonusser ved hvert køb',
          use: 'Betal op til 20% af produkter med bonusser',
          track: 'Spor ordrestatus',
        },
        cta: 'Registrer dig nu',
        register: 'Registrer',
      },
    },
    newsletter: {
      title: 'Modtag Magiske Tilbud',
      subtitle: 'Abonner på vores nyhedsbrev og vær den første til at høre om nye kollektioner og eksklusive rabatter',
      placeholder: 'Din e-mail',
      subscribe: 'Abonner',
      subscribing: 'Vent venligst...',
      success: {
        title: 'Tak for dit abonnement!',
        message: 'Tjek din e-mail for bekræftelse',
      },
      privacy: 'Vi respekterer dit privatliv. Du kan afmelde dig når som helst.',
    },
    about: {
      title: 'Om Skrynia Pani Darii',
      subtitle: 'Autentiske håndlavede smykker med sjæl og historie',
      history: {
        title: 'Vores Historie',
        content: 'Hvert smykke i vores kollektion er ikke bare et tilbehør, men en portal til vores forfædres historie. Vi skaber autentiske smykker baseret på ægte arkæologiske prøver ved hjælp af ældgamle teknikker og naturlige materialer.',
      },
      mission: {
        title: 'Vores Mission',
        content: 'At bevare og formidle skønheden i slaviske, viking- og keltiske kulturer gennem unikke håndlavede smykker. Hvert smykke bærer symbolik, styrke og visdom fra ældgamle traditioner.',
      },
      quality: {
        title: 'Kvalitet og Autenticitet',
        intro: 'Vi bruger kun naturlige materialer:',
        materials: {
          coral: 'Naturlig koral fra Middelhavet',
          silver: '925 sølv',
          amber: 'Baltisk rav',
          gemstone: 'Naturlige ædelstene',
        },
        conclusion: 'Hvert smykke er skabt i hånden efter ældgamle teknikker og med respekt for vores forfædres traditioner.',
      },
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Har du spørgsmål? Vi hjælper dig gerne',
      form: {
        name: 'Navn',
        namePlaceholder: 'Dit navn',
        email: 'E-mail',
        emailPlaceholder: 'din@email.dk',
        subject: 'Emne',
        subjectPlaceholder: 'Beskedens emne',
        message: 'Besked',
        messagePlaceholder: 'Din besked...',
        submit: 'Send',
      },
      otherWays: 'Andre måder at kontakte os på',
      location: 'Polen, Den Europæiske Union',
    },
    shipping: {
      title: 'Fragt & Betaling',
      subtitle: 'Information om fragt og betalingsmetoder',
      delivery: {
        title: 'Fragt',
        intro: 'Vi sender ordrer i hele Den Europæiske Union via pålidelige budtjenester.',
        free: 'Gratis fragt ved bestillinger over 1000 zł',
        standard: 'Standardfragt: 50 zł (3-5 hverdage)',
        express: 'Expressfragt: 100 zł (1-2 hverdage)',
      },
      payment: {
        title: 'Betalingsmetoder',
        intro: 'Vi accepterer følgende betalingsmetoder:',
        cards: 'Kredit-/debetkort (Visa, Mastercard)',
        paypal: 'PayPal',
        transfer: 'Bankoverførsel',
        secure: 'Alle betalinger er beskyttet af SSL-kryptering',
      },
      returns: {
        title: 'Returneringer',
        intro: 'Vi vil gerne have, at du er tilfreds med dit køb. Hvis du af en eller anden grund ikke er tilfreds, kan du returnere varen inden for 14 dage.',
        days: '14 dages returret',
        condition: 'Varen skal være i original stand',
        refund: 'Fuld refusion',
      },
    },
    collectionsPage: {
      title: 'Smykkekollektioner',
      subtitle: 'Unikke håndlavede smykker der kombinerer skønhed og symbolik fra ældgamle kulturer',
      found: 'Fandt',
      items: 'varer',
      filters: 'Filtre',
      sort: {
        newest: 'Nyeste',
        priceLow: 'Pris: lav → høj',
        priceHigh: 'Pris: høj → lav',
        name: 'Alfabetisk',
      },
      noResults: {
        title: 'Intet fundet',
        message: 'Prøv at ændre filtre for at se varer',
      },
    },
    filters: {
      title: 'Filtre',
      bySymbol: 'Efter Symbol',
      byMaterial: 'Efter Materiale',
      byCulture: 'Efter Kultur',
      price: 'Pris (zł)',
      clear: 'Ryd filtre',
      symbols: {
        love: 'Kærlighed',
        protection: 'Beskyttelse',
        wealth: 'Rigdom',
        wisdom: 'Visdom',
      },
      materials: {
        coral: 'Koral',
        silver: 'Sølv',
        amber: 'Rav',
        gemstone: 'Ædelstene',
      },
      cultures: {
        all: 'Alle',
        slavic: 'Slaviske',
        viking: 'Viking',
        celtic: 'Keltiske',
      },
    },
    product: {
      categories: {
        slavic: 'Slaviske',
        viking: 'Viking',
        celtic: 'Keltiske',
      },
      breadcrumb: {
        home: 'Hjem',
        collections: 'Kollektioner',
      },
      collection: 'kollektion',
      materials: 'Materialer',
      quantity: 'Antal:',
      addToCart: 'Læg i kurv',
      legend: 'Legende',
      specifications: 'Specifikationer',
      related: 'Relaterede Produkter',
      quality: 'Kvalitetsgaranti',
      freeShipping: 'Gratis fragt i EU (3-5 dage)',
      viewingNow: 'personer ser nu',
      valueProps: {
        giftWrap: 'Gratis gaveindpakning til hver bestilling',
        warranty: 'Garanti for originalitet og håndlavet arbejde',
        tracking: 'Nem tracking af hvert trin i leveringen',
        handmadeTooltipLabel: 'Om materialer',
        handmadeTooltip: 'Naturlige materialer: koral, 925 sølv og mere. Hvert smykke samles i hånden.',
      },
      madeToOrder: {
        title: 'På bestilling',
        duration: 'Produktionstid',
        orderButton: 'Bestil specialfremstilling',
        orderWithPayment: 'Bestil med 50% betaling',
        depositTitle: 'Depositum',
        depositDescription: '50% betaling ved bestilling, resterende beløb ved færdiggørelse',
        formTitle: 'Bestillingsformular',
        name: 'Navn',
        email: 'E-mail',
        phone: 'Telefon',
        customText: 'Tekst til gravering (hvis ønsket)',
        customTextPlaceholder: 'Indtast den tekst, du vil have på smykket...',
        description: 'Beskrivelse / Kommentar',
        descriptionPlaceholder: 'Beskriv dine ønsker til fremstillingen...',
        submit: 'Send bestilling',
        submitting: 'Sender...',
        cancel: 'Annuller',
        success: 'Din bestilling er modtaget! Vi kontakter dig snart.',
      },
    },
    cart: {
      title: 'Kurv',
      empty: {
        title: 'Kurven er tom',
        message: 'Tilføj smykker for at fortsætte med at handle',
        continue: 'Fortsæt med at handle',
      },
      subtotal: 'Delsum',
      shipping: 'Fragt',
      free: 'Gratis',
      total: 'Total',
      checkout: 'Gå til kassen',
      continueShopping: 'Fortsæt med at handle',
      remove: 'Fjern',
      addMoreForFreeShipping: 'Tilføj {amount} zł mere for gratis fragt',
      securePayment: 'Sikker betaling',
      deliveryDays: 'Levering 3-5 dage',
      progressiveDiscount: 'Progressiv rabat',
      discount: 'Rabat',
      subtotalBeforeDiscount: 'Delsum før rabat',
      addMoreForDiscount: 'Tilføj 1 vare mere for -10% rabat!',
      authReminder: {
        title: 'Registrer dig eller log ind',
        message: 'Registrer dig for at tjene bonusser ved hvert køb og spore dine bestillinger',
        login: 'Log ind',
        register: 'Registrer',
        benefits: 'Registreringsfordele',
        bonusPoints: 'Tjen bonusser ved hvert køb',
        trackOrders: 'Spor ordrestatus',
        saveAddresses: 'Gem leveringsadresser',
      },
    },
    legal: {
      terms: 'Vilkår',
      privacy: 'Fortrolighedspolitik',
      withdrawal: 'Fortrydelsesret',
      acceptTerms: 'Jeg accepterer vilkårene',
      acceptPrivacy: 'Jeg accepterer fortrolighedspolitikken',
      termsTitle: 'RuneBox Vilkår & Betingelser',
      privacyTitle: 'Fortrolighedspolitik',
      withdrawalTitle: 'Fortrydelsesformular',
    },
    blog: {
      title: 'Blog Rune box',
      subtitle: 'Lær mere om traditioner, symboler og håndværk af etnisk smykker',
      loading: 'Indlæser artikler...',
      noPosts: 'Blogindlæg kommer snart',
      goToBlog: 'Gå til bloggen',
      viewAllPosts: 'Se alle blogindlæg',
      readMore: 'Læs mere',
    },
    constructor: {
      title: 'Halsbåndskonstruktør',
      beads: 'Perler',
      stone: 'Sten',
      hardware: 'Beslag',
      extra: 'Ekstra',
      loading: 'Indlæser...',
      noBeads: 'Ingen perler fundet',
      visualEditor: 'Visuel Editor',
      clasp: 'Lås',
      threads: 'Tråde',
      thread: 'Tråd',
      length: 'Længde',
      addThread: 'Tilføj tråd',
      deleteThread: 'Slet tråd',
      clear: 'Ryd',
      send: 'Send',
      save: 'Gem',
      home: 'Hjem',
      quoteRequest: 'Anmodning om Tilbud',
      settings: 'Indstillinger',
      threadCount: 'Trådantal',
      maxThreads: 'Maksimum: 5 tråde',
      activeThread: 'Aktiv Tråd',
      threadLength: 'Trådlængde',
      instruction: 'Instruktion:',
      instruction1: 'Klik på en perle til venstre for at tilføje den',
      instruction2: 'Brug Zoom til at zoome ind',
      instruction3: 'Klik på en perle og tryk på Rotate',
      instruction4: 'Vælg et lås i nederste panel',
      instruction5: 'Gem eller send anmodning',
      saveSuccess: 'Konfiguration gemt!',
      saveError: 'Gemmerfejl. Tjek autorisering.',
      loginRequired: 'Log venligst ind for at gemme konfiguration',
      addBeadsFirst: 'Tilføj perler til halsbåndet før du sender anmodning!',
      selectClasp: 'Vælg venligst et lås!',
      threadOf: 'af',
      beadsOnThread: 'på tråd',
    },
    auth: {
      login: 'Log ind',
      loginTitle: 'Login',
      loginSubtitle: 'Log ind på din konto',
      email: 'E-mail',
      password: 'Adgangskode',
      loginButton: 'Log ind',
      loggingIn: 'Logger ind...',
      noAccount: 'Ingen konto?',
      registerLink: 'Registrer',
      errors: {
        incorrectCredentials: 'Forkert e-mail eller adgangskode',
        accountNotActivated: 'Konto ikke aktiveret. Verificer venligst din e-mail.',
        emailNotVerified: 'E-mail ikke verificeret. Tjek venligst din e-mail for bekræftelseslink.',
        networkError: 'Kunne ikke forbinde til serveren',
        defaultError: 'Godkendelsesfejl',
      },
    },
    register: {
      title: 'Registrering',
      subtitle: 'Opret en konto for at modtage bonusser og spore ordrer',
      fullName: 'Fulde navn',
      fullNamePlaceholder: 'Ole Nielsen',
      email: 'E-mail',
      emailPlaceholder: 'example@email.com',
      password: 'Adgangskode',
      passwordPlaceholder: 'Minimum 6 tegn',
      passwordHint: 'Minimum 6 tegn',
      confirmPassword: 'Bekræft adgangskode',
      confirmPasswordPlaceholder: 'Gentag adgangskode',
      submit: 'Registrer',
      submitting: 'Registrerer...',
      success: {
        title: 'Registrering vellykket!',
        message: 'Vi har sendt en e-mailbekræftelse til',
        redirecting: 'Omdirigerer til loginside...',
      },
      hasAccount: 'Har du allerede en konto?',
      loginLink: 'Log ind',
      agreement: 'Ved at registrere dig accepterer du vores',
      termsLink: 'vilkår for brug',
      privacyLink: 'fortrolighedspolitik',
      errors: {
        passwordsMismatch: 'Adgangskoderne stemmer ikke overens',
        passwordTooShort: 'Adgangskoden skal indeholde mindst 6 tegn',
        defaultError: 'Registreringsfejl',
        serverError: 'Serverfejl. Prøv igen senere eller kontakt support.',
      },
    },
    checkout: {
      title: 'Kasse',
      contactInfo: 'Kontaktinformation',
      email: 'E-mail',
      fullName: 'Fulde navn',
      phone: 'Telefon',
      delivery: 'Levering',
      country: 'Land',
      countries: {
        AT: 'Østrig',
        BE: 'Belgien',
        BG: 'Bulgarien',
        HR: 'Kroatien',
        CY: 'Cypern',
        CZ: 'Tjekkiet',
        DK: 'Danmark',
        EE: 'Estland',
        FI: 'Finland',
        FR: 'Frankrig',
        DE: 'Tyskland',
        GR: 'Grækenland',
        HU: 'Ungarn',
        IE: 'Irland',
        IT: 'Italien',
        LV: 'Letland',
        LT: 'Litauen',
        LU: 'Luxemburg',
        MT: 'Malta',
        NL: 'Holland',
        PL: 'Polen',
        PT: 'Portugal',
        RO: 'Rumænien',
        SK: 'Slovakiet',
        SI: 'Slovenien',
        ES: 'Spanien',
        SE: 'Sverige',
        UA: 'Ukraine',
        GB: 'Storbritannien',
        US: 'USA',
      },
      deliveryMethod: 'Leveringsmetode',
      inpostLabel: 'InPost Paczkomat',
      inpostDescription: 'Afhentning fra pakkelager',
      novaposhtaLabel: 'Nova Poshta',
      novaposhtaDescription: 'Nova Poshta-filial',
      pocztaLabel: 'Poczta Polska',
      pocztaDescription: 'Hjemmelevering',
      courierLabel: 'Kurer',
      courierDescription: 'Kurerlevering',
      courierDescriptionUA: 'Kurerlevering',
      courierDescriptionOther: 'Kurerlevering',
      paczkomat: 'Paczkomat',
      paczkomatPlaceholder: 'Indtast paczkomat-kode eller adresse (f.eks. WAW01M)',
      paczkomatHint: '💡 I fremtiden vil du kunne vælge en paczkomat fra kortet. For nu, indtast paczkomat-koden manuelt.',
      selectFromMap: 'Vælg fra kort',
      changePoint: 'Ændre',
      cancel: 'Annuller',
      novaposhtaOffice: 'Filial',
      novaposhtaOfficePlaceholder: 'Indtast filialnummer (f.eks. Filial #1)',
      novaposhtaOfficeHint: '💡 Snart vil du kunne vælge en filial fra kortet. For nu, indtast filialadressen manuelt.',
      address: 'Adresse',
      addressPlaceholder: 'Hovedgaden 1',
      addressPlaceholderUA: 'Khreshchatyk St. 1',
      address2: 'Adresse (tillæg)',
      address2Placeholder: 'Lejlighed, kontor',
      address2PlaceholderUA: 'Lejlighed, kontor',
      city: 'By',
      cityPlaceholder: 'København',
      cityPlaceholderUA: 'Kyiv',
      postalCode: 'Postnummer',
      postalCodePlaceholder: '1000',
      postalCodePlaceholderUA: '01001',
      billingSameAsShipping: 'Faktureringsadresse samme som leveringsadresse',
      billingAddress: 'Faktureringsadresse',
      paymentMethod: 'Betalingsmetode',
      paymentStripe: 'Stripe (Kort)',
      paymentP24: 'Przelewy24',
      paymentBLIK: 'BLIK',
      paymentBankTransfer: 'Bankoverførsel',
      orderNotes: 'Ordrenotater',
      orderNotesPlaceholder: 'Yderligere ønsker eller information...',
      orderSummary: 'Din ordre',
      subtotal: 'Delsum',
      shipping: 'Fragt',
      total: 'I alt',
      submit: 'Send ordre',
      submitting: 'Behandler...',
      backToCart: '← Tilbage til kurv',
      errors: {
        defaultError: 'Ordrebehandlingsfejl',
      },
    },
    orderSuccess: {
      loading: 'Indlæser...',
      title: 'Ordre accepteret!',
      orderNumber: 'Ordrenummer',
      thankYou: 'Tak for din ordre! Vi har sendt en bekræftelse til din e-mail.',
      status: 'Status',
      paymentMethod: 'Betalingsmetode',
      total: 'I alt',
      backToHome: 'Tilbage til hjem',
      viewCollections: 'Se kollektioner',
    },
    adminOrders: {
      title: 'Ordre',
      subtitle: 'Administrer alle ordre',
      searchPlaceholder: 'Søg efter nummer, navn eller e-mail...',
      allStatuses: 'Alle statuser',
      statusPending: 'Afventer',
      statusPaid: 'Betalt',
      statusShipped: 'Sendt',
      statusDelivered: 'Leveret',
      statusCancelled: 'Annulleret',
      loading: 'Indlæser...',
      noOrders: 'Ingen ordre fundet.',
      tableNumber: 'Nummer',
      tableClient: 'Klient',
      tableAmount: 'Beløb',
      tableStatus: 'Status',
      tablePayment: 'Betaling',
      tableDate: 'Dato',
      tableActions: 'Handlinger',
      edit: 'Rediger',
      totalOrders: 'Samlet antal ordre',
      totalAmount: 'Samlet beløb',
      pending: 'Afventer',
      paid: 'Betalt',
      orderDetails: 'Ordre',
      customerInfo: 'Kundeinformation',
      orderInfo: 'Ordredetaljer',
      subtotal: 'Subtotal',
      shipping: 'Fragt',
      total: 'I alt',
      updateStatus: 'Opdater status',
      orderStatus: 'Ordrestatus',
      paymentStatus: 'Betalingsstatus',
      paymentCompleted: 'Gennemført',
      paymentFailed: 'Mislykkedes',
      paymentRefunded: 'Refunderet',
      close: 'Luk',
    },
    account: {
      title: 'Personlig Konto',
      subtitle: 'Administrer din profil og ordrer',
      logout: 'Log ud',
      loading: 'Indlæser...',
      errorLoading: 'Fejl ved indlæsning af profil',
      failedToLoad: 'Kunne ikke indlæse profil',
      shippingAddress: 'Leveringsadresse',
      inpostPaczkomat: 'InPost Paczkomat:',
      loyaltyStatus: 'Loyalitetsstatus:',
      bonusPoints: 'point',
      bonusPointsLabel: 'Bonuspoint',
      toStatus: 'Til status',
      remaining: 'Resterende:',
      totalOrders: 'Samlet antal ordrer',
      inProcessing: 'Under behandling',
      myOrders: 'Mine ordrer',
      noOrders: 'Du har ingen ordrer endnu',
      goToCatalog: 'Gå til katalog',
      orderNumber: 'Ordre #',
      item: 'vare',
      items: 'varer',
      tracking: 'Sporing:',
      openOnCarrierSite: 'Åbn på transportfirmaets hjemmeside',
      trackingHistory: 'Sporingshistorik:',
      status: {
        completed: 'Gennemført',
        shipped: 'Afsendt',
        inProcessing: 'Under behandling',
        paid: 'Betalt',
        notPaid: 'Ikke betalt',
      },
      loyaltyStatuses: {
        human: 'Menneske',
        elf: 'Elf',
        dwarf: 'Dværg',
      },
    },
  },
  FR: {
    nav: {
      collections: 'Collections',
      constructor: 'Constructeur de colliers',
      about: 'À propos',
      contact: 'Contact',
    },
    hero: {
      title: 'Rune box',
      subtitle: 'Trésors Authentiques du Patrimoine',
      cta: 'Ouvrir la Collection',
      tagline: 'Chaque bijou est un portail vers l\'histoire de nos ancêtres',
    },
    collections: {
      title: 'Collections Patrimoniales',
      subtitle: 'Trois cultures. Un patrimoine. D\'innombrables histoires.',
      slavic: 'Slaves',
      slavicTagline: 'Symboles de force et de protection',
      viking: 'Viking',
      vikingTagline: 'Courage et destin des guerriers',
      celtic: 'Celtiques',
      celticTagline: 'Trinité et éternité',
      viewAll: 'Voir toutes les collections',
    },
    footer: {
      navigation: 'Navigation',
      contact: 'Contact',
      languages: 'Langues',
      collections: 'Collections',
      about: 'À propos',
      shipping: 'Livraison',
      brandDescription: 'Bijoux artisanaux authentiques',
      location: 'Pologne, UE',
      copyright: 'Rune box. Tous droits réservés.',
      acceptPayments: 'Nous acceptons:',
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      handmade: 'Fait main',
      items: 'articles',
    },
    home: {
      featuredProducts: {
        title: 'Trésors Sélectionnés',
        subtitle: 'Des pièces uniques créées avec âme et inspirées par les traditions',
        viewAll: 'Voir tous les bijoux',
      },
      about: {
        title: 'À Propos de Votre Trésor',
        paragraph1: 'Chaque bijou n\'est pas seulement un accessoire, mais un portail vers l\'histoire de nos ancêtres.',
        paragraph2: 'Nous créons des pièces authentiques basées sur de véritables échantillons archéologiques, en utilisant des techniques anciennes et des matériaux naturels.',
        paragraph3: 'Corail naturel, argent 925, ambre — chaque élément est choisi avec amour et respect pour les traditions des cultures slaves, vikings et celtiques.',
        learnMore: 'En savoir plus',
        quality: {
          title: 'Garantie de Qualité',
          description: 'Chaque bijou est fabriqué avec des matériaux naturels',
        },
        handmade: {
          title: 'Fait Main',
          description: 'Créé selon des techniques anciennes',
        },
        freeShipping: {
          title: 'Livraison',
          description: 'Dans toute l\'Union Européenne',
        },
      },
      bonusSystem: {
        title: 'Système de Bonus',
        subtitle: 'Gagnez des bonus à chaque achat',
        description: 'Inscrivez-vous et gagnez des points bonus à chaque achat. Utilisez-les pour payer jusqu\'à 20% du coût des produits.',
        levels: {
          human: {
            name: 'Humain',
            description: 'Statut de départ',
            bonus: '1% de bonus sur chaque achat',
          },
          elf: {
            name: 'Elfe',
            description: 'Après des achats de 1000+ PLN',
            bonus: '2% de bonus sur chaque achat',
            requirement: 'Nécessite: 1000 PLN',
          },
          dwarf: {
            name: 'Nain',
            description: 'Après des achats de 5000+ PLN',
            bonus: '3% de bonus sur chaque achat',
            requirement: 'Nécessite: 5000 PLN',
          },
        },
        benefits: {
          title: 'Avantages de l\'Inscription',
          earn: 'Gagnez des bonus à chaque achat',
          use: 'Payez jusqu\'à 20% des produits avec des bonus',
          track: 'Suivez le statut des commandes',
        },
        cta: 'S\'inscrire maintenant',
        register: 'S\'inscrire',
      },
    },
    newsletter: {
      title: 'Recevez des Offres Magiques',
      subtitle: 'Abonnez-vous à notre newsletter et soyez le premier informé des nouvelles collections et des remises exclusives',
      placeholder: 'Votre e-mail',
      subscribe: 'S\'abonner',
      subscribing: 'Veuillez patienter...',
      success: {
        title: 'Merci de votre abonnement!',
        message: 'Vérifiez votre e-mail pour confirmation',
      },
      privacy: 'Nous respectons votre vie privée. Vous pouvez vous désabonner à tout moment.',
    },
    about: {
      title: 'À Propos de Skrynia Pani Darii',
      subtitle: 'Bijoux artisanaux authentiques avec âme et histoire',
      history: {
        title: 'Notre Histoire',
        content: 'Chaque bijou de notre collection n\'est pas seulement un accessoire, mais un portail vers l\'histoire de nos ancêtres. Nous créons des pièces authentiques basées sur de véritables échantillons archéologiques, en utilisant des techniques anciennes et des matériaux naturels.',
      },
      mission: {
        title: 'Notre Mission',
        content: 'Préserver et transmettre la beauté des cultures slaves, vikings et celtiques à travers des pièces artisanales uniques. Chaque bijou porte la symbolique, la force et la sagesse des traditions anciennes.',
      },
      quality: {
        title: 'Qualité et Authenticité',
        intro: 'Nous utilisons uniquement des matériaux naturels:',
        materials: {
          coral: 'Corail naturel de la Méditerranée',
          silver: 'Argent 925',
          amber: 'Ambre de la Baltique',
          gemstone: 'Pierres précieuses naturelles',
        },
        conclusion: 'Chaque pièce est créée à la main selon des techniques anciennes et avec respect pour les traditions de nos ancêtres.',
      },
    },
    contact: {
      title: 'Contact',
      subtitle: 'Vous avez des questions? Nous sommes toujours heureux de vous aider',
      form: {
        name: 'Nom',
        namePlaceholder: 'Votre nom',
        email: 'E-mail',
        emailPlaceholder: 'votre@email.fr',
        subject: 'Sujet',
        subjectPlaceholder: 'Sujet du message',
        message: 'Message',
        messagePlaceholder: 'Votre message...',
        submit: 'Envoyer',
      },
      otherWays: 'Autres moyens de nous contacter',
      location: 'Pologne, Union Européenne',
    },
    shipping: {
      title: 'Livraison & Paiement',
      subtitle: 'Informations sur la livraison et les modes de paiement',
      delivery: {
        title: 'Livraison',
        intro: 'Nous expédions les commandes dans toute l\'Union Européenne via des services de messagerie fiables.',
        free: 'Livraison gratuite sur les commandes de plus de 1000 zł',
        standard: 'Livraison standard: 50 zł (3-5 jours ouvrables)',
        express: 'Livraison express: 100 zł (1-2 jours ouvrables)',
      },
      payment: {
        title: 'Modes de Paiement',
        intro: 'Nous acceptons les modes de paiement suivants:',
        cards: 'Cartes de crédit/débit (Visa, Mastercard)',
        paypal: 'PayPal',
        transfer: 'Virement bancaire',
        secure: 'Tous les paiements sont protégés par cryptage SSL',
      },
      returns: {
        title: 'Retours',
        intro: 'Nous voulons que vous soyez satisfait de votre achat. Si pour une raison quelconque vous n\'êtes pas satisfait, vous pouvez retourner l\'article dans les 14 jours.',
        days: '14 jours pour retourner',
        condition: 'L\'article doit être dans son état d\'origine',
        refund: 'Remboursement intégral',
      },
    },
    collectionsPage: {
      title: 'Collections de Bijoux',
      subtitle: 'Pièces artisanales uniques combinant beauté et symbolique des cultures anciennes',
      found: 'Trouvé',
      items: 'articles',
      filters: 'Filtres',
      sort: {
        newest: 'Plus récents',
        priceLow: 'Prix: bas → élevé',
        priceHigh: 'Prix: élevé → bas',
        name: 'Alphabétiquement',
      },
      noResults: {
        title: 'Rien trouvé',
        message: 'Essayez de modifier les filtres pour voir les articles',
      },
    },
    filters: {
      title: 'Filtres',
      bySymbol: 'Par Symbole',
      byMaterial: 'Par Matériau',
      byCulture: 'Par Culture',
      price: 'Prix (zł)',
      clear: 'Effacer les filtres',
      symbols: {
        love: 'Amour',
        protection: 'Protection',
        wealth: 'Richesse',
        wisdom: 'Sagesse',
      },
      materials: {
        coral: 'Corail',
        silver: 'Argent',
        amber: 'Ambre',
        gemstone: 'Pierres précieuses',
      },
      cultures: {
        all: 'Toutes',
        slavic: 'Slaves',
        viking: 'Viking',
        celtic: 'Celtiques',
      },
    },
    product: {
      categories: {
        slavic: 'Slaves',
        viking: 'Viking',
        celtic: 'Celtiques',
      },
      breadcrumb: {
        home: 'Accueil',
        collections: 'Collections',
      },
      collection: 'collection',
      materials: 'Matériaux',
      quantity: 'Quantité:',
      addToCart: 'Ajouter au panier',
      legend: 'Légende',
      specifications: 'Spécifications',
      related: 'Produits Connexes',
      quality: 'Garantie de Qualité',
      freeShipping: 'Livraison gratuite dans l\'UE (3-5 jours)',
      viewingNow: 'personnes regardent maintenant',
      valueProps: {
        giftWrap: 'Emballage cadeau offert pour chaque commande',
        warranty: 'Garantie d\'authenticité et de fabrication artisanale',
        tracking: 'Suivi facile à chaque étape de la livraison',
        handmadeTooltipLabel: 'À propos des matériaux',
        handmadeTooltip: 'Matériaux naturels : corail, argent 925 et plus. Chaque pièce est assemblée à la main.',
      },
      madeToOrder: {
        title: 'Sur commande',
        duration: 'Délai de fabrication',
        orderButton: 'Commander sur mesure',
        orderWithPayment: 'Commander avec paiement de 50%',
        depositTitle: 'Acompte',
        depositDescription: '50% de paiement à la commande, solde restant à la finition',
        formTitle: 'Formulaire de commande',
        name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        customText: 'Texte pour gravure (si souhaité)',
        customTextPlaceholder: 'Entrez le texte que vous souhaitez ajouter au bijou...',
        description: 'Description / Commentaire',
        descriptionPlaceholder: 'Décrivez vos souhaits pour la fabrication...',
        submit: 'Envoyer la commande',
        submitting: 'Envoi en cours...',
        cancel: 'Annuler',
        success: 'Votre commande a été reçue ! Nous vous contacterons bientôt.',
      },
    },
    cart: {
      title: 'Panier',
      empty: {
        title: 'Le panier est vide',
        message: 'Ajoutez des bijoux pour continuer vos achats',
        continue: 'Continuer les achats',
      },
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      free: 'Gratuit',
      total: 'Total',
      checkout: 'Procéder au paiement',
      continueShopping: 'Continuer les achats',
      remove: 'Retirer',
      addMoreForFreeShipping: 'Ajoutez {amount} zł de plus pour la livraison gratuite',
      securePayment: 'Paiement sécurisé',
      deliveryDays: 'Livraison 3-5 jours',
      progressiveDiscount: 'Remise progressive',
      discount: 'Remise',
      subtotalBeforeDiscount: 'Sous-total avant remise',
      addMoreForDiscount: 'Ajoutez 1 article de plus pour -10% de remise!',
      authReminder: {
        title: 'Inscrivez-vous ou connectez-vous',
        message: 'Inscrivez-vous pour gagner des bonus à chaque achat et suivre vos commandes',
        login: 'Se connecter',
        register: 'S\'inscrire',
        benefits: 'Avantages de l\'inscription',
        bonusPoints: 'Gagnez des bonus à chaque achat',
        trackOrders: 'Suivez le statut des commandes',
        saveAddresses: 'Enregistrez les adresses de livraison',
      },
    },
    legal: {
      terms: 'Conditions Générales',
      privacy: 'Politique de Confidentialité',
      withdrawal: 'Formulaire de Rétractation',
      acceptTerms: 'J\'accepte les Conditions Générales',
      acceptPrivacy: 'J\'accepte la Politique de Confidentialité',
      termsTitle: 'Conditions Générales de RuneBox',
      privacyTitle: 'Politique de Confidentialité',
      withdrawalTitle: 'Formulaire de Rétractation',
    },
    blog: {
      title: 'Blog Rune box',
      subtitle: 'Découvrez les traditions, symboles et savoir-faire des bijoux ethniques',
      loading: 'Chargement des articles...',
      noPosts: 'Les articles de blog arriveront bientôt',
      goToBlog: 'Aller au blog',
      viewAllPosts: 'Voir tous les articles du blog',
      readMore: 'Lire la suite',
    },
    constructor: {
      title: 'Constructeur de colliers',
      beads: 'Perles',
      stone: 'Pierre',
      hardware: 'Quincaillerie',
      extra: 'Extra',
      loading: 'Chargement...',
      noBeads: 'Aucune perle trouvée',
      visualEditor: 'Éditeur Visuel',
      clasp: 'Fermoir',
      threads: 'Fils',
      thread: 'Fil',
      length: 'Longueur',
      addThread: 'Ajouter un fil',
      deleteThread: 'Supprimer le fil',
      clear: 'Effacer',
      send: 'Envoyer',
      save: 'Enregistrer',
      home: 'Accueil',
      quoteRequest: 'Demande de Devis',
      settings: 'Paramètres',
      threadCount: 'Nombre de Fils',
      maxThreads: 'Maximum: 5 fils',
      activeThread: 'Fil Actif',
      threadLength: 'Longueur du Fil',
      instruction: 'Instruction:',
      instruction1: 'Cliquez sur une perle à gauche pour l\'ajouter',
      instruction2: 'Utilisez Zoom pour zoomer',
      instruction3: 'Cliquez sur une perle et appuyez sur Rotate',
      instruction4: 'Sélectionnez un fermoir dans le panneau inférieur',
      instruction5: 'Enregistrez ou envoyez la demande',
      saveSuccess: 'Configuration enregistrée!',
      saveError: 'Erreur d\'enregistrement. Vérifiez l\'autorisation.',
      loginRequired: 'Veuillez vous connecter pour enregistrer la configuration',
      addBeadsFirst: 'Ajoutez des perles au collier avant d\'envoyer la demande!',
      selectClasp: 'Veuillez sélectionner un fermoir!',
      threadOf: 'de',
      beadsOnThread: 'sur fil',
    },
    auth: {
      login: 'Se connecter',
      loginTitle: 'Connexion',
      loginSubtitle: 'Connectez-vous à votre compte',
      email: 'E-mail',
      password: 'Mot de passe',
      loginButton: 'Se connecter',
      loggingIn: 'Connexion...',
      noAccount: 'Pas de compte?',
      registerLink: 'S\'inscrire',
      errors: {
        incorrectCredentials: 'Email ou mot de passe incorrect',
        accountNotActivated: 'Compte non activé. Veuillez vérifier votre e-mail.',
        emailNotVerified: 'E-mail non vérifié. Veuillez vérifier votre e-mail pour le lien de vérification.',
        networkError: 'Échec de la connexion au serveur',
        defaultError: 'Erreur d\'authentification',
      },
    },
    register: {
      title: 'Inscription',
      subtitle: 'Créez un compte pour recevoir des bonus et suivre vos commandes',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Jean Dupont',
      email: 'E-mail',
      emailPlaceholder: 'example@email.com',
      password: 'Mot de passe',
      passwordPlaceholder: 'Minimum 6 caractères',
      passwordHint: 'Minimum 6 caractères',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Répétez le mot de passe',
      submit: 'S\'inscrire',
      submitting: 'Inscription...',
      success: {
        title: 'Inscription réussie!',
        message: 'Nous avons envoyé une confirmation par e-mail à',
        redirecting: 'Redirection vers la page de connexion...',
      },
      hasAccount: 'Vous avez déjà un compte?',
      loginLink: 'Se connecter',
      agreement: 'En vous inscrivant, vous acceptez nos',
      termsLink: 'conditions d\'utilisation',
      privacyLink: 'politique de confidentialité',
      errors: {
        passwordsMismatch: 'Les mots de passe ne correspondent pas',
        passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
        defaultError: 'Erreur d\'inscription',
        serverError: 'Erreur du serveur. Veuillez réessayer plus tard ou contacter le support.',
      },
    },
    checkout: {
      title: 'Commande',
      contactInfo: 'Informations de contact',
      email: 'E-mail',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      delivery: 'Livraison',
      country: 'Pays',
      countries: {
        AT: 'Autriche',
        BE: 'Belgique',
        BG: 'Bulgarie',
        HR: 'Croatie',
        CY: 'Chypre',
        CZ: 'République tchèque',
        DK: 'Danemark',
        EE: 'Estonie',
        FI: 'Finlande',
        FR: 'France',
        DE: 'Allemagne',
        GR: 'Grèce',
        HU: 'Hongrie',
        IE: 'Irlande',
        IT: 'Italie',
        LV: 'Lettonie',
        LT: 'Lituanie',
        LU: 'Luxembourg',
        MT: 'Malte',
        NL: 'Pays-Bas',
        PL: 'Pologne',
        PT: 'Portugal',
        RO: 'Roumanie',
        SK: 'Slovaquie',
        SI: 'Slovénie',
        ES: 'Espagne',
        SE: 'Suède',
        UA: 'Ukraine',
        GB: 'Royaume-Uni',
        US: 'États-Unis',
      },
      deliveryMethod: 'Méthode de livraison',
      inpostLabel: 'InPost Paczkomat',
      inpostDescription: 'Retrait depuis un casier à colis',
      novaposhtaLabel: 'Nova Poshta',
      novaposhtaDescription: 'Bureau Nova Poshta',
      pocztaLabel: 'Poczta Polska',
      pocztaDescription: 'Livraison à domicile',
      courierLabel: 'Courrier',
      courierDescription: 'Livraison par coursier',
      courierDescriptionUA: 'Livraison par coursier',
      courierDescriptionOther: 'Livraison par coursier',
      paczkomat: 'Paczkomat',
      paczkomatPlaceholder: 'Entrez le code ou l\'adresse du paczkomat (ex. WAW01M)',
      paczkomatHint: '💡 À l\'avenir, vous pourrez sélectionner un paczkomat sur la carte. Pour l\'instant, entrez le code du paczkomat manuellement.',
      selectFromMap: 'Sélectionner sur la carte',
      changePoint: 'Changer',
      cancel: 'Annuler',
      novaposhtaOffice: 'Bureau',
      novaposhtaOfficePlaceholder: 'Entrez le numéro du bureau (ex. Bureau #1)',
      novaposhtaOfficeHint: '💡 Bientôt, vous pourrez sélectionner un bureau sur la carte. Pour l\'instant, entrez l\'adresse du bureau manuellement.',
      address: 'Adresse',
      addressPlaceholder: 'Rue Principale 1',
      addressPlaceholderUA: 'Rue Khreshchatyk 1',
      address2: 'Adresse (complément)',
      address2Placeholder: 'Appartement, bureau',
      address2PlaceholderUA: 'Appartement, bureau',
      city: 'Ville',
      cityPlaceholder: 'Paris',
      cityPlaceholderUA: 'Kyiv',
      postalCode: 'Code postal',
      postalCodePlaceholder: '75001',
      postalCodePlaceholderUA: '01001',
      billingSameAsShipping: 'Adresse de facturation identique à l\'adresse de livraison',
      billingAddress: 'Adresse de facturation',
      paymentMethod: 'Méthode de paiement',
      paymentStripe: 'Stripe (Carte)',
      paymentP24: 'Przelewy24',
      paymentBLIK: 'BLIK',
      paymentBankTransfer: 'Virement bancaire',
      orderNotes: 'Notes de commande',
      orderNotesPlaceholder: 'Souhaits ou informations supplémentaires...',
      orderSummary: 'Votre commande',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      total: 'Total',
      submit: 'Passer la commande',
      submitting: 'Traitement...',
      backToCart: '← Retour au panier',
      errors: {
        defaultError: 'Erreur de traitement de la commande',
      },
    },
    orderSuccess: {
      loading: 'Chargement...',
      title: 'Commande acceptée!',
      orderNumber: 'Numéro de commande',
      thankYou: 'Merci pour votre commande! Nous avons envoyé une confirmation à votre e-mail.',
      status: 'Statut',
      paymentMethod: 'Méthode de paiement',
      total: 'Total',
      backToHome: 'Retour à l\'accueil',
      viewCollections: 'Voir les collections',
    },
    adminOrders: {
      title: 'Commandes',
      subtitle: 'Gérer toutes les commandes',
      searchPlaceholder: 'Rechercher par numéro, nom ou e-mail...',
      allStatuses: 'Tous les statuts',
      statusPending: 'En attente',
      statusPaid: 'Payé',
      statusShipped: 'Expédié',
      statusDelivered: 'Livré',
      statusCancelled: 'Annulé',
      loading: 'Chargement...',
      noOrders: 'Aucune commande trouvée.',
      tableNumber: 'Numéro',
      tableClient: 'Client',
      tableAmount: 'Montant',
      tableStatus: 'Statut',
      tablePayment: 'Paiement',
      tableDate: 'Date',
      tableActions: 'Actions',
      edit: 'Modifier',
      totalOrders: 'Nombre total de commandes',
      totalAmount: 'Montant total',
      pending: 'En attente',
      paid: 'Payé',
      orderDetails: 'Commande',
      customerInfo: 'Informations client',
      orderInfo: 'Détails de la commande',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      total: 'Total',
      updateStatus: 'Mettre à jour le statut',
      orderStatus: 'Statut de la commande',
      paymentStatus: 'Statut du paiement',
      paymentCompleted: 'Terminé',
      paymentFailed: 'Échoué',
      paymentRefunded: 'Remboursé',
      close: 'Fermer',
    },
    account: {
      title: 'Compte Personnel',
      subtitle: 'Gérez votre profil et vos commandes',
      logout: 'Déconnexion',
      loading: 'Chargement...',
      errorLoading: 'Erreur lors du chargement du profil',
      failedToLoad: 'Impossible de charger le profil',
      shippingAddress: 'Adresse de livraison',
      inpostPaczkomat: 'InPost Paczkomat:',
      loyaltyStatus: 'Statut de fidélité:',
      bonusPoints: 'points',
      bonusPointsLabel: 'Points bonus',
      toStatus: 'Vers le statut',
      remaining: 'Restant:',
      totalOrders: 'Nombre total de commandes',
      inProcessing: 'En traitement',
      myOrders: 'Mes commandes',
      noOrders: 'Vous n\'avez pas encore de commandes',
      goToCatalog: 'Aller au catalogue',
      orderNumber: 'Commande #',
      item: 'article',
      items: 'articles',
      tracking: 'Suivi:',
      openOnCarrierSite: 'Ouvrir sur le site du transporteur',
      trackingHistory: 'Historique de suivi:',
      status: {
        completed: 'Terminé',
        shipped: 'Expédié',
        inProcessing: 'En traitement',
        paid: 'Payé',
        notPaid: 'Non payé',
      },
      loyaltyStatuses: {
        human: 'Humain',
        elf: 'Elfe',
        dwarf: 'Nain',
      },
    },
  },
};

export default translations;
