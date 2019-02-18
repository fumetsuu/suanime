# Masterani.me API

### Endpoints
- **releases**: `https://www.masterani.me/api/releases`
- **anime**: `https://www.masterani.me/api/anime/ (base url)`
   - **info**: `https://www.masterani.me/api/anime/:id`
   - **detailed**: `https://www.masterani.me/api/anime/:id/detailed`
   - **search**: `https://www.masterani.me/api/anime/search`
   - **filter**: `https://www.masterani.me/api/anime/filter`
   - **trending**: `https://www.masterani.me/api/anime/trending`

#### Methods
##### releases: `https://www.masterani.me/api/releases`
>returns an array of anime info pertaining to the recent releases of up to 7 days ago
```json
[
	{
		"anime": {
			"id": 2799,
			"title": "Hitori no Shita: The Outcast 2nd Season",
			"slug": "2799-hitori-no-shita-the-outcast-2nd-season",
			"duration": 24,
			"age": "R - 17+ (violence & profanity)",
			"poster": "2799cJb529TO.jpg",
			"wallpaper": null
		},
		"episode": "3",
		"created_at": "2018-01-30 18:58:11"
	},
	{
		"anime": {
			"id": 2750,
			"title": "Overlord II",
			"slug": "2750-overlord-ii",
			"duration": 23,
			"age": "R - 17+ (violence & profanity)",
			"poster": "2750ECRzYMUE.jpg",
			"wallpaper": "27500edzORcT.jpg"
		},
		"episode": "4",
		"created_at": "2018-01-30 15:07:43"
	}, 
	{
	"anime": {
	    "id": 2514,
	    "title": "Boruto: Naruto Next Generations",
	    "slug": "2514-boruto-naruto-next-generations",
	    "duration": 23,
	    "age": "PG-13 - Teens 13 or older",
	    "poster": "2514pwtPLckB.jpg",
	    "wallpaper": "2514ATfcUPfy.jpg"
	},
	"episode": "42",
	"created_at": "2018-01-24 09:35:10"
	}
]
```
`note: some results were omitted for brevity`

<br><hr><br>

#### anime
<section style="margin-left: 50px">

  ##### info `https://www.masterani.me/api/anime/:id`

  |Parameter|Type|Desc|
  |---------|----|---|
  |**id**  |int |Masterani anime id|

  >returns basic info about requested anime \
  >e.g.: `https://www.masterani.me/api/anime/2780`
  ```json
  {
      "id": 2780,
      "title": "Sora yori mo Tooi Basho",
      "slug": "2780-sora-yori-mo-tooi-basho",
      "status": 1,
      "type": 0,
      "score": 4.11,
      "episode_count": 13,
      "started_airing_date": "2018-01-02",
      "finished_airing_date": null
  }
  ```
  `"status": 0 (finished airing)` \
  `"status": 1 (currently airing)`
  
</section>
<hr>
<section style="margin-left: 50px">

  ##### detailed `https://www.masterani.me/api/anime/:id/detailed`

  |Parameter|Type|Desc|
  |---------|----|---|
  |id		  |int |Masterani anime id|

  >returns detailed info about requested anime (synonyms, genres, episodes, image links)\
  >e.g.: `https://www.masterani.me/api/anime/2790/detailed`
  ```json
{
	"info": {
		"id": 2790,
		"title": "Emiya-san Chi no Kyou no Gohan",
		"slug": "2790-emiya-san-chi-no-kyou-no-gohan",
		"synopsis": "The story revolves around the delicious, beautiful cuisine that the Emiya family enjoy from day to day, no matter what the season is.\r\n\r\n(Source: ANN)",
		"status": 1,
		"type": 4,
		"score": 3.83,
		"users_watching": 775,
		"users_completed": 14,
		"users_on_hold": 11,
		"users_planned": 191,
		"users_dropped": 20,
		"episode_count": null,
		"started_airing_date": "2017-12-31",
		"finished_airing_date": null,
		"youtube_trailer_id": "L2h556Ttqi4",
		"age_rating": "PG-13 - Teens 13 or older",
		"episode_length": 13,
		"tvdb_id": null,
		"tvdb_season_id": null,
		"tvdb_episode": null,
		"wallpaper_id": null,
		"wallpaper_offset": 10,
		"franchise_count": 1
	},
	"synonyms": [
		{
			"title": "Today's Menu for Emiya Family",
			"type": 1
		},
		{
			"title": "衛宮さんちの今日のごはん",
			"type": 2
		}
	],
	"genres": [
		{
			"id": 68,
			"name": "Slice of Life"
		},
		{
			"id": 59,
			"name": "Comedy"
		}
	],
	"poster": "2790FyGcAor6.jpg",
	"franchise_count": 1,
	"wallpapers": [],
	"episodes": [
		{
			"info": {
				"id": 44281,
				"anime_id": 2790,
				"episode": "1",
				"title": null,
				"tvdb_id": null,
				"aired": null,
				"type": 0,
				"duration": 0,
				"description": null
			},
			"thumbnail": null
		}
	]
}
  ```
  
