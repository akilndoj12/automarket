# PRESTIGE MOTORS ALBANIA — Platformë për shitjen e automjeteve premium

Faqe për shitjen e makinave ku **vetëm administratori** publikon, ndryshon dhe fshin makinat.
Klientët i shikojnë, i filtrojnë dhe kontaktojnë me WhatsApp, telefon ose formular.

**Teknologjitë:** Next.js 15 · Supabase (databaza, fotot, identifikimi) · Tailwind CSS · Vercel

---

## Çfarë ka brenda (Faza 1)

| Faqja | Adresa | Çfarë bën |
|---|---|---|
| Kryefaqja | `/` | Kërkimi, makinat më të fundit, ofertat |
| Të gjitha makinat | `/makinat` | Lista + filtra (marka, modeli, viti, çmimi, km, karburanti, kambio, tipi) + renditja |
| Detajet e makinës | `/makinat/[id]` | Galeri fotosh, video, parametrat, opsionet, butoni WhatsApp, formular |
| Ofertat | `/oferta` | Makinat me çmim të ulur |
| Të shitura | `/te-shitura` | Makinat e shitura |
| Rreth nesh / Kontakt | `/rreth-nesh`, `/kontakt` | Info e kompanisë, formular kontakti, harta |
| **Paneli Admin** | `/admin` | Shto / ndrysho / fshi makina, foto, statusi, ofertat, kërkesat, cilësimet |

Pa Supabase, faqja hapet në **mënyrë demo** me 6 makina shembull — kështu mund ta shohësh menjëherë.

---

## Si ta vësh në punë (rreth 20 minuta)

### 1. Krijo databazën në Supabase
1. Hyr në [supabase.com](https://supabase.com) → **New project** (zgjidh rajonin *Frankfurt* / *EU Central*).
2. Kur të krijohet, shko te **SQL Editor** → **New query**.
3. Kopjo të gjithë përmbajtjen e skedarit [`supabase/schema.sql`](supabase/schema.sql), ngjite dhe kliko **Run**.

### 2. Krijo llogarinë e administratorit
1. **Authentication → Users → Add user → Create new user** — vendos email-in dhe fjalëkalimin tënd (shëno *Auto Confirm User*).
2. Te **SQL Editor** ekzekuto (me email-in tënd):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'emaili-yt@gmail.com';
   ```
3. **Shumë e rëndësishme:** **Authentication → Sign In / Providers → Email** → çaktivizo **Allow new users to sign up**.
   Kështu askush tjetër nuk mund të krijojë llogari.

### 3. Merr çelësat
**Project Settings → API** (ose *Data API*) → kopjo:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> Çelësi `service_role` **nuk** duhet të vendoset kurrë në këtë projekt.

### 4. Publikoje në Vercel
1. Hyr në [vercel.com](https://vercel.com) me GitHub → **Add New → Project** → zgjidh repon `automarket`.
2. Te **Environment Variables** shto:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = adresa e faqes (p.sh. `https://automarket.vercel.app`)
3. **Deploy**. Pas 1–2 minutash faqja është online.
4. Hyr te `https://adresa-jote/admin/login` me email-in dhe fjalëkalimin e hapit 2.
5. Te **Cilësimet** vendos emrin e kompanisë, telefonin, numrin e WhatsApp, adresën.

### 5. (Opsionale) Domain-i yt, p.sh. `automarket.al`
Vercel → Project → **Settings → Domains** → shto domain-in dhe ndiq udhëzimet për DNS.
Pastaj ndrysho `NEXT_PUBLIC_SITE_URL` dhe bëj *Redeploy*.

---

## Si e përdor administratori

- **+ Shto makinë** → plotëso të dhënat, ngarko fotot (nga telefoni ose kompjuteri), kliko *Publiko makinën*.
- Fotoja e parë është kryesore; rendit me shigjeta ose duke i tërhequr. Fotot zvogëlohen automatikisht.
- **Ofertë:** vendos *Çmimi i mëparshëm* më të lartë se çmimi aktual → makina del te `/oferta` me % zbritje.
- **Statusi:** Aktive / Rezervuar / Shitur — ndryshohet direkt nga lista e makinave.
- **Fshih** e heq makinën nga faqja pa e fshirë; **Fshi** e heq përgjithmonë bashkë me fotot.
- **VIN:** ruhet gjithmonë privatisht; shfaqet publikisht vetëm nëse shënon kutinë.
- **Kërkesat:** mesazhet e klientëve nga formularët, me butona për telefon / WhatsApp / email.

## Siguria
- Publiku mund të **lexojë** vetëm makinat e publikuara dhe të **dërgojë** kërkesa.
- Vetëm përdoruesit në tabelën `admins` mund të shtojnë, ndryshojnë ose fshijnë — kontrollohet
  **në server** (`requireAdmin`) dhe **në databazë** (Row Level Security te `schema.sql`).
- VIN-i i plotë dhe shënimet private ruhen te tabela `car_private`, e padukshme për publikun.

## Zhvillimi në kompjuter
```bash
npm install
cp .env.example .env.local   # vendos çelësat
npm run dev                  # http://localhost:3000
```

## Fazat e ardhshme
- **Faza 2:** statistikat e vizitave, rezervimet, historiku i çmimeve, krahasimi i makinave.
- **Faza 3:** makina nga jashtë, llogaritja e transportit, porositë, ndjekja e importit, llogari klientësh.
