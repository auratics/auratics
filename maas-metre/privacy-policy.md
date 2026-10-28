---
layout: maas-metre
title: Gizlilik Politikası
---

# Maaş Metre Gizlilik Politikası ve Aydınlatma Metni

Son güncelleme: 28 Ekim 2026

Bu metin **Maaş Metre** uygulaması için geçerlidir. Uygulama, mağazalarda
**auratics** geliştirici adıyla yayımlanır.

**Veri sorumlusu:** Feyza Can
**İletişim:** auratics.studio@gmail.com

Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında
aydınlatma metni olarak da hazırlanmıştır.

---

## 1. Hangi verileri topluyoruz?

**Hesap bilgileri**
- Hesap açmadan (misafir olarak) kullanıyorsan e-posta tutulmaz; yalnızca
  anonim bir kimlik oluşturulur ve kayıtların bu kimlikle saklanır.
- Hesap açarsan e-posta adresin — giriş yapman, doğrulama kodu ve şifre
  sıfırlama için.
- Şifren — yalnızca geri döndürülemez biçimde (hash) saklanır; biz de göremeyiz.
- Giriş yaptığında IP adresin ve cihaz bilgisi, güvenlik amacıyla giriş
  kayıtlarında tutulur.

**Maaş kayıtların**
- Maaş tutarın (TL), geçerli olduğu ay ve isteğe bağlı notun.
- Kaydı girdiğin günün dolar ve euro kuru ile gram altın fiyatı — maaşının o
  günkü karşılığını gösterebilmek için.

**Yalnızca telefonunda kalanlar** (sunucuya gönderilmez)
- TCMB'den alınan aylık ortalama kurlar — uygulama hızlı açılsın ve zayıf
  bağlantıda da çalışsın diye.
- Oturum bilgin, hatırlatma ve güncelleme tercihlerin.

**Bildirimler**
- Aylık hatırlatma telefonunda planlanır. Bunun için bize ya da başka bir
  sunucuya hiçbir bilgi gönderilmez.

**Paylaşım kartları**
- Bir karşılaştırmayı ya da gereken zammı kart olarak paylaştığında görsel
  telefonunda oluşturulur. Kartta maaş tutarın yer almaz; yalnızca yüzdeler
  ve tarihler vardır. Neyi, nereye paylaşacağına sen karar verirsin; bize bir
  şey gönderilmez.

**Kullanım istatistikleri**
- Uygulamayı geliştirmek için hangi ekranların açıldığını ve bazı işlemlerin
  yapılıp yapılmadığını sayarız: ilk maaşın kaydedilmesi, karşılaştırma ya da
  grafik aralığının seçilmesi, bir kartın paylaşılması, hatırlatmanın açılması
  gibi. Bunun için PostHog kullanılır.
- Bu kayıtlar hesap kimliğinle (misafirsen de rastgele bir kimlikle)
  ilişkilendirilir; cihaz modeli, işletim sistemi ve uygulama sürümü eklenir.
  Maaşın, kurlar, e-postan ve notların gönderilmez; IP adresin saklanmaz ve
  konumun çıkarılmaz.
- **Ayarlar → Gizlilik → Kullanım istatistikleri**'nden istediğin zaman
  kapatabilirsin.

**Reklam yok**
- Maaş Metre 1.1.0 ve sonraki sürümler reklam göstermez ve reklam kimliğini
  kullanmaz.
- 1.1.0'dan önceki sürümler Google AdMob reklamları gösterir. Bu sürümlerde
  AdMob, reklam için cihaz bilgisini, IP adresini ve Android'de reklam
  kimliğini kullanabilir; Google bu verileri kendi gizlilik politikasına göre
  işler: [policies.google.com/privacy](https://policies.google.com/privacy).
  Uygulamayı güncellediğinde bu sona erer.

**Toplamadıklarımız:** adın, konumun, rehberin, fotoğrafların, banka ya da kart
bilgilerin. Verilerin satılmaz.

## 2. Bilgilerini kim görür?

Maaş kayıtların yalnızca sana görünür. Maaş Metre'de profil ya da başka
kullanıcılarla etkileşim yoktur; paylaşım kartlarını yalnızca sen, kendi
seçtiğin yere gönderirsin. Veritabanında her kayıt satır düzeyinde
erişim kurallarıyla korunur: hiçbir kullanıcı başkasının kaydını okuyamaz ya
da değiştiremez.

Kayıtlarına biz de yalnızca senin talebinle ya da teknik bir sorunu gidermek
için bakarız.

## 3. Neden işliyoruz? (Hukuki sebepler)

- **Hizmeti sunmak** — hesabını açmak, maaş kayıtlarını saklamak, karşılıklarını
  hesaplamak, hatırlatmayı planlamak. KVKK md. 5/2-c (sözleşmenin kurulması
  ve ifası).
- **Güvenlik** — giriş kayıtları, kötüye kullanımın önlenmesi. KVKK md. 5/2-f
  (meşru menfaat).
- **Uygulamayı geliştirmek** — kullanım istatistikleri; Ayarlar'dan
  kapatılabilir. KVKK md. 5/2-f (meşru menfaat).
- **Yasal yükümlülükler** — resmi makamların talepleri. KVKK md. 5/2-ç.

## 4. Kurlar nereden geliyor?

Döviz kurları ve altın fiyatı Türkiye Cumhuriyet Merkez Bankası'ndan (EVDS ve
günlük kur bülteni) alınır. Bu isteklerde maaşın ya da hesap bilgin
gönderilmez; her internet isteğinde olduğu gibi yalnızca IP adresin TCMB
sunucularına ulaşır.