</section>
<hr>
<section style="margin-left: 50px">

  ##### search `https://www.masterani.me/api/anime/search`

  |Parameter|Type|Desc|
  |---------|----|---|
  |**search**|string|search query (anime title)
  |_sb_|bool|(search bar: limits result count to 8 if true)

  >returns info about anime that fit the query \
  >e.g. `https://www.masterani.me/api/anime/search?search=gintama&sb=1`
  ```json
[
	{
		"id": 239,
		"title": "Gintama",
		"slug": "239-gintama",
		"started_airing_date": "2006-04-04",
		"type": 0,
		"poster": {
			"id": "239RF3XEvds",
			"path": "poster/",
			"extension": "jpg",
			"file": "239RF3XEvds.jpg"
		}
	},
	{
		"id": 1118,
		"title": "Gintama°",
		"slug": "1118-gintama",
		"started_airing_date": "2015-04-08",
		"type": 0,
		"poster": {
			"id": "1118kLTQZVZ8",
			"path": "poster/",
			"extension": "jpg",
			"file": "1118kLTQZVZ8.jpg"
		}
	},
	{
		"id": 1970,
		"title": "Gintama'",
		"slug": "1970-gintama",
		"started_airing_date": "2011-04-04",
		"type": 0,
		"poster": {
			"id": "1970mlVFIm5y",
			"path": "poster/",
			"extension": "jpg",
			"file": "1970mlVFIm5y.jpg"
		}
	},
	{
		"id": 2396,
		"title": "Gintama.",
		"slug": "2396-gintama-2017",
		"started_airing_date": "2017-01-09",
		"type": 0,
		"poster": {
			"id": "2396mIR2fbzo",
			"path": "poster/",
			"extension": "jpg",
			"file": "2396mIR2fbzo.jpg"
		}
	},
	{
		"id": 1224,
		"title": "Gintama Movie 1: Shinyaku Benizakura-hen",
		"slug": "1224-gintama-movie-shinyaku-benizakura-hen",
		"started_airing_date": "2010-04-24",
		"type": 2,
		"poster": {
			"id": "1224YCRxq6Im",
			"path": "poster/",
			"extension": "jpg",
			"file": "1224YCRxq6Im.jpg"
		}
	},
	{
		"id": 1971,
		"title": "Gintama': Enchousen",
		"slug": "1971-gintama-enchousen",
		"started_airing_date": "2012-10-04",
		"type": 0,
		"poster": {
			"id": "1971coXfbS9V",
			"path": "poster/",
			"extension": "jpg",
			"file": "1971coXfbS9V.jpg"
		}
	},
	{
		"id": 1087,
		"title": "Gintama Movie 2: Kanketsu-hen - Yorozuya yo Eien Nare",
		"slug": "1087-gintama-movie-kanketsu-hen-yorozuya-yo-eien-nare",
		"started_airing_date": "2013-07-06",
		"type": 2,
		"poster": {
			"id": "1087I6PLcCMq",
			"path": "poster/",
			"extension": "jpg",
			"file": "1087I6PLcCMq.jpg"
		}
	},
	{
		"id": 2066,
		"title": "Gintama°: Aizome Kaori-hen",
		"slug": "2066-gintama0-aizome-kaori-hen",
		"started_airing_date": "2016-08-04",
		"type": 1,
		"poster": {
			"id": "2066Mx7JE3HG",
			"path": "poster/",
			"extension": "jpg",
			"file": "2066Mx7JE3HG.jpg"
		}
	}
]
  ```
  
