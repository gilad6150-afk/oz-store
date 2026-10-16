const fs = require('fs');

const raw = fs.readFileSync('products.json', 'utf8');
const products = JSON.parse(raw);

const mapping = {
  // 1. Ben Ish Chai (20001 - 20003)
  20001: 'public/products/tmunot/glass_ben_ish_chai_rectangle.jpg',
  20002: 'public/products/tmunot/glass_ben_ish_chai_square.jpg',
  20003: 'public/products/tmunot/glass_ben_ish_chai_circle.jpg',

  // 2. Baba Sali (20004 - 20007)
  20004: 'public/products/tmunot/glass_baba_sali_rectangle.jpg',
  20005: 'public/products/tmunot/glass_baba_sali_square.jpg',
  20006: 'public/products/tmunot/glass_baba_sali_circle.jpg',
  20007: 'public/products/tmunot/glass_baba_sali_panoramic.jpg',

  // 3. Abir Yaakov (20008 - 20010)
  20008: 'public/products/tmunot/glass_abir_yaakov_rectangle.jpg',
  20009: 'public/products/tmunot/glass_abir_yaakov_square.jpg',
  20010: 'public/products/tmunot/glass_abir_yaakov_circle.jpg',

  // 4. Lubavitcher Rebbe (20011 - 20014)
  20011: 'public/products/tmunot/glass_lubavitch_rectangle.jpg',
  20012: 'public/products/tmunot/glass_lubavitch_square.jpg',
  20013: 'public/products/tmunot/glass_lubavitch_circle.jpg',
  20014: 'public/products/tmunot/glass_lubavitch_panoramic.jpg',

  // 5. Rav Ovadia Yosef (20015 - 20018)
  20015: 'public/products/tmunot/glass_rav_ovadia_rectangle.jpg',
  20016: 'public/products/tmunot/glass_rav_ovadia_square.jpg',
  20017: 'public/products/tmunot/glass_rav_ovadia_circle.jpg',
  20018: 'public/products/tmunot/glass_rav_ovadia_panoramic.jpg',

  // 6. Rav Yoram Abergel (20019 - 20021)
  20019: 'public/products/tmunot/glass_rav_yoram_rectangle.jpg',
  20020: 'public/products/tmunot/glass_rav_yoram_square.jpg',
  20021: 'public/products/tmunot/glass_rav_yoram_circle.jpg',

  // 7. Rav Mordechai Eliyahu (20022 - 20024)
  20022: 'public/products/tmunot/glass_rav_eliyahu_rectangle.jpg',
  20023: 'public/products/tmunot/glass_rav_eliyahu_square.jpg',
  20024: 'public/products/tmunot/glass_rav_eliyahu_circle.jpg',

  // 8. Chida (20025 - 20027)
  20025: 'public/products/tmunot/glass_chida_rectangle.jpg',
  20026: 'public/products/tmunot/glass_chida_square.jpg',
  20027: 'public/products/tmunot/glass_chida_circle.jpg',

  // 9. Rav Yitzchak Kaduri (20028 - 20030)
  20028: 'public/products/tmunot/glass_rav_kaduri_rectangle.jpg',
  20029: 'public/products/tmunot/glass_rav_kaduri_square.jpg',
  20030: 'public/products/tmunot/glass_rav_kaduri_circle.jpg',

  // 10. Rabbi Chaim Pinto (20031 - 20033)
  20031: 'public/products/tmunot/glass_pinto_rectangle.jpg',
  20032: 'public/products/tmunot/glass_pinto_square.jpg',
  20033: 'public/products/tmunot/glass_pinto_circle.jpg',

  // 11. Rashbi (20034 - 20037)
  20034: 'public/products/tmunot/glass_rashbi_rectangle.jpg',
  20035: 'public/products/tmunot/glass_rashbi_square.jpg',
  20036: 'public/products/tmunot/glass_rashbi_circle.jpg',
  20037: 'public/products/tmunot/glass_rashbi_panoramic.jpg',

  // 12. Rabbi Meir Baal HaNes (20038 - 20040)
  20038: 'public/products/tmunot/glass_meir_baal_hanes_rectangle.jpg',
  20039: 'public/products/tmunot/glass_meir_baal_hanes_square.jpg',
  20040: 'public/products/tmunot/glass_meir_baal_hanes_circle.jpg',

  // 13. Reb Yeshaya of Kerestir (20041 - 20044)
  20041: 'public/products/tmunot/glass_kerestir_rectangle.jpg',
  20042: 'public/products/tmunot/glass_kerestir_square.jpg',
  20043: 'public/products/tmunot/glass_kerestir_circle.jpg',
  20044: 'public/products/tmunot/glass_kerestir_panoramic.jpg',

  // 14. Rabbi Nachman of Breslov (20045 - 20047)
  20045: 'public/products/tmunot/glass_nachman_rectangle.jpg',
  20046: 'public/products/tmunot/glass_nachman_square.jpg',
  20047: 'public/products/tmunot/glass_nachman_circle.jpg',

  // 15. HaYanuka (20048 - 20050)
  20048: 'public/products/tmunot/glass_yanuka_rectangle.jpg',
  20049: 'public/products/tmunot/glass_yanuka_square.jpg',
  20050: 'public/products/tmunot/glass_yanuka_circle.jpg',

  // 16. Rav Chaim Kanievsky (20051 - 20052)
  20051: 'public/products/tmunot/glass_kanievsky_rectangle.jpg',
  20052: 'public/products/tmunot/glass_kanievsky_square.jpg',

  // 17. Baba Meir (20053 - 20054)
  20053: 'public/products/tmunot/glass_baba_meir_rectangle.jpg',
  20054: 'public/products/tmunot/glass_baba_meir_square.jpg',

  // 18. Baba Chaki (20055)
  20055: 'public/products/tmunot/glass_baba_chaki_rectangle.jpg',

  // 19. Breslov / HaEsh Sheli (20056 - 20075)
  20056: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20057: 'public/products/tmunot/glass_esh_sheli_square.jpg',
  20058: 'public/products/tmunot/glass_esh_sheli_round.jpg',
  20059: 'public/products/tmunot/glass_esh_sheli_panoramic.jpg',
  20060: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20061: 'public/products/tmunot/glass_esh_sheli_square.jpg',
  20062: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20063: 'public/products/tmunot/glass_esh_sheli_square.jpg',
  20064: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20065: 'public/products/tmunot/glass_esh_sheli_round.jpg',
  20066: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20067: 'public/products/tmunot/glass_esh_sheli_panoramic.jpg',
  20068: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20069: 'public/products/tmunot/glass_esh_sheli_square.jpg',
  20070: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20071: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20072: 'public/products/tmunot/glass_esh_sheli_panoramic.jpg',
  20073: 'public/products/tmunot/glass_esh_sheli_mockup.jpg',
  20074: 'public/products/tmunot/glass_esh_sheli_round.jpg',
  20075: 'public/products/tmunot/glass_esh_sheli_panoramic.jpg',

  // 20. Poteach Et Yadecha (20076 - 20079)
  20076: 'public/products/tmunot/glass_poteach_et_yadecha_mockup.jpg',
  20077: 'public/products/tmunot/glass_poteach_square.jpg',
  20078: 'public/products/tmunot/glass_poteach_circle.jpg',
  20079: 'public/products/tmunot/glass_poteach_panoramic.jpg',

  // 21. Mizmor LeToda (20080 - 20084)
  20080: 'public/products/tmunot/glass_mizmor_letoda_rectangle.jpg',
  20081: 'public/products/tmunot/glass_mizmor_letoda_rectangle.jpg',
  20082: 'public/products/tmunot/glass_mizmor_letoda_square.jpg',
  20083: 'public/products/tmunot/glass_mizmor_letoda_circle.jpg',
  20084: 'public/products/tmunot/glass_mizmor_letoda_panoramic.jpg',

  // 22. Birkat HaBayit (20085 - 20087)
  20085: 'public/products/tmunot/glass_birkat_habayit_rectangle.jpg',
  20086: 'public/products/tmunot/glass_birkat_habayit_square.jpg',
  20087: 'public/products/tmunot/glass_birkat_habayit_circle.jpg',

  // 23. Birkat HaEisek (20088 - 20089)
  20088: 'public/products/tmunot/glass_birkat_haeisek_rectangle.jpg',
  20089: 'public/products/tmunot/glass_birkat_haeisek_panoramic.jpg',

  // 24. Pitum HaKetoret (20090 - 20091)
  20090: 'public/products/tmunot/glass_pitum_haketoret_rectangle.jpg',
  20091: 'public/products/tmunot/glass_pitum_haketoret_panoramic.jpg',

  // 25. Ana Bekoach (20092 - 20093)
  20092: 'public/products/tmunot/glass_ana_bekoach_rectangle.jpg',
  20093: 'public/products/tmunot/glass_ana_bekoach_square.jpg',

  // 26. Eshet Chayil (20094 - 20095)
  20094: 'public/products/tmunot/glass_eshet_chayil_rectangle.jpg',
  20095: 'public/products/tmunot/glass_eshet_chayil_square.jpg',

  // 27. Shema Yisrael (20096 - 20097)
  20096: 'public/products/tmunot/glass_shema_yisrael_rectangle.jpg',
  20097: 'public/products/tmunot/glass_shema_yisrael_circle.jpg',

  // 28. Lamnatzeach (20098 - 20099)
  20098: 'public/products/tmunot/glass_shiviti_rectangle.jpg',
  20099: 'public/products/tmunot/glass_mizmor_letoda_square.jpg',

  // 29. Shiviti (20100)
  20100: 'public/products/tmunot/glass_shiviti_rectangle.jpg',

  // 30. Shir LaMaalot (20101 - 20102)
  20101: 'public/products/tmunot/glass_shir_lamaalot_rectangle.jpg',
  20102: 'public/products/tmunot/glass_shir_lamaalot_circle.jpg',

  // 31. Birkat Kohanim (20103, 20120)
  20103: 'public/products/tmunot/glass_birkat_kohanim_rectangle.jpg',
  20120: 'public/products/tmunot/glass_kotel_birkat_kohanim.jpg',

  // 32. Parashat HaMan (20104)
  20104: 'public/products/tmunot/glass_parashat_haman_rectangle.jpg',

  // 33. Prayers & Seder (20105 - 20114)
  20105: 'public/products/tmunot/glass_birkat_haeisek_rectangle.jpg',
  20106: 'public/products/tmunot/glass_asher_yatzar_rectangle.jpg',
  20107: 'public/products/tmunot/glass_eshet_chayil_rectangle.jpg',
  20108: 'public/products/tmunot/glass_birkat_habayit_square.jpg',
  20109: 'public/products/tmunot/glass_birkat_habayit_rectangle.jpg',
  20110: 'public/products/tmunot/glass_birkat_habayit_rectangle.jpg',
  20111: 'public/products/tmunot/glass_birkat_habayit_rectangle.jpg',
  20112: 'public/products/tmunot/glass_kotel_vertical_majestic.jpg',
  20113: 'public/products/tmunot/glass_mizmor_letoda_panoramic.jpg',
  20114: 'public/products/tmunot/glass_mizmor_letoda_circle.jpg',

  // 34. Kotel & Jerusalem (20115 - 20135)
  20115: 'public/products/tmunot/glass_kotel_stones_authentic.jpg',
  20116: 'public/products/tmunot/glass_kotel_panorama_clear.jpg',
  20117: 'public/products/tmunot/glass_kotel_kvitel_authentic.jpg',
  20118: 'public/products/tmunot/glass_kotel_circle_stones.jpg',
  20119: 'public/products/tmunot/glass_kotel_prayer_authentic.jpg',
  20121: 'public/products/tmunot/glass_kotel_vertical_majestic.jpg',
  20122: 'public/products/tmunot/glass_kotel_mockup.jpg',
  20123: 'public/products/tmunot/glass_kotel_stones_authentic.jpg',
  20124: 'public/products/tmunot/glass_kotel_kvitel_authentic.jpg',
  20125: 'public/products/tmunot/glass_kotel_circle_stones.jpg',
  20126: 'public/products/tmunot/glass_kotel_prayer_authentic.jpg',
  20127: 'public/products/tmunot/glass_kotel_panorama_clear.jpg',
  20128: 'public/products/tmunot/glass_kotel_vertical_majestic.jpg',
  20129: 'public/products/tmunot/glass_kotel_stones_authentic.jpg',
  20130: 'public/products/tmunot/glass_kotel_vertical_majestic.jpg',
  20131: 'public/products/tmunot/glass_kotel_stones_authentic.jpg',
  20132: 'public/products/tmunot/glass_kotel_vertical_majestic.jpg',
  20133: 'public/products/tmunot/glass_kotel_stones_authentic.jpg',
  20134: 'public/products/tmunot/glass_kotel_panorama_clear.jpg',
  20135: 'public/products/tmunot/glass_kotel_prayer_authentic.jpg',

  // 35. Jewish Symbols (20136 - 20144)
  20136: 'public/products/tmunot/glass_mizmor_letoda_square.jpg',
  20137: 'public/products/tmunot/glass_birkat_habayit_circle.jpg',
  20138: 'public/products/tmunot/glass_ana_bekoach_rectangle.jpg',
  20139: 'public/products/tmunot/glass_shiviti_rectangle.jpg',
  20140: 'public/products/tmunot/glass_pitum_haketoret_panoramic.jpg',
  20141: 'public/products/tmunot/glass_ana_bekoach_square.jpg',
  20142: 'public/products/tmunot/glass_pitum_haketoret_rectangle.jpg',
  20143: 'public/products/tmunot/glass_shir_lamaalot_circle.jpg',
  20144: 'public/products/tmunot/glass_birkat_kohanim_rectangle.jpg'
};

let countUpdated = 0;
products.forEach(p => {
  if (p.id >= 20001 && p.id <= 20144) {
    const targetImg = mapping[p.id];
    if (targetImg) {
      if (!fs.existsSync(targetImg)) {
        console.error(`WARNING: Image file does not exist on disk: ${targetImg} for product ${p.id}`);
      }
      p.image = targetImg;
      p.images = [targetImg];
      countUpdated++;
    } else {
      console.error(`WARNING: No mapping found for product ${p.id} (${p.name})`);
    }
  }
});

fs.writeFileSync('products.json', JSON.stringify(products, null, 2), 'utf8');
console.log(`\nSuccessfully mapped and updated ${countUpdated} glass products in products.json!`);
