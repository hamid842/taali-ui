export const languages = [
  {
    code: "fa",
    name: "فارسی",
    flag: "🇮🇷",
    dir: "rtl",
    countryCodes: ["IR", "AF", "TJ"], // Iran, Afghanistan, Tajikistan
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    dir: "ltr",
    countryCodes: ["US", "GB", "AU", "CA", "NZ", "IE", "ZA", "SG", "IN", "PH"],
  },
  // {
  //   code: "de",
  //   name: "Deutsch",
  //   flag: "🇩🇪",
  //   dir: "ltr",
  //   countryCodes: ["DE", "AT", "CH", "BE", "LU", "LI"], // Germany, Austria, Switzerland, Belgium, Luxembourg, Liechtenstein
  // },
  // {
  //   code: "fr",
  //   name: "Français",
  //   flag: "🇫🇷",
  //   dir: "ltr",
  //   countryCodes: ["FR", "BE", "CH", "CA", "LU", "MC", "SN", "CI"], // France, Belgium, Switzerland, Canada, Luxembourg, Monaco, Senegal, Côte d'Ivoire
  // },
  // {
  //   code: "zh",
  //   name: "中文",
  //   flag: "🇨🇳",
  //   dir: "ltr",
  //   countryCodes: ["CN", "TW", "HK", "MO", "SG", "MY"], // China, Taiwan, Hong Kong, Macau, Singapore, Malaysia
  // },
  // {
  //   code: "ar",
  //   name: "العربية",
  //   flag: "🇸🇦",
  //   dir: "rtl",
  //   countryCodes: [
  //     "SA",
  //     "EG",
  //     "IQ",
  //     "DZ",
  //     "MA",
  //     "YE",
  //     "SY",
  //     "SD",
  //     "AE",
  //     "BH",
  //     "QA",
  //     "OM",
  //     "JO",
  //     "KW",
  //     "LB",
  //     "LY",
  //     "TN",
  //   ], // Arab-speaking countries
  // },
  // {
  //   code: "hi",
  //   name: "हिन्दी",
  //   flag: "🇮🇳",
  //   dir: "ltr",
  //   countryCodes: ["IN", "FJ", "MU", "GY", "TT"], // India, Fiji, Mauritius, Guyana, Trinidad & Tobago
  // },
  // {
  //   code: "es",
  //   name: "Español",
  //   flag: "🇪🇸",
  //   dir: "ltr",
  //   countryCodes: [
  //     "ES",
  //     "MX",
  //     "CO",
  //     "AR",
  //     "PE",
  //     "VE",
  //     "CL",
  //     "EC",
  //     "GT",
  //     "CU",
  //     "BO",
  //     "DO",
  //     "HN",
  //     "PY",
  //     "SV",
  //     "NI",
  //     "CR",
  //     "PA",
  //     "PR",
  //     "UY",
  //   ], // Spanish-speaking countries
  // },
  // {
  //   code: "he",
  //   name: "עברית",
  //   flag: "🇮🇱",
  //   dir: "rtl",
  //   countryCodes: ["IL"], // Israel
  // },
  // {
  //   code: "tr",
  //   name: "Türkçe",
  //   flag: "🇹🇷",
  //   dir: "ltr",
  //   countryCodes: ["TR", "CY"], // Turkey, Cyprus
  // },
] as const;

// Regex for alphabets
export const ENGLISH_REGEX = /^[A-Za-z\s]+$/;
export const FARSI_REGEX = /^[\u0600-\u06FF\s]+$/;
