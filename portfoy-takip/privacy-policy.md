# Portföy Takip Gizlilik Politikası ve Aydınlatma Metni

Son güncelleme: 20 Ekim 2026

Bu metin **Portföy Takip** uygulaması için geçerlidir. Uygulama, mağazalarda
**auratics** geliştirici adıyla yayımlanır.

**Veri sorumlusu:** Feyza Can
**İletişim:** auratics.studio@gmail.com

Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında
aydınlatma metni olarak da hazırlanmıştır.

---

## 1. Hangi verileri topluyoruz?

**Hesap bilgileri**
- Hesap açmadan (misafir olarak) kullanıyorsan e-posta tutulmaz; yalnızca
  anonim bir kimlik oluşturulur ve işlemlerin bu kimlikle saklanır.
- Hesap açarsan e-posta adresin — giriş yapman, doğrulama kodu ve şifre
  sıfırlama için.
- Şifren — yalnızca geri döndürülemez biçimde (hash) saklanır; biz de göremeyiz.
- Giriş yaptığında IP adresin ve cihaz bilgisi, güvenlik amacıyla giriş
  kayıtlarında tutulur.

**Portföy kayıtların**
- Girdiğin alış ve satış işlemleri: hisse sembolü, işlem türü, lot adedi, hisse
  başına fiyat, tarih ve komisyon tutarı.
- Her işlemin, işlem gününün TCMB kuruyla hesaplanan dolar ve euro karşılığı —
  kar ve zararını bu para birimlerinde de gösterebilmek için.
- Ayarlarda belirlediğin komisyon oranı ve daha önceki oranların.

**Yalnızca telefonunda kalanlar** (sunucuya gönderilmez)
- Borsa İstanbul hisse listesi — uygulama internet yokken de hisse seçebilsin
  diye.
- Oturum bilgin ve hesap oluşturma hatırlatmalarının ne zaman gösterildiği.

**Reklam verileri**
- Uygulamada Google AdMob reklamları gösterilir. AdMob, reklam göstermek,
  ilgi alanlarına göre kişiselleştirmek ve ölçmek için cihaz bilgisi, IP
  adresi, reklam etkileşimleri ve Android'de reklam kimliğini kullanabilir.
  iOS'ta reklam kimliğine (IDFA) erişim izni istenmez.
- Reklam kimliğini telefonunun ayarlarından sıfırlayabilir ya da
  kişiselleştirilmiş reklamları kapatabilirsin.
- Google bu verileri kendi gizlilik politikasına göre işler:
  [policies.google.com/privacy](https://policies.google.com/privacy)

**Toplamadıklarımız:** adın, konumun, rehberin, fotoğrafların, banka, kart ya da
aracı kurum hesap bilgilerin. Portföy Takip hiçbir aracı kuruma bağlanmaz;
işlemleri sen girersin. Uygulama kullanım istatistiği toplamaz. Verilerin
satılmaz.

## 2. Bilgilerini kim görür?

Portföy kayıtların yalnızca sana görünür. Portföy Takip'te profil, paylaşım ya
da başka kullanıcılarla etkileşim yoktur. Veritabanında her kayıt satır
düzeyinde erişim kurallarıyla korunur: hiçbir kullanıcı başkasının kaydını
okuyamaz ya da değiştiremez.

Kayıtlarına biz de yalnızca senin talebinle ya da teknik bir sorunu gidermek
için bakarız.

## 3. Neden işliyoruz? (Hukuki sebepler)

- **Hizmeti sunmak** — hesabını açmak, işlemlerini saklamak, ortalama
  maliyetini ve kar/zararını hesaplamak. KVKK md. 5/2-c (sözleşmenin
  kurulması ve ifası).
- **Güvenlik** — giriş kayıtları, kötüye kullanımın önlenmesi. KVKK md. 5/2-f
  (meşru menfaat).
- **Uygulamayı ücretsiz sunabilmek** — reklam gösterimi. KVKK md. 5/2-f
  (meşru menfaat).
- **Yasal yükümlülükler** — resmi makamların talepleri. KVKK md. 5/2-ç.

## 4. Kurlar ve hisse listesi nereden geliyor?

- **Döviz kurları** Türkiye Cumhuriyet Merkez Bankası'nın günlük kur
  bülteninden alınır.
- **Borsa İstanbul hisse listesi** TradingView'dan alınır.

Bu isteklerde portföyün ya da hesap bilgin gönderilmez; her internet isteğinde
olduğu gibi yalnızca IP adresin bu kurumların sunucularına ulaşır.

## 5. Hizmet sağlayıcılar ve yurt dışına aktarım

| Sağlayıcı | Ne için | Nerede |
|---|---|---|
| Supabase, Inc. | Veritabanı ve giriş | Almanya (Frankfurt) |
| Google (AdMob) | Reklamlar | ABD |
| TradingView, Inc. | Hisse listesinin indirilmesi | ABD |

Bu sağlayıcıların sunucuları Türkiye dışında olduğundan, Portföy Takip'i
kullandığında verilerin KVKK md. 9 kapsamında yurt dışına aktarılır.

Aktarımları yalnızca gereken veriyle sınırlı tutuyoruz:

- Supabase'e hesap bilgilerin ve portföy kayıtların gider.
- Google'a yalnızca reklam için gereken cihaz bilgileri gider.
- TradingView'a yalnızca hisse listesi isteği gider; portföyünle ilgili hiçbir
  bilgi gitmez.
- Portföyün ve e-postan Google'a ya da TradingView'a gönderilmez.
- **Veritabanın Avrupa Birliği'ndedir** (Almanya); AB veri koruma kurallarına
  tabi bir veri merkezinde tutulur.

## 6. Ne kadar saklıyoruz?

- Hesabın ve portföy kayıtların: hesabını silene kadar. Tek bir işlemi
  istediğin zaman silebilirsin.
- Misafir kayıtları: sen silene kadar. Uygulamayı telefonundan silmek
  sunucudaki kayıtları silmez (7. bölüm).
- Giriş kayıtları: güvenlik için sınırlı bir süre.
- Telefonundaki bilgiler: uygulamayı silince telefonundan da silinir.

## 7. Verilerini silmek

- **Hesabın varsa:** Profil → Tehlikeli Bölge → **Hesabı sil**. Hesabın,
  bütün işlemlerin ve komisyon ayarların kalıcı olarak silinir; bu işlem geri
  alınamaz.
- **Misafir olarak kullanıyorsan:** İşlem Geçmişi ekranında her işlemi **Sil**
  ile tek tek silebilirsin. Bunu uygulamayı silmeden önce yap: misafir kimliği
  telefona bağlıdır ve uygulama silindikten sonra o kayıtlara bir daha
  ulaşılamaz.
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

Portföy Takip 13 yaşından küçükler için tasarlanmamıştır. 18 yaşından küçüksen
uygulamayı velinin bilgisi ve onayıyla kullan.

## 11. Değişiklikler

Bu metni güncelleyebiliriz. Güncel hali her zaman bu sayfadadır; en üstteki
tarih değişir.

## 12. İletişim

auratics.studio@gmail.com
