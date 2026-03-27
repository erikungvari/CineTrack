USE cinetrack;

-- ===== USERS =====
INSERT INTO users (user_id, username, email, created_at) VALUES (11111111-1111-1111-1111-111111111111, 'alice', 'alice@example.com', '2025-01-01T00:00:00Z');
INSERT INTO users (user_id, username, email, created_at) VALUES (22222222-2222-2222-2222-222222222222, 'bob', 'bob@example.com', '2025-01-02T00:00:00Z');
INSERT INTO users (user_id, username, email, created_at) VALUES (33333333-3333-3333-3333-333333333333, 'charlie', 'charlie@example.com', '2025-01-03T00:00:00Z');

-- ===== TITLES BY GENRE =====
-- Action
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Action', aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 'The Dark Knight', 2008, 'movie', 9120, 'Christopher Nolan', ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'], 4.8, 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg');
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Action', bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb, 'Mad Max: Fury Road', 2015, 'movie', 7200, 'George Miller', ['Tom Hardy', 'Charlize Theron'], 4.5, 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper and a drifter named Max.', 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg');
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Action', cccccccc-cccc-cccc-cccc-cccccccccccc, 'John Wick', 2014, 'movie', 6060, 'Chad Stahelski', ['Keanu Reeves', 'Michael Nyqvist'], 4.3, 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.', 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg');

-- Sci-Fi
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Sci-Fi', dddddddd-dddd-dddd-dddd-dddddddddddd, 'Interstellar', 2014, 'movie', 10140, 'Christopher Nolan', ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'], 4.7, 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg');
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Sci-Fi', eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee, 'Blade Runner 2049', 2017, 'movie', 9900, 'Denis Villeneuve', ['Ryan Gosling', 'Harrison Ford'], 4.4, 'Young Blade Runner Ks discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.', 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg');
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Sci-Fi', ffffffff-ffff-ffff-ffff-ffffffffffff, 'Dune', 2021, 'movie', 9360, 'Denis Villeneuve', ['Timothee Chalamet', 'Zendaya', 'Oscar Isaac'], 4.6, 'Feature adaptation of Frank Herberts science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy.', 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg');

-- Drama
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Drama', 11111111-aaaa-bbbb-cccc-111111111111, 'The Shawshank Redemption', 1994, 'movie', 8520, 'Frank Darabont', ['Tim Robbins', 'Morgan Freeman'], 4.9, 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg');
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Drama', 22222222-aaaa-bbbb-cccc-222222222222, 'Breaking Bad', 2008, 'series', 2880, 'Vince Gilligan', ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'], 4.8, 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.', 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg');
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Drama', 33333333-aaaa-bbbb-cccc-333333333333, 'The Godfather', 1972, 'movie', 10500, 'Francis Ford Coppola', ['Marlon Brando', 'Al Pacino', 'James Caan'], 4.9, 'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg');

-- Comedy
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Comedy', 44444444-aaaa-bbbb-cccc-444444444444, 'The Grand Budapest Hotel', 2014, 'movie', 5940, 'Wes Anderson', ['Ralph Fiennes', 'Tony Revolori', 'Saoirse Ronan'], 4.3, 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotels legendary concierge.', 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg');
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Comedy', 55555555-aaaa-bbbb-cccc-555555555555, 'The Office', 2005, 'series', 1320, 'Greg Daniels', ['Steve Carell', 'Rainn Wilson', 'John Krasinski'], 4.6, 'A mockumentary on a group of typical office workers, where the weights of the boss try hard to keep spirits up.', 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg');

