const TMDB_API_KEY = "ae39b54fe21d657c5f535174b11f8a82";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p/";

// =============================
var WidgetMetadata = {
  id: "tmdb_full_open_widget",
  title: "TMDB资源模块",
  description: "趋势、热榜、平台一站式的资源模块",
  author: "白馆长",
  version: "0.0.6",
  requiredVersion: "0.0.1",

  modules: [
    { 
      title: "TMDB 今日趋势",
      functionName: "tmdbTrendingToday",
      cacheDuration: 900,
      params: [
        { name: "media_type", title: "类型", type: "enumeration", value: "all",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    { 
      title: "TMDB 本周趋势",
      functionName: "tmdbTrendingWeek",
      cacheDuration: 900,
      params: [
        { name: "media_type", title: "类型", type: "enumeration", value: "all",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    { title: "TMDB 热门电影", functionName: "tmdbPopularMovies", cacheDuration: 1800, params: [ { name: "language", title: "语言", type: "language", value: "zh-CN" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "TMDB 热门剧集", functionName: "tmdbPopularTV", cacheDuration: 1800, params: [ { name: "language", title: "语言", type: "language", value: "zh-CN" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "TMDB 高分内容", functionName: "tmdbTopRated", cacheDuration: 21600, params: [ { name: "type", title: "类型", type: "enumeration", enumOptions: [ { title: "电影", value: "movie" }, { title: "剧集", value: "tv" } ], value: "movie" }, { name: "language", title: "语言", type: "language", value: "zh-CN" }, { name: "page", title: "页码", type: "page" } ] },
    { 
      title: "TMDB 播出平台", 
      functionName: "tmdbDiscoverByNetwork", 
      cacheDuration: 21600, 
      params: [ 
        { name: "with_networks", title: "播出平台", type: "enumeration", value: "", enumOptions: [
          { title: "全部平台", value: "" },
          { title: "Netflix", value: "213" },
          { title: "Disney+", value: "2739" },
          { title: "Apple TV+", value: "2552" },
          { title: "HBO", value: "49" },
          { title: "Amazon", value: "1024" },
          { title: "Hulu", value: "453" },
          { title: "BBC", value: "332" },
          { title: "腾讯", value: "2007" },
          { title: "爱奇艺", value: "1330" },
          { title: "优酷", value: "1419" },
          { title: "哔哩哔哩", value: "1605" },
          { title: "芒果TV", value: "1631" },
          { title: "TVB", value: "48" }
        ] },
        { name: "sort_by", title: "排序方式", type: "enumeration", value: "first_air_date.desc", enumOptions: [
          { title: "最新上映↓", value: "first_air_date.desc" },
          { title: "上映时间↑", value: "first_air_date.asc" },
          { title: "人气最高", value: "popularity.desc" },
          { title: "评分最高", value: "vote_average.desc" }
        ] },
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
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (endpoint.includes("/discover/tv") && !params['first_air_date.lte']) {
    params['first_air_date.lte'] = todayStr;
  }

  for (let k in params) {
    if (params[k] !== undefined && params[k] !== '') {
      url += `&${k}=${encodeURIComponent(params[k])}`;
    }
  }
  return url;
}

// =============================
// 智能标题处理（中文优先）
// =============================
function getSmartTitle(i) {
  const zhTitle = i.title || i.name;
  const original = i.original_title || i.original_name;

  if (zhTitle && /[\u4e00-\u9fa5]/.test(zhTitle)) {
    return zhTitle;
  }

  return zhTitle || original || "未知";
}

// =============================
async function fetchTMDB(endpoint, params = {}) {
  const url = buildUrl(endpoint, params);
  const res = await Widget.http.get(url);
  let json;
  try { 
      json = typeof res.data === "string" ? JSON.parse(res.data) : res.data; 
  } catch(e) { 
      json = {}; 
  }
  return json.results || json || [];
}

// =============================
// 播出平台模块（已优化中文标题）
// =============================
async function tmdbDiscoverByNetwork(params) { 
  const items = await fetchTMDB("/discover/tv", params); 

  return items
    .filter(i => i.poster_path && i.poster_path.trim() !== "")
    .map(i => ({
      id: i.id.toString(),
      type: "tmdb",
      mediaType: "tv",
      title: getSmartTitle(i),
      posterPath: IMAGE + "w500" + i.poster_path,
      backdropPath: i.backdrop_path 
        ? IMAGE + "w1280" + i.backdrop_path 
        : undefined,
      releaseDate: i.first_air_date,
      rating: i.vote_average,
      description: i.overview
    }));
}
