# KortPro Gizlilik Politikası ve Aydınlatma Metni

Son güncelleme: 04 Ekim 2026

Bu metin **KortPro** uygulaması için geçerlidir.

**İletişim:** auratics.studio@gmail.com

Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında
aydınlatma metni olarak da hazırlanmıştır.

---

## 1. Hangi verileri topluyoruz?

**Hesap bilgileri**
- E-posta adresin — giriş yapman, doğrulama kodu ve şifre sıfırlama için.
- Şifren — yalnızca geri döndürülemez biçimde (hash) saklanır; biz de göremeyiz.
- Hesap açmadan kullanıyorsan e-posta tutulmaz; yalnızca anonim bir kimlik oluşturulur.

**Profil bilgileri**
- Görünen adın.
- Seçtiğin figür (kadın/erkek) — karma turnuvalarda eşleşmeleri göstermek için.
- Sana özel 6 haneli oyuncu kodun — rakiplerinin seni bulabilmesi için.
- Profil fotoğrafın — **isteğe bağlı** (ayrıntı: 4. bölüm).

**Girdiğin içerik**
- Maç kayıtların: rakip adları, set skorları, tarih, saat, kort adı ve maç notların.
- Rakip bağlantıların, maç tekliflerin (gün, saat, yer).
- Turnuvalar: turnuva adı, turnuva fotoğrafı (isteğe bağlı), katılımcılar, eşleşmeler, maç saatleri ve skorlar.

**Bildirimler**
- Bildirimlere izin verirsen cihazının bildirim adresi (push token) ve bildirim tercihin.

**Güvenlik kayıtları**
- Yaptığın ve hakkında yapılan fotoğraf bildirimleri, engellediğin kişiler.
- Fotoğraf denetim sonuçları (kabul/ret ve puanlar — fotoğrafın kendisi değil).

**Toplamadıklarımız:** konumun, rehberin, galerinin tamamı, reklam kimliğin.
KortPro'da reklam, analiz ya da takip aracı yoktur ve verilerin satılmaz.

## 2. Bilgilerini kim görür?

Herkese açık bir profil ya da arama yoktur. Görünürlük şöyledir:

| Bilgi | Yalnızca sen | Bağlantılı rakiplerin | Aynı turnuvadaki oyuncular |
|---|---|---|---|
| E-posta adresin | ✓ | | |
| Maç notların | ✓ | | |
| Elle yazdığın rakip adları, kişisel maçların | ✓ | | |
| Görünen adın, figürün, profil fotoğrafın | ✓ | ✓ | ✓ |
| Bağlı bir rakiple kaydettiğin maç (skor, tarih, saat, kort — not hariç) | ✓ | ✓ (yalnızca o rakip) | |
| Maç teklifleri | ✓ | ✓ (yalnızca teklifin tarafı) | |
| Turnuva sonuçların, maç saatlerin, turnuva fotoğrafı | ✓ | | ✓ |

Engellediğin kişiler profil fotoğrafını göremez, sana bağlantı isteği ve maç
teklifi gönderemez.

## 3. Neden işliyoruz? (Hukuki sebepler)

- **Hizmeti sunmak** — hesabını açmak, maçlarını saklamak, rakiplerinle
  eşleştirmek, turnuvaları yürütmek, bildirim göndermek. KVKK md. 5/2-c
  (sözleşmenin kurulması ve ifası).
- **Güvenlik ve kötüye kullanımı önlemek** — fotoğrafların otomatik denetimi,
  bildirimler, engellemeler. KVKK md. 5/2-f (meşru menfaat).
- **Yasal yükümlülükler** — hukuka aykırı içeriğin kaldırılması ve resmi
  makamların talepleri. KVKK md. 5/2-ç.

Verilerin reklam, profilleme ya da yüz tanıma için kullanılmaz.

## 4. Profil ve turnuva fotoğrafları

- Fotoğraf yüklemek isteğe bağlıdır. Galerine erişilmez; uygulama yalnızca
  seçtiğin fotoğrafı görür.
