# Ankiel Studio SEO Checklist

Notatka do monitorowania SEO po wdrożeniu zmian na `https://ankiel-studio.com`.

## Co jest już zrobione

- Domena `ankiel-studio.com` została zweryfikowana w Google Search Console.
- Sitemap została wysłana:
  `https://ankiel-studio.com/sitemap.xml`
- Najważniejsze URL-e zostały zgłoszone do indeksacji:
  - `https://ankiel-studio.com/en/`
  - `https://ankiel-studio.com/pl/`
  - `https://ankiel-studio.com/en/premium-web-design`
  - `https://ankiel-studio.com/en/landing-pages`
  - `https://ankiel-studio.com/en/flask-web-development`
  - `https://ankiel-studio.com/en/dashboard-development`
- Strona ma przygotowane:
  - canonical URLs
  - hreflang dla EN/PL
  - sitemap
  - robots.txt
  - schema.org / structured data
  - osobne podstrony SEO dla usług i case study

## Kiedy sprawdzać

### Po 24-48 godzinach

Wejść w Google Search Console i sprawdzić:

- **Sitemaps / Mapy witryn**
  - czy sitemap ma status `Success` / `Sukces`
  - czy Google widzi URL-e z mapy

- **URL Inspection / Sprawdzenie adresu URL**
  Sprawdzić:
  - `https://ankiel-studio.com/en/`
  - `https://ankiel-studio.com/pl/`
  - `https://ankiel-studio.com/en/premium-web-design`

Możliwy status:

- `Discovered - currently not indexed`
  To normalne na początku. Google zna URL, ale jeszcze go nie zindeksował.

- `Crawled - currently not indexed`
  Google odwiedził stronę, ale jeszcze nie dodał jej do indeksu. Trzeba poczekać i budować sygnały jakości/linki.

- `URL is on Google`
  Najlepszy status. Strona jest zindeksowana.

### Po 7 dniach

Sprawdzić ponownie te same URL-e.

Najważniejsze pytania:

- Czy `/en/` jest zindeksowane?
- Czy `/pl/` jest zindeksowane?
- Czy podstrony usług zaczynają być indeksowane?
- Czy Google-selected canonical zgadza się z user-declared canonical?

## Jak analizować canonical

W URL Inspection sprawdzić pola:

- **User-declared canonical**
- **Google-selected canonical**

Dobrze, jeśli oba wskazują ten sam adres, np.

`https://ankiel-studio.com/en/premium-web-design`

Jeśli Google wybiera inny canonical, trzeba sprawdzić:

- czy strona nie ma duplikatu,
- czy sitemap wskazuje właściwy URL,
- czy linki wewnętrzne prowadzą do właściwej wersji,
- czy nie ma pomieszania `/`, `/en/`, `/pl/`.

## Co oznaczają typowe statusy

### Strona wykryta - obecnie niezindeksowana

Google zna URL, najczęściej z sitemap.xml, ale jeszcze go nie odwiedził.

Co robić:

- poczekać kilka dni,
- upewnić się, że URL działa,
- dodać linki wewnętrzne i zewnętrzne,
- nie zgłaszać tej samej strony codziennie.

### Strona zeskanowana - obecnie niezindeksowana

Google odwiedził stronę, ale nie uznał jeszcze, że warto ją dodać do indeksu.

Co robić:

- rozbudować treść na stronie,
- dodać więcej unikalnych case studies,
- zdobyć linki zewnętrzne,
- sprawdzić, czy treść nie jest zbyt podobna do innych podstron.

### Zindeksowano

Strona jest w Google.

Co robić:

- obserwować zapytania i pozycje,
- poprawiać title/description na podstawie CTR,
- dodawać treść pod frazy, które zaczynają się pojawiać.

## Co sprawdzać w Performance

W Google Search Console wejść w:

**Performance / Skuteczność**

Analizować:

- **Queries / Zapytania**
  Frazy, na które strona zaczyna się pojawiać.

- **Pages / Strony**
  Które URL-e mają wyświetlenia i kliknięcia.

- **CTR**
  Jeśli dużo wyświetleń i mało kliknięć, warto poprawić title/meta description.

- **Average position**
  Pozycja średnia. Na początku może być bardzo niska.

## Na co patrzeć po 2-4 tygodniach

Najważniejsze sygnały:

- czy rośnie liczba wyświetleń,
- czy pojawiają się zapytania związane z:
  - web design
  - landing pages
  - Flask development
  - dashboard development
  - premium websites
  - Ankiel Studio
- które podstrony zaczynają rankować,
- czy CTR jest sensowny.

## Co warto zrobić dalej

### 1. Linki zewnętrzne

Dodać link do strony w miejscach typu:

- LinkedIn profil
- GitHub profil
- stopka maila
- portfolio / CV
- social media
- katalogi freelancerów lub firm

Linki zewnętrzne bardzo pomagają nowej domenie.

### 2. Rozbudować case studies

Najlepsze SEO dla takiej strony to realne projekty.

Dodać kolejne podstrony:

- `/en/work/...`
- `/pl/work/...`

Każde case study powinno mieć:

- problem klienta,
- zakres,
- rozwiązanie,
- technologie,
- rezultat,
- screeny,
- link live, jeśli można.

### 3. Rozbudować usługi

Podstrony usług mogą mieć więcej treści:

- dla kogo jest usługa,
- co zawiera,
- proces,
- pricing range,
- FAQ,
- przykłady zastosowania.

### 4. PageSpeed Insights

Sprawdzić:

`https://pagespeed.web.dev/`

Najważniejsze:

- mobile performance,
- LCP,
- CLS,
- TBT/INP,
- rozmiar obrazów,
- wpływ Three.js.

## Minimalny harmonogram

### Tydzień 1

- Sprawdzić indeksację URL-i.
- Sprawdzić sitemap status.
- Dodać linki z profili zewnętrznych.

### Tydzień 2

- Sprawdzić Performance w Search Console.
- Zobaczyć pierwsze zapytania.
- Poprawić title/meta, jeśli CTR jest niski.

### Tydzień 3-4

- Dodać lub rozbudować case study.
- Rozbudować podstrony usług.
- Sprawdzić PageSpeed.

## Ważne

SEO nie działa natychmiast. Po technicznym wdrożeniu Google potrzebuje czasu na:

- crawl,
- indeksację,
- ocenę jakości,
- zebranie danych o kliknięciach,
- porównanie strony z konkurencją.

Najważniejsze teraz to nie zmieniać co chwilę URL-i. Obecna struktura `/en/`, `/pl/` i podstrony usług powinna zostać stabilna.
