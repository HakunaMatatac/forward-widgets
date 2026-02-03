const TMDB_API_KEY = "ae39b54fe21d657c5f535174b11f8a82";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p/w500";

// =============================
// Widget Metadata
// =============================
var WidgetMetadata = {
  id: "curator-tmdb-widget",
  title: "TMDB资源",
  description: "纯自用",
  author: "curator",
  version: "1.8.0",
  requiredVersion: "0.0.1",

  modules: [
    // 1️⃣ 最新剧集
    { 
      title: "TMDB 最新剧集", 
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
          { title: "Bilibili", value: "1605" },
          { title: "芒果", value: "1631" },
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
    },

    // 2️⃣ 热门剧集
    { 
      title: "TMDB 热门剧集", 
      functionName: "tmdbPopularTV", 
      cacheDuration: 1800, 
      params: [ 
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ] 
    },

    // 3️⃣ 热门电影
    { 
      title: "TMDB 热门电影", 
      functionName: "tmdbPopularMovies", 
      cacheDuration: 1800, 
      params: [ 
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ] 
    },

    // 4️⃣ 高分内容
    { 
      title: "TMDB 高分内容", 
      functionName: "tmdbTopRated", 
      cacheDuration: 21600, 
      params: [ 
        { name: "type", title: "类型", type: "enumeration", enumOptions: [ 
          { title: "电影", value: "movie" }, 
          { title: "剧集", value: "tv" } 
        ], value: "movie" }, 
        { name: "language", title: "语言", type: "language", value: "zh-CN" }, 
        { name: "page", title: "页码", type: "page" } 
      ] 
    },

    // 5️⃣ 出品公司
    { 
      title: "🎬 TMDB 出品公司", 
      functionName: "tmdbDiscoverByCompany", 
      cacheDuration: 21600, 
      params: [ 
        { 
          name: "with_companies", 
          title: "出品公司", 
          type: "enumeration", 
          value: "", 
          enumOptions: [
            // 国外公司中文
            { title: "漫威", value: "420" },
            { title: "皮克斯", value: "3" },
            { title: "迪士尼", value: "2" },
            { title: "华纳兄弟", value: "174" },
            { title: "派拉蒙", value: "4" },
            { title: "环球", value: "33" },
            { title: "哥伦比亚", value: "5" },
            { title: "A24", value: "41077" },
            // 国内公司
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
        { name: "sort_by", title: "排序", type: "enumeration", value: "popularity.desc", enumOptions: [ 
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
// 拼接 URL，兼容 Forward
// =============================
function buildUrl(endpoint, params) {
  let url = BASE_URL + endpoint + '?api_key=' + TMDB_API_KEY;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  // 强制限制首播日期不晚于今天（适用于最新剧集/全部平台）
  if (endpoint.includes("/discover/tv")) {
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
// 通用请求函数
// =============================
async function fetchTMDB(endpoint, params = {}) {
  const url = buildUrl(endpoint, params);
  const res = await Widget.http.get(url);
  const json = res.data;
  return json.results || json || [];
}

// =============================
// 数据格式化 - 过滤规则
// =============================
function formatItems(items, mediaType) {
  return items
    .filter(i => i.vote_average >= 4 && i.poster_path) // 评分≥4 & 必须有封面
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
async function tmdbPopularMovies(params) { const items = await fetchTMDB("/movie/popular", params); return formatItems(items, "movie"); }
async function tmdbPopularTV(params) { const items = await fetchTMDB("/tv/popular", params); return formatItems(items, "tv"); }
async function tmdbTopRated(params) { const type = params.type || "movie"; const items = await fetchTMDB(`/${type}/top_rated`, params); return formatItems(items, type); }
async function tmdbDiscoverByNetwork(params) { const items = await fetchTMDB("/discover/tv", params); return formatItems(items, "tv"); }
async function tmdbDiscoverByCompany(params) { const items = await fetchTMDB("/discover/movie", params); return formatItems(items, "movie"); }
