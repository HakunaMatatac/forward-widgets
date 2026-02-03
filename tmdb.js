// =============================
// ForwardWidgets - TMDB 安全版（不暴露 API Key）
// 用户在 Forward 内自行填写 Key
// =============================

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p/w500";

// =============================
// Widget Metadata
// =============================
var WidgetMetadata = {
  id: "tmdb_secure_widget",
  title: "TMDB Secure",
  description: "热门电影 / 热门剧集 / 高分 / 平台 / 出品公司（安全版）",
  author: "ChatGPT",
  version: "2.0.0",
  requiredVersion: "0.0.1",

  modules: [
    {
      title: "🔥 TMDB 热门电影",
      functionName: "tmdbPopularMovies",
      cacheDuration: 1800,
      params: [
        { name: "api_key", title: "TMDB API Key", type: "input", description: "首次填写后Forward会记住" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "🔥 TMDB 热门剧集",
      functionName: "tmdbPopularTV",
      cacheDuration: 1800,
      params: [
        { name: "api_key", title: "TMDB API Key", type: "input" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "⭐ TMDB 高分内容",
      functionName: "tmdbTopRated",
      cacheDuration: 21600,
      params: [
        { name: "api_key", title: "TMDB API Key", type: "input" },
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
      title: "📺 TMDB 播出平台",
      functionName: "tmdbDiscoverByNetwork",
      cacheDuration: 21600,
      params: [
        { name: "api_key", title: "TMDB API Key", type: "input" },
        {
          name: "with_networks",
          title: "播出平台",
          type: "enumeration",
          value: "213",
          enumOptions: [
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "Apple TV+", value: "2552" },
            { title: "HBO", value: "49" },
            { title: "Amazon", value: "1024" },
            { title: "Hulu", value: "453" },
            { title: "BBC", value: "332" }
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
    },
    {
      title: "🎬 TMDB 出品公司",
      functionName: "tmdbDiscoverByCompany",
      cacheDuration: 21600,
      params: [
        { name: "api_key", title: "TMDB API Key", type: "input" },
        {
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          value: "420",
          enumOptions: [
            { title: "Marvel", value: "420" },
            { title: "Pixar", value: "3" },
            { title: "Disney", value: "2" },
            { title: "Warner Bros.", value: "174" },
            { title: "Paramount", value: "4" },
            { title: "Universal", value: "33" },
            { title: "Columbia", value: "5" },
            { title: "A24", value: "41077" }
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
// 通用请求函数（从参数读取 key）
// =============================
async function fetchTMDB(endpoint, params = {}) {
  if (!params.api_key) {
    throw new Error("请先填写 TMDB API Key");
  }

  const url = new URL(BASE_URL + endpoint);

  url.searchParams.append("api_key", params.api_key);

  Object.entries(params).forEach(([k, v]) => {
    if (k !== "api_key" && v !== undefined && v !== "") {
      url.searchParams.append(k, v);
    }
  });

  const res = await Widget.http.get(url.toString());
  const json = JSON.parse(res.data);

  return json.results || [];
}

// =============================
// 数据格式化（自动过滤低质量内容）
// =============================
function formatItems(items, mediaType) {
  return items
    .filter(i => i.poster_path && i.vote_count > 100 && i.vote_average >= 6)
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

async function tmdbDiscoverByNetwork(params) {
  const items = await fetchTMDB("/discover/tv", params);
  return formatItems(items, "tv");
}

async function tmdbDiscoverByCompany(params) {
  const items = await fetchTMDB("/discover/movie", params);
  return formatItems(items, "movie");
}