- Fotoğraf telefonunda 512×512 piksele küçültülüp yeniden kaydedilir. Bu
  sırada fotoğrafın içine gömülü bilgiler (çekildiği konum, cihaz, tarih)
  **silinir**.
- Her fotoğraf yayına girmeden önce uygunsuz içerik (çıplaklık, şiddet vb.)
  açısından **otomatik olarak** kontrol edilir. Bunun için fotoğraf, hizmet
  sağlayıcımız OpenAI'ın içerik denetim servisine gönderilir. Kontrolü
  geçemeyen fotoğraf hemen silinir.
- Fotoğraflar herkese kapalı bir depoda tutulur ve yalnızca 2. bölümde
  yazan kişilere, kısa süre geçerli bağlantılarla gösterilir.
- Uygunsuz bulunan bir fotoğraf uygulamadan bildirilebilir; bildirilen
  fotoğraf incelenene kadar gizlenir.
- Fotoğrafını kaldırdığında, değiştirdiğinde ya da hesabını sildiğinde
  sunucudan da silinir.

## 5. Hizmet sağlayıcılar ve yurt dışına aktarım

| Sağlayıcı | Ne için | Nerede |
|---|---|---|
| Supabase | Veritabanı, dosya deposu, giriş | Almanya (Frankfurt) |
| Expo (650 Industries, Inc.) | Bildirimlerin iletilmesi | ABD |
| Apple (APNs), Google (FCM) | Bildirimlerin cihazına teslimi | ABD |
| OpenAI, L.L.C. | Yalnızca yüklenen fotoğrafların otomatik denetimi | ABD |

OpenAI, API üzerinden gönderilen verileri model eğitiminde kullanmaz;
kötüye kullanımı izlemek için en fazla 30 gün saklayabilir.

Bu sağlayıcılar Türkiye dışında bulunduğundan verilerin KVKK md. 9 kapsamında
yurt dışına aktarılır. [Avukatına danışarak aktarım dayanağını buraya yaz —
örneğin Kurul'un yayımladığı standart sözleşme ve Kurum'a bildirimi.]

## 6. Ne kadar saklıyoruz?

- Hesabın ve içeriğin: hesabını silene kadar.
- Fotoğraflar: kaldırana, değiştirene ya da hesabını silene kadar.
- Gönderilmiş bildirimlerin kaydı: 30 gün.
- Fotoğraf denetim kayıtları: hesabın silindiğinde kimliğinden ayrılır.

## 7. Hesabını silmek

Ayarlar → **Hesabı sil**. Hesabın, profilin, fotoğrafların, maçların,
rakiplerin, bağlantıların ve tekliflerin kalıcı olarak silinir.

- Bağlı rakiplerinle paylaştığın maçların onların listesinden de silinir.
- Turnuvalarda oynanmış maçlar diğer oyuncular için kalır; adının yerinde
  "Bilinmiyor" görünür.

## 8. Hakların

KVKK md. 11 uyarınca; verilerinin işlenip işlenmediğini öğrenme, bilgi
isteme, düzeltilmesini ya da silinmesini isteme, aktarıldığı kişileri öğrenme,
itiraz etme ve zararının giderilmesini talep etme hakların vardır.
Taleplerin için **auratics.studio@gmail.com** adresine yaz; en geç 30 gün
içinde cevap veririz.

## 9. Güvenlik

Bağlantılar şifrelidir (TLS). Veritabanında her kayıt satır düzeyinde
erişim kurallarıyla korunur: başkasının verisini okuyamaz, değiştiremezsin.
Fotoğraflar herkese kapalı depoda tutulur.

## 10. Çocuklar

KortPro 13 yaşından küçükler için tasarlanmamıştır. 18 yaşından küçüksen
uygulamayı velinin bilgisi ve onayıyla kullan.

## 11. Değişiklikler

Bu metni güncelleyebiliriz. Önemli değişiklikleri uygulama içinden duyururuz.

## 12. İletişim

auratics.studio@gmail.com
