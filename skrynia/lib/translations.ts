export type Language = 'UA' | 'EN' | 'DE' | 'PL';

export interface Translations {
  nav: {
    collections: string;
    about: string;
    contact: string;
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
    ukrainian: string;
    ukrainianTagline: string;
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
      ukrainian: string;
      viking: string;
      celtic: string;
    };
  };
    product: {
      categories: {
        ukrainian: string;
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
}

const translations: Record<Language, Translations> = {
  UA: {
    nav: {
      collections: 'Колекції',
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
      ukrainian: 'Українські',
      ukrainianTagline: 'Символи сили та захисту',
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
    },
    home: {
      featuredProducts: {
        title: 'Обрані Скарби',
        subtitle: 'Унікальні прикраси, створені з душею та натхненням традиціями',
        viewAll: 'Переглянути всі прикраси',
      },
      about: {
        title: 'Про Скриню',
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
      title: 'Про Скриню Пані Дарії',
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
        ukrainian: 'Українські',
        viking: 'Вікінгські',
        celtic: 'Кельтські',
      },
    },
    product: {
      categories: {
        ukrainian: 'Українські',
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
      madeToOrder: {
        title: 'Під замовлення',
        duration: 'Строк виготовлення',
        orderButton: 'Замовити під замовлення',
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
  },
  EN: {
    nav: {
      collections: 'Collections',
      about: 'About',
      contact: 'Contact',
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
      ukrainian: 'Ukrainian',
      ukrainianTagline: 'Symbols of strength and protection',
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
    },
    home: {
      featuredProducts: {
        title: 'Featured Treasures',
        subtitle: 'Unique pieces created with soul and inspired by traditions',
        viewAll: 'View all jewelry',
      },
      about: {
        title: 'About the Chest',
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
      title: 'About Skrynia Pani Darii',
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
        ukrainian: 'Ukrainian',
        viking: 'Viking',
        celtic: 'Celtic',
      },
    },
    product: {
      categories: {
        ukrainian: 'Ukrainian',
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
  },
  DE: {
    nav: {
      collections: 'Kollektionen',
      about: 'Über uns',
      contact: 'Kontakt',
    },
    hero: {
      title: 'Skrynia Pani Darii',
      subtitle: 'Authentische Erbschätze',
      cta: 'Die Truhe öffnen',
      tagline: 'Jedes Stück ist ein Portal zur Geschichte unserer Vorfahren',
    },
    collections: {
      title: 'Erbe-Kollektionen',
      subtitle: 'Drei Kulturen. Ein Erbe. Unzählige Geschichten.',
      ukrainian: 'Ukrainisch',
      ukrainianTagline: 'Symbole der Stärke und des Schutzes',
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
      copyright: 'Skrynia Pani Darii. Alle Rechte vorbehalten.',
      acceptPayments: 'Wir akzeptieren:',
    },
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      handmade: 'Handgefertigt',
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
        ukrainian: 'Ukrainisch',
        viking: 'Wikinger',
        celtic: 'Keltisch',
      },
    },
    product: {
      categories: {
        ukrainian: 'Ukrainisch',
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
  },
  PL: {
    nav: {
      collections: 'Kolekcje',
      about: 'O nas',
      contact: 'Kontakt',
    },
    hero: {
      title: 'Skrynia Pani Darii',
      subtitle: 'Autentyczne Skarby Dziedzictwa',
      cta: 'Otwórz Skrzynię',
      tagline: 'Każda ozdoba to portal do historii naszych przodków',
    },
    collections: {
      title: 'Kolekcje Dziedzictwa',
      subtitle: 'Trzy kultury. Jedno dziedzictwo. Nieskończone historie.',
      ukrainian: 'Ukraińskie',
      ukrainianTagline: 'Symbole siły i ochrony',
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
        ukrainian: 'Ukraińskie',
        viking: 'Wikingowie',
        celtic: 'Celtyckie',
      },
    },
    product: {
      categories: {
        ukrainian: 'Ukraińskie',
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
  },
};

export default translations;
