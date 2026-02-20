WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "TMDB资源模块",
  description: "趋势、热榜、平台一站式的模块资源",
  author: "Hakuna Matata",
  version: "0.0.01",
  requiredVersion: "0.0.2",
  detailCacheDuration: 60,
  modules: [
    // -------------TMDB模块-------------
    //趋势模块
     { 
      title: "TMDB 今日趋势",
      functionName: "tmdbTrendingToday",
      cacheDuration: 60,
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
      cacheDuration: 60,
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
    // --- 热门模块 ---
   {
      title: " TMDB 热门剧集",
      description: "今日热门电视剧",
      requiresWebView: false,
      functionName: "loadTodayHotTV",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: " TMDB 热门电影",
      description: "今日热门电影",
      requiresWebView: false,
      functionName: "loadTodayHotMovies",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // --- 常规发现模块 ---
    {
      title: "TMDB 高分内容",
      description: "高分电影或剧集 (按用户评分排序)",
      requiresWebView: false,
      functionName: "tmdbTopRated",
      cacheDuration: 3600,
      params: [
        { 
          name: "type", 
          title: "🎭类型", 
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
    // --- 播出平台模块 ---
    {
        title: "TMDB 播出平台",
        description: "按播出平台和内容类型筛选剧集内容",
        requiresWebView: false,
        functionName: "tmdbDiscoverByNetwork",
        cacheDuration: 3600,
        params: [
            {
                name: "with_networks",
                title: "播出平台",
                type: "enumeration",
                description: "选择一个平台以查看其剧集内容",
                value: "",
                belongTo: {
                  paramName: "air_status",
                  value: ["released","upcoming",""],
                },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Tencent", value: "2007" },
            { title: "iQiyi", value: "1330" },
            { title: "Youku", value: "1419" },
            { title: "Bilibili", value: "1605" },
            { title: "MGTV", value: "1631" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" },
            { title: "HBO Max", value: "3186" },
            { title: "Apple TV+", value: "2552" },
            { title: "Hulu", value: "453" },
            { title: "Amazon Prime Video", value: "1024" },
            { title: "FOX", value: "19" },
            { title: "Paramount+", value: "4330" },
            { title: "TV Tokyo", value: "94" },
            { title: "BBC One", value: "332" },
            { title: "BBC Two", value: "295" },
            { title: "NBC", value: "6" },
            { title: "AMC+", value: "174" },
            { title: "We TV", value: "3732" },
            { title: "Viu TV", value: "2146" },
            { title: "TVB", value: "48" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming",""],
          },
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "犯罪", value: "80" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "剧情", value: "18" },
            { title: "家庭", value: "10751" },
            { title: "悬疑", value: "9648" },
            { title: "真人秀", value: "10764" },
            { title: "脱口秀", value: "10767" },
            { title: "纪录片", value: "99" },
            { title: "动作与冒险", value: "10759" },
            { title: "科幻与奇幻", value: "10765" },
            { title: "战争与政治", value: "10768" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          description: "默认已上映",
          value: "released",
          enumOptions: [
            { title: "已上映", value: "released" },
            { title: "未上映", value: "upcoming" },
            { title: "全部", value: "" }
          ]
        },
        {
          name: "sort_by",
          title: "🔢 排序方式",
          type: "enumeration",
          description: "选择内容排序方式,默认上映时间↓",
          value: "first_air_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "first_air_date.desc" },
            { title: "上映时间↑", value: "first_air_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" },
            { title: "最多投票", value: "vote_count.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // --- 出品公司模块 ---
    {
      title: "TMDB 出品公司",
      functionName: "tmdbCompanies",
      cacheDuration: 3600,
      params: [
        {
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          value: "",
          description: "选择一个公司以查看其剧集内容",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming",""],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Disney", value: "2" },
            { title: "Warner Bros", value: "174" },
            { title: "Columbia", value: "5" },
            { title: "Sony", value: "34" },
            { title: "Universal", value: "33" },
            { title: "Paramount", value: "4" },
            { title: "20th Century", value: "25" },
            { title: "Marvel", value: "420" },
            { title: "Toho", value: "882" },
            { title: "中国电影集团公司", value: "14714" },
            { title: "BBC", value: "3324" },
            { title: "A24", value: "41077" },
            { title: "Blumhouse", value: "3172" },
            { title: "Working Title Films", value: "10163" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming",""],
          },
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "冒险", value: "12" },
            { title: "剧情", value: "18" },
            { title: "动作", value: "28" },
            { title: "动画", value: "16" },
            { title: "历史", value: "36" },
            { title: "喜剧", value: "35" },
            { title: "奇幻", value: "14" },
            { title: "家庭", value: "10751" },
            { title: "恐怖", value: "27" },
            { title: "悬疑", value: "9648" },
            { title: "惊悚", value: "53" },
            { title: "战争", value: "10752" },
            { title: "爱情", value: "10749" },
            { title: "犯罪", value: "80" },
            { title: "科幻", value: "878" },
            { title: "记录", value: "99" },
            { title: "西部", value: "37" },
            { title: "音乐", value: "10402" },
            { title: "电视电影", value: "10770" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          description: "默认已上映",
          value: "released",
          enumOptions: [
            { title: "已上映", value: "released" },
            { title: "未上映", value: "upcoming" },
            { title: "全部", value: "" }
          ]
        },
        {
          name: "sort_by",
          title: "🔢 排序方式",
          type: "enumeration",
          description: "选择内容排序方式,默认上映时间↓",
          value: "primary_release_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "primary_release_date.desc" },
            { title: "上映时间↑", value: "primary_release_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" },
            { title: "最多投票", value: "vote_count.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // =============屏蔽管理模块=============
    {
      title: "TMDB 搜索屏蔽",
      description: "按影片名称或内容类型进行屏蔽",
      requiresWebView: false,
      functionName: "searchAndBlock",
      cacheDuration: 0,
      params: [
        {
          name: "block_type",
          title: "🎯 屏蔽类型",
          type: "enumeration",
          description: "选择屏蔽方式",
          value: "by_name",
          enumOptions: [
            { title: "按影片名称", value: "by_name" },
            { title: "按内容类型", value: "by_genre" },
            { title: "手动输入ID", value: "manual_id" }
          ]
        },
        {
          name: "action",
          title: "🎮 操作模式",
          type: "enumeration",
          description: "选择操作类型",
          value: "search_only",
          enumOptions: [
            { title: "仅搜索", value: "search_only" },
            { title: "搜索并屏蔽", value: "search_and_block" }
          ]
        },
        {
          name: "query",
          title: "🔍 影片名称",
          type: "input",
          description: "输入要搜索的影片或剧集名称(按名称屏蔽模式使用)",
          value: "",
          placeholder: "例如：鬼灭之刃、南方公园"
        },
        {
          name: "genre_name",
          title: "🏷️ 类型名称",
          type: "input",
          description: "输入要屏蔽的内容类型(按类型屏蔽模式使用)",
          value: "",
          placeholder: "例如：真人秀、综艺、纪录片、动作、爱情"
        },
        {
          name: "language",
          title: "🌐 搜索语言",
          type: "enumeration",
          description: "选择搜索语言（按名称屏蔽模式使用）",
          value: "zh-CN",
          enumOptions: [
            { title: "中文", value: "zh-CN" },
            { title: "English", value: "en-US" },
            { title: "其他语言", value: "en" }
          ]
        },
        {
          name: "tmdb_id",
          title: "🆔 TMDB ID",
          type: "input",
          description: "输入要屏蔽的TMDB ID（手动输入ID模式使用）",
          value: "",
          placeholder: "例如：550, 1399"
        },
        {
          name: "media_type",
          title: "🎭 媒体类型",
          type: "enumeration",
          description: "选择媒体类型（手动输入ID模式使用）",
          value: "tv",
          enumOptions: [
            { title: "剧集", value: "tv" },
            { title: "电影", value: "movie" }
          ]
        }
      ]
    },
    {
      title: "TMDB 屏蔽管理",
      description: "查看和管理已屏蔽的内容和类型",
      requiresWebView: false,
      functionName: "manageBlockedItems",
      cacheDuration: 0,
      params: [
        {
          name: "manage_type",
          title: "📂 管理类型",
          type: "enumeration",
          description: "选择要管理的屏蔽类型",
          value: "items",
          enumOptions: [
            { title: "屏蔽的内容", value: "items" },
            { title: "屏蔽的类型", value: "genres" }
          ]
        },
        {
          name: "action",
          title: "📋 操作",
          type: "enumeration",
          description: "选择要执行的操作",
          value: "view",
          enumOptions: [
            { title: "查看列表", value: "view" },
            { title: "清空列表", value: "clear" },
            { title: "取消屏蔽", value: "unblock" },
            { title: "导出配置", value: "export" },
            { title: "导入配置", value: "import" }
          ]
        },
        {
          name: "unblock_id",
          title: "🔓 取消屏蔽ID",
          type: "input",
          description: "输入要取消屏蔽的ID",
          value: "",
          placeholder: "内容ID例如：2190 | 类型ID例如：10764",
          belongTo: { paramName: "action", value: ["unblock"] }
        },
        {
          name: "unblock_media_type",
          title: "🎭 媒体类型",
          type: "enumeration",
          description: "选择要取消屏蔽的媒体类型（仅内容屏蔽需要）",
          value: "tv",
          enumOptions: [
            { title: "剧集", value: "tv" },
            { title: "电影", value: "movie" }
          ],
          belongTo: { paramName: "action", value: ["unblock"], paramName2: "manage_type", value2: ["items"] }
        },
        {
          name: "import_data",
          title: "📥 导入数据",
          type: "input",
          description: "粘贴要导入的屏蔽ID列表，支持多种格式",
          value: "",
          placeholder: "支持格式：550,1399 或 '550','1399' 或 \"550\",\"1399\"",
          belongTo: { paramName: "action", value: ["import"] }
        }
      ]
    },
