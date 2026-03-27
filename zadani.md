***

# Streamovací platforma – CineTrack

## Úvod a kontext
Vytvořte full-stack aplikaci **CineTrack** pro správu uživatelských profilů, sledování filmů a seriálů, hodnocení a personalizovaná doporučení. Důraz je kladen na vysokou čitelnost pro uživatelsky specifické dotazy a na správný návrh datového modelu v databázi Apache Cassandra.

---

## Povinné dotazy (Queries)
Tato aplikace musí efektivně obsloužit následující dotazy nad databází:

* **Q1:** Získej historii sledování uživatele `U`.
* **Q2:** Zjisti progress konkrétního titulu pro uživatele `U`.
* **Q3:** Získej hodnocení uživatele `U` pro titul `T`.
* **Q4:** Získej průměrné hodnocení titulu `T`.
* **Q5:** Získej watchlist uživatele `U`.
* **Q6:** Získej top-10 nejsledovanějších titulů v žánru za posledních 30 dní.
* **Q7:** Získej doporučené tituly pro uživatele `U`.
* **Q8:** Získej všechny recenze pro titul `T`.

---

## Tabulky Cassandra
Návrh datového modelu využívá denormalizované tabulky optimalizované pro čtení:

* `titles_by_genre` (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url)
* `watch_history_by_user` (user_id, watched_at, title_id, title, genre, progress_s, completed)
* `watch_progress` (user_id, title_id, progress_s, updated_at, completed)
* `ratings_by_user` (user_id, title_id, rating, rated_at)
* `ratings_by_title` (title_id, user_id, rating, rated_at)
* `watchlist_by_user` (user_id, added_at, title_id, title, genre)
* `title_popularity` (genre, month, title_id, watch_count) — **COUNTER tabulka**
* `reviews_by_title` (title_id, created_at, user_id, username, review_text, rating)

---

## Klíčové výzvy
Při vývoji je nutné se zaměřit na následující architektonické a technické výzvy:
* Práce s **COUNTER** tabulkami.
* **Write-to-both pattern** pro hodnocení (zápis do více tabulek současně).
* Dopočet průměrného ratingu na straně backendu.
* Implementace **Token-based** stránkování (pagination).
* Správná denormalizace dat.

---

## Backend (REST API)

**Tituly a vyhledávání**
* **`GET`** `/api/titles?genre=&limit=&page_state=`
* **`GET`** `/api/titles/:id`
* **`POST`** `/api/titles`

**Uživatelé a interakce**
* **`POST`** `/api/users/register`
* **`POST`** `/api/watch` *(zaznamenání sledování/progressu)*
* **`GET`** `/api/users/:id/history?limit=20`
* **`GET`** `/api/users/:id/progress/:titleId`
* **`GET`** `/api/users/:id/recommendations`

**Hodnocení a recenze**
* **`POST`** `/api/ratings`
* **`GET`** `/api/titles/:id/rating`
* **`POST`** `/api/reviews`
* **`GET`** `/api/titles/:id/reviews?limit=10`

**Watchlist**
* **`POST`** `/api/users/:id/watchlist`
* **`GET`** `/api/users/:id/watchlist`
* **`DELETE`** `/api/users/:id/watchlist/:titleId`

**Analytika**
* **`GET`** `/api/analytics/trending?genre=&months=1`

---

## Frontend
Uživatelské rozhraní by mělo obsahovat následující pohledy a komponenty:
* **Home:** Hlavní stránka s řadami titulů (podobně jako Netflix).
* **Profil uživatele:** Přehled historie, watchlistu a nastavení.
* **Detail titulu:** Informace o filmu/seriálu, přehrávač, recenze a hodnocení.
* **Vyhledávání a filtry:** Katalog titulů s možností filtrování podle žánrů a dalších kritérií.
* **Doporučení:** Personalizovaná sekce na základě historie sledování.

---

## Testovací scénář
Pro ověření funkčnosti aplikace proveďte následující kroky:
1.  **Vložení dat:** Naplnění databáze testovacími tituly a uživateli.
2.  **Sledování a hodnocení:** Simulace aktivit uživatelů (watch progress, odesílání ratingů a recenzí).
3.  **Ověření průměrného hodnocení:** Kontrola, zda backend správně dopočítává a aktualizuje `avg_rating`.
4.  **Ověření trending sekce:** Validace dat z COUNTER tabulky pro top-10 tituly.
5.  **Ověření doporučení:** Kontrola relevance navrhovaných titulů pro konkrétního uživatele.

***

Můžu ti s tímto projektem pomoct i dál. Chtěl bys například navrhnout přesné CQL (Cassandra Query Language) dotazy pro vytvoření těchto tabulek, nebo pomoct se strukturou backendu?