</section>
<hr>
<section style="margin-left: 50px">

  ##### filter `https://www.masterani.me/api/anime/filter`

  |Parameter|Type|Desc|Possible Values|
  |---------|----|---|---|
  |**order**|string |defines how to sort the anime |`score` `score_desc` `title` `title_desc`|
  |_type_|int|anime type : (All, TV, OVA, Movie, Special, ONA, Music)|`TV: 0` `OVA: 1` `Movie: 2` `Special: 3` `ONA: 4` `Music: 5`|
  |_status_|int|anime broadcast status| `Completed: 0` `Airing: 1` `Not Yet Aired: 2`|
  |_genres_|int|anime genre (comma separated for multiple, ie genres=57,83| (see list below)|
  |_page_|int|page number of results|varies based on search queries
  ```
  genres:
  	57: Action
    58: Adventure
    69: Cars
    59: Comedy
    84: Dementia
    86: Demons
    60: Drama
    79: Ecchi
    77: Fantasy
    93: Game
    89: Harem
    82: Historical
    71: Horror
    66: Josei
    95: Kids
    88: Magic
    75: Martial Arts
    85: Mecha
    83: Military
    90: Music
    63: Mystery
    94: Parody
    72: Police
    73: Psychological
    67: Romance
    87: Samurai
    78: School
    61: Sci-Fi
    70: Seinen
    91: Shoujo
    92: Shoujo Ai
    64: Shounen
    96: Shounen Ai
    68: Slice of Life
    62: Space
    65: Sports
    76: Super Power
    80: Supernatural
    74: Thriller
    81: Vampire
    98: Yaoi
    97: Yuri
  ```

  >returns sorted info about anime and info about search results (total, per_page, etc.) \
  >e.g.: `https://www.masterani.me/api/anime/filter?order=score_desc&status=1&genres=71`
  ```json
{
	"total": 2,
	"per_page": 56,
	"current_page": 1,
	"last_page": 1,
	"next_page_url": null,
	"prev_page_url": null,
	"from": 1,
	"to": 2,
	"data": [
		{
			"id": 2800,
			"title": "Shingeki no Kyojin: Lost Girls",
			"slug": "2800-shingeki-no-kyojin-lost-girls",
			"status": 1,
			"type": 1,
			"score": 4.25,
			"episode_count": 3,
			"started_airing_date": "2017-12-08",
			"finished_airing_date": "2018-08-09",
			"genres": [
				{
					"id": 57,
					"name": "Action"
				},
				{
					"id": 60,
					"name": "Drama"
				},
				{
					"id": 77,
					"name": "Fantasy"
				},
				{
					"id": 71,
					"name": "Horror"
				},
				{
					"id": 80,
					"name": "Supernatural"
				}
			],
			"poster": {
				"id": "2800lZhz8wfF",
				"path": "poster/",
				"extension": "jpg",
				"file": "2800lZhz8wfF.jpg"
			}
		},
		{
			"id": 2765,
			"title": "Ito Junji: Collection",
			"slug": "2765-ito-junji-collection",
			"status": 1,
			"type": 0,
			"score": 3.53,
			"episode_count": 12,
			"started_airing_date": "2018-01-05",
			"finished_airing_date": null,
			"genres": [
				{
					"id": 60,
					"name": "Drama"
				},
				{
					"id": 71,
					"name": "Horror"
				},
				{
					"id": 63,
					"name": "Mystery"
				},
				{
					"id": 73,
					"name": "Psychological"
				},
				{
					"id": 80,
					"name": "Supernatural"
				}
			],
			"poster": {
				"id": "2765fVdlq0zp",
				"path": "poster/",
				"extension": "jpg",
				"file": "2765fVdlq0zp.jpg"
			}
		}
	]
}
  ```
  
  
</section>
<hr>
<section style="margin-left: 50px">

  ##### trending `https://www.masterani.me/api/anime/trending`

  >returns being watched and popular today anime info \
  >e.g.: `https://www.masterani.me/api/anime/trending`

  ```json
    {
        "being_watched": [
            {
                "total": 372,
                "title": "Overlord II",
                "slug": "2750-overlord-ii",
                "poster": "2750ECRzYMUE.jpg"
            },
            {
                "total": 264,
                "title": "Black Clover",
                "slug": "2661-black-clover-tv",
                "poster": "2661Zu6tcSmH.jpg"
            },
            {
                "total": 34,
                "title": "Boruto: Naruto Next Generations",
                "slug": "2514-boruto-naruto-next-generations",
                "poster": "2514pwtPLckB.jpg"
            }
        ], 
            "popular_today": [
            {
                "total": 8118,
                "title": "One Piece",
                "slug": "64-one-piece",
                "poster": "646ILh0X4F.jpg"
            },
            {
                "total": 5442,
                "title": "Black Clover",
                "slug": "2661-black-clover-tv",
                "poster": "2661Zu6tcSmH.jpg"
            },
            {
                "total": 2147,
                "title": "Ryuuou no Oshigoto!",
                "slug": "2775-ryuuou-no-oshigoto",
                "poster": "2775KXYVovHr.jpg"
            }
        ]
    }
  ```
`note: some results were omitted for brevity`
  
</section>

<br><hr><br>

### Extra Info
<div style="margin-left: 50px">
	<h6> Slug </h6>
	&nbsp;&nbsp;&nbsp;&nbsp;slug is part of the url for the main website which contains the anime id and name (spinal-cased)
    
     `i.e. https://www.masterani.me/anime/info/2780-sora-yori-mo-tooi-basho`
   the slug is `2780-sora-yori-mo-tooi-basho`
   

</div>