-- Horror
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Horror', 66666666-aaaa-bbbb-cccc-666666666666, 'Get Out', 2017, 'movie', 6240, 'Jordan Peele', ['Daniel Kaluuya', 'Allison Williams'], 4.5, 'A young African-American visits his white girlfriends parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.', 'https://image.tmdb.org/t/p/w500/eiNek5p6kPUcDPrw13xRq9sCnHV.jpg');
INSERT INTO titles_by_genre (genre, title_id, title, year, type, duration_s, director, cast_list, avg_rating, description, poster_url) VALUES ('Horror', 77777777-aaaa-bbbb-cccc-777777777777, 'Stranger Things', 2016, 'series', 3000, 'The Duffer Brothers', ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'], 4.6, 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.', 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg');

-- ===== WATCH HISTORY (Alice) =====
INSERT INTO watch_history_by_user (user_id, watched_at, title_id, title, genre, progress_s, completed) VALUES (11111111-1111-1111-1111-111111111111, '2026-03-01T20:00:00Z', aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 'The Dark Knight', 'Action', 9120, true);
INSERT INTO watch_history_by_user (user_id, watched_at, title_id, title, genre, progress_s, completed) VALUES (11111111-1111-1111-1111-111111111111, '2026-03-05T19:00:00Z', dddddddd-dddd-dddd-dddd-dddddddddddd, 'Interstellar', 'Sci-Fi', 10140, true);
INSERT INTO watch_history_by_user (user_id, watched_at, title_id, title, genre, progress_s, completed) VALUES (11111111-1111-1111-1111-111111111111, '2026-03-10T21:00:00Z', 11111111-aaaa-bbbb-cccc-111111111111, 'The Shawshank Redemption', 'Drama', 5000, false);
INSERT INTO watch_history_by_user (user_id, watched_at, title_id, title, genre, progress_s, completed) VALUES (11111111-1111-1111-1111-111111111111, '2026-03-15T18:00:00Z', ffffffff-ffff-ffff-ffff-ffffffffffff, 'Dune', 'Sci-Fi', 9360, true);

-- ===== WATCH HISTORY (Bob) =====
INSERT INTO watch_history_by_user (user_id, watched_at, title_id, title, genre, progress_s, completed) VALUES (22222222-2222-2222-2222-222222222222, '2026-03-02T20:00:00Z', bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb, 'Mad Max: Fury Road', 'Action', 7200, true);
INSERT INTO watch_history_by_user (user_id, watched_at, title_id, title, genre, progress_s, completed) VALUES (22222222-2222-2222-2222-222222222222, '2026-03-08T19:30:00Z', 22222222-aaaa-bbbb-cccc-222222222222, 'Breaking Bad', 'Drama', 2880, true);
INSERT INTO watch_history_by_user (user_id, watched_at, title_id, title, genre, progress_s, completed) VALUES (22222222-2222-2222-2222-222222222222, '2026-03-12T21:00:00Z', aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 'The Dark Knight', 'Action', 9120, true);

-- ===== WATCH PROGRESS =====
INSERT INTO watch_progress (user_id, title_id, progress_s, updated_at, completed) VALUES (11111111-1111-1111-1111-111111111111, aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 9120, '2026-03-01T22:00:00Z', true);
INSERT INTO watch_progress (user_id, title_id, progress_s, updated_at, completed) VALUES (11111111-1111-1111-1111-111111111111, dddddddd-dddd-dddd-dddd-dddddddddddd, 10140, '2026-03-05T22:00:00Z', true);
INSERT INTO watch_progress (user_id, title_id, progress_s, updated_at, completed) VALUES (11111111-1111-1111-1111-111111111111, 11111111-aaaa-bbbb-cccc-111111111111, 5000, '2026-03-10T22:00:00Z', false);
INSERT INTO watch_progress (user_id, title_id, progress_s, updated_at, completed) VALUES (11111111-1111-1111-1111-111111111111, ffffffff-ffff-ffff-ffff-ffffffffffff, 9360, '2026-03-15T20:00:00Z', true);
INSERT INTO watch_progress (user_id, title_id, progress_s, updated_at, completed) VALUES (22222222-2222-2222-2222-222222222222, bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb, 7200, '2026-03-02T22:00:00Z', true);
INSERT INTO watch_progress (user_id, title_id, progress_s, updated_at, completed) VALUES (22222222-2222-2222-2222-222222222222, 22222222-aaaa-bbbb-cccc-222222222222, 2880, '2026-03-08T22:00:00Z', true);
INSERT INTO watch_progress (user_id, title_id, progress_s, updated_at, completed) VALUES (22222222-2222-2222-2222-222222222222, aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 9120, '2026-03-12T23:00:00Z', true);

-- ===== RATINGS (write-to-both: ratings_by_user + ratings_by_title) =====
-- Alice rates
INSERT INTO ratings_by_user (user_id, title_id, rating, rated_at) VALUES (11111111-1111-1111-1111-111111111111, aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 5, '2026-03-01T23:00:00Z');
INSERT INTO ratings_by_title (title_id, user_id, rating, rated_at) VALUES (aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 11111111-1111-1111-1111-111111111111, 5, '2026-03-01T23:00:00Z');

INSERT INTO ratings_by_user (user_id, title_id, rating, rated_at) VALUES (11111111-1111-1111-1111-111111111111, dddddddd-dddd-dddd-dddd-dddddddddddd, 5, '2026-03-05T23:00:00Z');
INSERT INTO ratings_by_title (title_id, user_id, rating, rated_at) VALUES (dddddddd-dddd-dddd-dddd-dddddddddddd, 11111111-1111-1111-1111-111111111111, 5, '2026-03-05T23:00:00Z');

INSERT INTO ratings_by_user (user_id, title_id, rating, rated_at) VALUES (11111111-1111-1111-1111-111111111111, ffffffff-ffff-ffff-ffff-ffffffffffff, 4, '2026-03-15T23:00:00Z');
INSERT INTO ratings_by_title (title_id, user_id, rating, rated_at) VALUES (ffffffff-ffff-ffff-ffff-ffffffffffff, 11111111-1111-1111-1111-111111111111, 4, '2026-03-15T23:00:00Z');

-- Bob rates
INSERT INTO ratings_by_user (user_id, title_id, rating, rated_at) VALUES (22222222-2222-2222-2222-222222222222, bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb, 4, '2026-03-02T23:00:00Z');
INSERT INTO ratings_by_title (title_id, user_id, rating, rated_at) VALUES (bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb, 22222222-2222-2222-2222-222222222222, 4, '2026-03-02T23:00:00Z');

INSERT INTO ratings_by_user (user_id, title_id, rating, rated_at) VALUES (22222222-2222-2222-2222-222222222222, aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 5, '2026-03-12T23:30:00Z');
INSERT INTO ratings_by_title (title_id, user_id, rating, rated_at) VALUES (aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 22222222-2222-2222-2222-222222222222, 5, '2026-03-12T23:30:00Z');

INSERT INTO ratings_by_user (user_id, title_id, rating, rated_at) VALUES (22222222-2222-2222-2222-222222222222, 22222222-aaaa-bbbb-cccc-222222222222, 5, '2026-03-08T23:00:00Z');
INSERT INTO ratings_by_title (title_id, user_id, rating, rated_at) VALUES (22222222-aaaa-bbbb-cccc-222222222222, 22222222-2222-2222-2222-222222222222, 5, '2026-03-08T23:00:00Z');

-- Charlie rates
INSERT INTO ratings_by_user (user_id, title_id, rating, rated_at) VALUES (33333333-3333-3333-3333-333333333333, aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 4, '2026-03-20T10:00:00Z');
INSERT INTO ratings_by_title (title_id, user_id, rating, rated_at) VALUES (aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, 33333333-3333-3333-3333-333333333333, 4, '2026-03-20T10:00:00Z');

-- ===== WATCHLIST =====
INSERT INTO watchlist_by_user (user_id, added_at, title_id, title, genre) VALUES (11111111-1111-1111-1111-111111111111, '2026-03-10T10:00:00Z', cccccccc-cccc-cccc-cccc-cccccccccccc, 'John Wick', 'Action');
INSERT INTO watchlist_by_user (user_id, added_at, title_id, title, genre) VALUES (11111111-1111-1111-1111-111111111111, '2026-03-11T10:00:00Z', eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee, 'Blade Runner 2049', 'Sci-Fi');
INSERT INTO watchlist_by_user (user_id, added_at, title_id, title, genre) VALUES (22222222-2222-2222-2222-222222222222, '2026-03-05T12:00:00Z', 33333333-aaaa-bbbb-cccc-333333333333, 'The Godfather', 'Drama');

-- ===== TITLE POPULARITY (COUNTER updates) =====
UPDATE title_popularity SET watch_count = watch_count + 3 WHERE genre = 'Action' AND month = '2026-03' AND title_id = aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa;
UPDATE title_popularity SET watch_count = watch_count + 1 WHERE genre = 'Action' AND month = '2026-03' AND title_id = bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb;
UPDATE title_popularity SET watch_count = watch_count + 2 WHERE genre = 'Sci-Fi' AND month = '2026-03' AND title_id = dddddddd-dddd-dddd-dddd-dddddddddddd;
UPDATE title_popularity SET watch_count = watch_count + 2 WHERE genre = 'Sci-Fi' AND month = '2026-03' AND title_id = ffffffff-ffff-ffff-ffff-ffffffffffff;
UPDATE title_popularity SET watch_count = watch_count + 1 WHERE genre = 'Drama' AND month = '2026-03' AND title_id = 11111111-aaaa-bbbb-cccc-111111111111;
UPDATE title_popularity SET watch_count = watch_count + 1 WHERE genre = 'Drama' AND month = '2026-03' AND title_id = 22222222-aaaa-bbbb-cccc-222222222222;
UPDATE title_popularity SET watch_count = watch_count + 1 WHERE genre = 'Horror' AND month = '2026-03' AND title_id = 77777777-aaaa-bbbb-cccc-777777777777;

-- ===== REVIEWS =====
INSERT INTO reviews_by_title (title_id, created_at, user_id, username, review_text, rating) VALUES (aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, '2026-03-01T23:30:00Z', 11111111-1111-1111-1111-111111111111, 'alice', 'Absolutely phenomenal film! Heath Ledger delivers a once-in-a-lifetime performance as the Joker.', 5);
INSERT INTO reviews_by_title (title_id, created_at, user_id, username, review_text, rating) VALUES (aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, '2026-03-12T23:45:00Z', 22222222-2222-2222-2222-222222222222, 'bob', 'A masterpiece of modern cinema. The action sequences are incredible and the story is gripping from start to finish.', 5);
INSERT INTO reviews_by_title (title_id, created_at, user_id, username, review_text, rating) VALUES (dddddddd-dddd-dddd-dddd-dddddddddddd, '2026-03-05T23:30:00Z', 11111111-1111-1111-1111-111111111111, 'alice', 'Mind-blowing visuals and a heart-wrenching story. Nolan at his finest.', 5);
INSERT INTO reviews_by_title (title_id, created_at, user_id, username, review_text, rating) VALUES (bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb, '2026-03-02T23:30:00Z', 22222222-2222-2222-2222-222222222222, 'bob', 'Non-stop adrenaline rush. The practical effects are unbelievable.', 4);