## 5. Hizmet sağlayıcılar ve yurt dışına aktarım

| Sağlayıcı | Ne için | Nerede |
|---|---|---|
| Supabase, Inc. | Veritabanı ve giriş | Almanya (Frankfurt) |
| Expo (650 Industries, Inc.) | Uygulama güncellemelerinin indirilmesi | ABD |
| PostHog, Inc. | Kullanım istatistikleri | Almanya (Frankfurt) |
| Google (AdMob) | Reklamlar, yalnızca 1.1.0'dan önceki sürümlerde | ABD |

Bu sağlayıcıların sunucuları Türkiye dışında olduğundan, Maaş Metre'yi
kullandığında verilerin KVKK md. 9 kapsamında yurt dışına aktarılır.

Aktarımları yalnızca gereken veriyle sınırlı tutuyoruz:

- Supabase'e hesap bilgilerin ve maaş kayıtların gider.
- Expo'ya yalnızca güncelleme denetimi için gerekenler gider: cihaz türü,
  uygulama sürümü ve rastgele bir kurulum kimliği.
- PostHog'a yalnızca ekran ve işlem adları, hesap kimliğin, cihaz modeli,
  işletim sistemi ve uygulama sürümü gider.
- Maaşın ve e-postan Expo'ya ya da PostHog'a gönderilmez.
- **Veritabanın Avrupa Birliği'ndedir** (Almanya); AB veri koruma kurallarına
  tabi bir veri merkezinde tutulur.

## 6. Ne kadar saklıyoruz?

- Hesabın ve maaş kayıtların: hesabını silene kadar. Tek bir kaydı istediğin
  zaman silebilirsin.
- Misafir kayıtları: sen silene kadar. Uygulamayı telefonundan silmek
  sunucudaki kayıtları silmez (7. bölüm).
- Giriş kayıtları: güvenlik için sınırlı bir süre.
- Kullanım istatistikleri: en fazla bir yıl.
- Telefonundaki bilgiler: uygulamayı silince telefonundan da silinir.

## 7. Verilerini silmek

- **Hesabın varsa:** Ayarlar → **Hesabı sil**. Hesabın ve bütün maaş
  kayıtların kalıcı olarak silinir; bu işlem geri alınamaz.
- **Misafir olarak kullanıyorsan:** Maaşlarım ekranında bir kaydı sola
  kaydırarak kayıtlarını tek tek silebilirsin. Bunu uygulamayı silmeden önce
  yap: misafir kimliği telefona bağlıdır ve uygulama silindikten sonra o
  kayıtlara bir daha ulaşılamaz.
- **Uygulamaya erişemiyorsan:** hesabının e-posta adresinden
  auratics.studio@gmail.com adresine yaz; hesabın ve kayıtların silinir.

Adım adım anlatım: [Hesabını ve verilerini silme](delete-account)

## 8. Hakların

KVKK md. 11 uyarınca; verilerinin işlenip işlenmediğini öğrenme, bilgi
isteme, düzeltilmesini ya da silinmesini isteme, aktarıldığı kişileri öğrenme,
itiraz etme ve zararının giderilmesini talep etme hakların vardır.
Taleplerin için **auratics.studio@gmail.com** adresine yaz; en geç 30 gün
içinde cevap veririz.

## 9. Güvenlik

Bağlantılar şifrelidir (TLS). Veritabanında her kayıt satır düzeyinde erişim
kurallarıyla korunur: başkasının verisini okuyamaz, değiştiremezsin.

## 10. Çocuklar

Maaş Metre 13 yaşından küçükler için tasarlanmamıştır. 18 yaşından küçüksen
uygulamayı velinin bilgisi ve onayıyla kullan.

## 11. Değişiklikler

Bu metni güncelleyebiliriz. Güncel hali her zaman bu sayfadadır; en üstteki
tarih değişir.

## 12. İletişim

auratics.studio@gmail.com
