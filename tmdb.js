const TMDB_API_KEY = "ae39b54fe21d657c5f535174b11f8a82";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p/w500";

// =============================
// Widget Metadata
// =============================
var WidgetMetadata = {
  id: "curator-tmdb-widget",
  title: "TMDB资源",
  description: "热门剧集、热门电影、高分内容、出品公司",
  author: "curator",
  version: "2.1.1",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "TMDB 热门剧集",
      functionName: "tmdbPopularTV",
      cacheDuration: 1800,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 热门电影",
      functionName: "tmdbPopularMovies",
      cacheDuration: 1800,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 高分内容",
      functionName: "tmdbTopRated",
      cacheDuration: 21600,
      params: [
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ],
          value: "movie"
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 出品公司",
      functionName: "tmdbDiscoverByCompany",
      cacheDuration: 21600,
      params: [
        {
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "漫威", value: "420" },
            { title: "皮克斯", value: "3" },
            { title: "迪士尼", value: "2" },
            { title: "华纳兄弟", value: "174" },
            { title: "派拉蒙", value: "4" },
            { title: "环球", value: "33" },
            { title: "哥伦比亚", value: "5" },
            { title: "A24", value: "41077" },
            { title: "腾讯", value: "2007" },
            { title: "爱奇艺", value: "1330" },
            { title: "优酷", value: "1419" },
            { title: "芒果", value: "1631" },
            { title: "Bilibili", value: "1605" },
            { title: "华策影视", value: "6538" },
            { title: "光线传媒", value: "1161" },
            { title: "阿里影业", value: "521" },
            { title: "北京文化", value: "1831" }
          ]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "popularity.desc",
          enumOptions: [
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ]
};

// =============================
// 拼接 URL
// =============================
function buildUrl(endpoint, params) {
  let url = BASE_URL + endpoint + '?api_key=' + TMDB_API_KEY;
  for (let k in params) {
    if (params[k] !== undefined && params[k] !== '') {
      url += `&${k}=${encodeURIComponent(params[k])}`;
    }
  }
  return url;
}

// =============================
// 通用请求函数
// =============================
async function fetchTMDB(endpoint, params = {}) {
  const url = buildUrl(endpoint, params);
  const res = await Widget.http.get(url);
  const json = res.data;
  return json.results || json || [];
}

// =============================
// 数据格式化 + 过滤（只保留有封面）
// =============================
function formatItems(items, mediaType) {
  return items
    .filter(i => i.poster_path && i.poster_path.trim() !== "") // 仅保留有封面
    .map(i => ({
      id: i.id.toString(),
      type: "tmdb",
      mediaType: mediaType || (i.title ? "movie" : "tv"),
      title: i.title || i.name,
      posterPath: IMAGE + i.poster_path,
      backdropPath: i.backdrop_path ? IMAGE + i.backdrop_path : undefined,
      releaseDate: i.release_date || i.first_air_date,
      rating: i.vote_average,
      description: i.overview
    }));
}

// =============================
// 模块实现函数
// =============================
async function tmdbPopularMovies(params) {
  const items = await fetchTMDB("/movie/popular", params);
  return formatItems(items, "movie");
}

async function tmdbPopularTV(params) {
  const items = await fetchTMDB("/tv/popular", params);
  return formatItems(items, "tv");
}

async function tmdbTopRated(params) {
  const type = params.type || "movie";
  const items = await fetchTMDB(`/${type}/top_rated`, params);
  return formatItems(items, type);
}

async function tmdbDiscoverByCompany(params) {
  const items = await fetchTMDB("/discover/movie", params);
  return formatItems(items, "movie");
}
