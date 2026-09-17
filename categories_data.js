const realCategoriesDB = [
    {
        "id":  400,
        "name":  "ארנקים לגבר",
        "slug":  "mens-wallets",
        "parent":  402,
        "count":  31
    },
    {
        "id":  92,
        "name":  "ברכונים",
        "slug":  "%d7%91%d7%a8%d7%9b%d7%95%d7%a0%d7%99%d7%9d",
        "parent":  404,
        "count":  9
    },
    {
        "id":  34,
        "name":  "בתי מזוזות",
        "slug":  "mezuzah-houses",
        "parent":  401,
        "count":  12
    },
    {
        "id":  383,
        "name":  "גופיות ציצית כותנה",
        "slug":  "%d7%92%d7%95%d7%a4%d7%99%d7%95%d7%aa-%d7%a6%d7%99%d7%a6%d7%99%d7%aa-%d7%9b%d7%95%d7%aa%d7%a0%d7%94",
        "parent":  369,
        "count":  1
    },
    {
        "id":  370,
        "name":  "טלית בית יוסף",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%91%d7%99%d7%aa-%d7%99%d7%95%d7%a1%d7%a3",
        "parent":  368,
        "count":  2
    },
    {
        "id":  376,
        "name":  "טלית בני אור",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%91%d7%a0%d7%99-%d7%90%d7%95%d7%a8",
        "parent":  368,
        "count":  1
    },
    {
        "id":  380,
        "name":  "טלית בעלזא",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%91%d7%a2%d7%9c%d7%96%d7%90",
        "parent":  368,
        "count":  1
    },
    {
        "id":  377,
        "name":  "טלית דגם ברקת",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%93%d7%92%d7%9d-%d7%91%d7%a8%d7%a7%d7%aa",
        "parent":  368,
        "count":  1
    },
    {
        "id":  381,
        "name":  "טלית כותנה",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%9b%d7%95%d7%aa%d7%a0%d7%94",
        "parent":  368,
        "count":  1
    },
    {
        "id":  382,
        "name":  "טלית מעוצבת לשבת",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%9e%d7%a2%d7%95%d7%a6%d7%91%d7%aa-%d7%9c%d7%a9%d7%91%d7%aa",
        "parent":  368,
        "count":  1
    },
    {
        "id":  378,
        "name":  "טלית מעלות",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%9e%d7%a2%d7%9c%d7%95%d7%aa",
        "parent":  368,
        "count":  1
    },
    {
        "id":  375,
        "name":  "טלית ספיר",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%a1%d7%a4%d7%99%d7%a8",
        "parent":  368,
        "count":  1
    },
    {
        "id":  372,
        "name":  "טלית פאר קל",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%a4%d7%90%d7%a8-%d7%a7%d7%9c",
        "parent":  368,
        "count":  1
    },
    {
        "id":  379,
        "name":  "טלית תימנית",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%aa%d7%99%d7%9e%d7%a0%d7%99%d7%aa",
        "parent":  368,
        "count":  1
    },
    {
        "id":  373,
        "name":  "טלית תשבץ",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa-%d7%aa%d7%a9%d7%91%d7%a5",
        "parent":  368,
        "count":  1
    },
    {
        "id":  368,
        "name":  "טליתות",
        "slug":  "%d7%98%d7%9c%d7%99%d7%aa%d7%95%d7%aa",
        "parent":  403,
        "count":  13
    },
    {
        "id":  403,
        "name":  "טליתות וציציות",
        "slug":  "tallitot-tzitzit",
        "parent":  0,
        "count":  54
    },
    {
        "id":  30,
        "name":  "יודאיקה",
        "slug":  "judaica",
        "parent":  405,
        "count":  2
    },
    {
        "id":  58,
        "name":  "כלי עבודה לסופר",
        "slug":  "%d7%9b%d7%9c%d7%99-%d7%a2%d7%91%d7%95%d7%93%d7%94-%d7%9c%d7%a1%d7%95%d7%a4%d7%a8",
        "parent":  401,
        "count":  2
    },
    {
        "id":  15,
        "name":  "כללי",
        "slug":  "%d7%9b%d7%9c%d7%9c%d7%99",
        "parent":  0,
        "count":  27
    },
    {
        "id":  89,
        "name":  "מזוזות",
        "slug":  "%d7%9e%d7%96%d7%95%d7%96%d7%95%d7%aa",
        "parent":  401,
        "count":  1
    },
    {
        "id":  28,
        "name":  "מתנות",
        "slug":  "gifts",
        "parent":  405,
        "count":  4
    },
    {
        "id":  405,
        "name":  "מתנות ויודאיקה",
        "slug":  "gifts-judaica",
        "parent":  0,
        "count":  4
    },
    {
        "id":  55,
        "name":  "סופר סת\"ם",
        "slug":  "%d7%a1%d7%95%d7%a4%d7%a8-%d7%a1%d7%aa%d7%9d",
        "parent":  401,
        "count":  1
    },
    {
        "id":  54,
        "name":  "סטים טלית ותפילין",
        "slug":  "%d7%a1%d7%98%d7%99%d7%9d-%d7%98%d7%9c%d7%99%d7%aa-%d7%95%d7%aa%d7%a4%d7%99%d7%9c%d7%99%d7%9f",
        "parent":  402,
        "count":  26
    },
    {
        "id":  91,
        "name":  "סידורים",
        "slug":  "%d7%a1%d7%99%d7%93%d7%95%d7%a8%d7%99%d7%9d",
        "parent":  404,
        "count":  13
    },
    {
        "id":  32,
        "name":  "ספר תורה",
        "slug":  "sefer-torah",
        "parent":  401,
        "count":  1
    },
    {
        "id":  35,
        "name":  "ספרי קודש",
        "slug":  "holy-books",
        "parent":  404,
        "count":  27
    },
    {
        "id":  404,
        "name":  "ספרי קודש וסידורים",
        "slug":  "holy-books-siddurim",
        "parent":  0,
        "count":  29
    },
    {
        "id":  31,
        "name":  "סת\"ם",
        "slug":  "stm",
        "parent":  401,
        "count":  1
    },
    {
        "id":  93,
        "name":  "פיטום הקטורת",
        "slug":  "%d7%a4%d7%99%d7%98%d7%95%d7%9d-%d7%94%d7%a7%d7%98%d7%95%d7%a8%d7%aa",
        "parent":  404,
        "count":  1
    },
    {
        "id":  386,
        "name":  "פתיל תכלת",
        "slug":  "%d7%a4%d7%aa%d7%99%d7%9c-%d7%aa%d7%9b%d7%9c%d7%aa",
        "parent":  369,
        "count":  1
    },
    {
        "id":  369,
        "name":  "ציציות",
        "slug":  "%d7%a6%d7%99%d7%a6%d7%99%d7%95%d7%aa",
        "parent":  403,
        "count":  4
    },
    {
        "id":  385,
        "name":  "ציצית דרייפיט (ספורט)",
        "slug":  "%d7%a6%d7%99%d7%a6%d7%99%d7%aa-%d7%93%d7%a8%d7%99%d7%99%d7%a4%d7%99%d7%98-%d7%a1%d7%a4%d7%95%d7%a8%d7%98",
        "parent":  369,
        "count":  1
    },
    {
        "id":  384,
        "name":  "ציצית צמר (טלית קטן)",
        "slug":  "%d7%a6%d7%99%d7%a6%d7%99%d7%aa-%d7%a6%d7%9e%d7%a8-%d7%98%d7%9c%d7%99%d7%aa-%d7%a7%d7%98%d7%9f",
        "parent":  369,
        "count":  1
    },
    {
        "id":  63,
        "name":  "קטלוג מלא",
        "slug":  "all-products",
        "parent":  0,
        "count":  182
    },
    {
        "id":  52,
        "name":  "תיקי טלית",
        "slug":  "%d7%aa%d7%99%d7%a7%d7%99-%d7%98%d7%9c%d7%99%d7%aa",
        "parent":  402,
        "count":  1
    },
    {
        "id":  53,
        "name":  "תיקי תפילין",
        "slug":  "%d7%aa%d7%99%d7%a7%d7%99-%d7%aa%d7%a4%d7%99%d7%9c%d7%99%d7%9f",
        "parent":  402,
        "count":  58
    },
    {
        "id":  402,
        "name":  "תיקים, כיסויים וארנקים",
        "slug":  "bags-cases-wallets",
        "parent":  0,
        "count":  118
    },
    {
        "id":  47,
        "name":  "תפילין",
        "slug":  "tefillin",
        "parent":  401,
        "count":  4
    },
    {
        "id":  401,
        "name":  "תשמישי קדושה וסת\"ם",
        "slug":  "holy-items-stam",
        "parent":  0,
        "count":  92
    }
];