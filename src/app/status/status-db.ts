export interface StatusInfo {
  code: number;
  name: string;
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
  summary: string;
  description: string;
  useCases: string[];
  example?: string;
}

export const STATUS_DB: Record<number, StatusInfo> = {
  // ════════════════════ 1xx Informational ════════════════════
  100: {
    code: 100,
    name: "Continue",
    category: "1xx",
    summary: "服务器已收到请求头，客户端应继续发送请求体。",
    description: "100 Continue 表示服务器已收到请求头，客户端应继续发送请求体。常用于客户端在发送大请求体前先确认服务器是否愿意接受。配合 Expect: 100-continue 头使用。",
    useCases: ["大文件上传前预检", "带 Expect: 100-continue 头的 POST 请求", "分块传输编码确认"],
    example: "POST /upload with Expect: 100-continue → 100 Continue"
  },
  101: {
    code: 101,
    name: "Switching Protocols",
    category: "1xx",
    summary: "服务器同意切换协议。",
    description: "101 Switching Protocols 表示服务器正在根据客户端的 Upgrade 头切换协议。最常见的是将 HTTP 连接升级为 WebSocket。",
    useCases: ["WebSocket 握手升级", "HTTP/1.1 升级到 HTTP/2", "从 HTTP 升级到 HTTPS"],
    example: "GET /chat → Upgrade: websocket → 101 Switching Protocols"
  },
  102: {
    code: 102,
    name: "Processing",
    category: "1xx",
    summary: "服务器正在处理请求，但尚未完成。",
    description: "102 Processing 是一个 interim 响应，告诉客户端服务器已收到请求并开始处理，但尚未完成。在 WebDAV 中用于长时间运行的操作。",
    useCases: ["WebDAV 长时间操作", "异步请求处理中通知", "批量操作正在执行"],
  },
  103: {
    code: 103,
    name: "Early Hints",
    category: "1xx",
    summary: "服务器在最终响应前先返回一些响应头。",
    description: "103 Early Hints 允许服务器在准备完整响应之前，先向浏览器发送一些响应头（通常是 Link 头用于预加载资源）。可以加快页面加载速度。",
    useCases: ["预加载 CSS/JS 资源", "在服务端渲染前发送 hint", "优化页面加载性能"],
    example: "103 Early Hints with Link: </style.css>; rel=preload"
  },

  // ════════════════════ 2xx Success ════════════════════
  200: {
    code: 200,
    name: "OK",
    category: "2xx",
    summary: "请求成功。",
    description: "200 OK 是最常用的 HTTP 响应。表示请求成功，服务器返回了请求的资源。具体响应内容取决于 HTTP 方法：GET 返回资源，POST 返回操作结果。",
    useCases: ["成功的 GET 请求", "表单提交成功", "API 返回数据"],
    example: "GET /api/users/1 → 200 OK with user data"
  },
  201: {
    code: 201,
    name: "Created",
    category: "2xx",
    summary: "请求成功，并且新资源已被创建。",
    description: "201 Created 表示请求成功，并且服务器创建了新资源。新资源的 URI 通常在 Location 头中返回。常用于 POST 或 PUT 请求。",
    useCases: ["创建新用户", "上传文件成功", "提交新订单"],
    example: "POST /api/users → 201 Created, Location: /api/users/42"
  },
  202: {
    code: 202,
    name: "Accepted",
    category: "2xx",
    summary: "请求已接受，但尚未处理完成。",
    description: "202 Accepted 表示请求已被接受进行后续处理，但处理尚未完成。这是一个非承诺性响应——请求可能在未来被执行或拒绝。常用于异步任务场景。",
    useCases: ["异步任务排队", "批量处理作业", "邮件发送队列"],
    example: "POST /api/export → 202 Accepted, Job ID: 12345"
  },
  203: {
    code: 203,
    name: "Non-Authoritative Information",
    category: "2xx",
    summary: "请求成功，但返回的元信息来自不是原始服务器的副本。",
    description: "203 Non-Authoritative Information 表示服务器成功处理了请求，但返回的元信息不是来自原始服务器，而是来自本地或第三方的副本。通常由代理服务器返回。",
    useCases: ["代理服务器返回缓存的元信息", "CDN 节点的非权威响应", "调试代理修改了响应头"],
  },
  204: {
    code: 204,
    name: "No Content",
    category: "2xx",
    summary: "请求成功，但不需要返回内容。",
    description: "204 No Content 表示服务器成功处理了请求，但不需要返回任何内容。常用于 DELETE 操作或 PUT 更新，不需要在响应体中返回数据。",
    useCases: ["DELETE 请求成功", "PUT/PATCH 更新无响应体", "OPTIONS 预检请求响应"],
    example: "DELETE /api/users/42 → 204 No Content"
  },
  205: {
    code: 205,
    name: "Reset Content",
    category: "2xx",
    summary: "请求成功，客户端应重置文档视图。",
    description: "205 Reset Content 表示服务器成功处理了请求，并要求客户端重置文档视图（例如清空表单内容，重置 canvas 状态等）。常用于表单提交后清空输入框。",
    useCases: ["表单提交后重置表单", "清空用户输入界面", "重置拖放区域状态"],
  },
  206: {
    code: 206,
    name: "Partial Content",
    category: "2xx",
    summary: "服务器仅返回请求的部分资源。",
    description: "206 Partial Content 表示服务器正在返回客户端请求的部分资源（通过 Range 头指定）。常见于视频流媒体和断点续传下载。",
    useCases: ["视频流媒体（seek 操作）", "断点续传下载", "分块内容传输"],
    example: "GET /video.mp4 with Range: bytes=0-1023 → 206"
  },
  207: {
    code: 207,
    name: "Multi-Status",
    category: "2xx",
    summary: "WebDAV 多状态响应。",
    description: "207 Multi-Status 是 WebDAV 扩展状态码，用于在单个响应中返回多个独立操作的状态。每个操作有自己的状态码和响应体。",
    useCases: ["WebDAV 批量操作", "多资源操作结果", "PROPFIND 多资源查询"],
  },
  208: {
    code: 208,
    name: "Already Reported",
    category: "2xx",
    summary: "WebDAV 中，成员已在前一个响应中列出。",
    description: "208 Already Reported 用于 DAV 绑定的成员已经在之前的响应中被枚举，不再重复列出。避免在大集合中重复返回相同信息。",
    useCases: ["WebDAV PROPFIND 避免重复", "DAV 集合成员去重", "减少大响应体体积"],
  },
  226: {
    code: 226,
    name: "IM Used",
    category: "2xx",
    summary: "服务器已完成 GET 请求，响应是实例操作的结果。",
    description: "226 IM Used 表示服务器已完成请求，响应是对一个或多个实例操作的请求结果。与 HTTP Delta 编码（RFC 3229）相关，用于增量传输。",
    useCases: ["增量内容传输", "Delta 编码响应", "节省带宽的部分更新"],
  },

  // ════════════════════ 3xx Redirection ════════════════════
  300: {
    code: 300,
    name: "Multiple Choices",
    category: "3xx",
    summary: "请求的资源有多种表示，客户端应选择其中一个。",
    description: "300 Multiple Choices 表示请求的资源有多种表示形式（例如不同的文件格式、不同的语言），客户端应选择一个。服务器可以在响应中列出可用选项。",
    useCases: ["内容协商多选一", "多语言版本选择", "多格式文档选择"],
  },
  301: {
    code: 301,
    name: "Moved Permanently",
    category: "3xx",
    summary: "资源已永久移动到新 URL。",
    description: "301 Moved Permanently 表示资源已永久移动到新 URL。搜索引擎会更新索引到新 URL。浏览器会缓存此重定向。",
    useCases: ["永久域名迁移", "HTTP 到 HTTPS 重定向", "URL 重构用于 SEO"],
    example: "http://example.com → 301 → https://example.com"
  },
  302: {
    code: 302,
    name: "Found",
    category: "3xx",
    summary: "资源临时移动到不同 URL。",
    description: "302 Found 表示资源临时位于不同的 URI。与 301 不同，搜索引擎不会更新索引。原始 URL 保持不变。注意：部分浏览器会将 POST 转为 GET。",
    useCases: ["临时维护重定向", "登录重定向流程", "A/B 测试重定向"],
    example: "POST /login → 302 Found → /dashboard"
  },
  303: {
    code: 303,
    name: "See Other",
    category: "3xx",
    summary: "响应应使用 GET 方法到另一个 URI 获取。",
    description: "303 See Other 表示应使用 GET 方法获取另一个 URI 的响应。用于实现 Post/Redirect/Get 模式，防止表单重复提交。",
    useCases: ["Post/Redirect/Get (PRG) 模式", "表单提交后重定向", "支付确认重定向"],
    example: "POST /submit → 303 See Other → GET /success"
  },
  304: {
    code: 304,
    name: "Not Modified",
    category: "3xx",
    summary: "资源未被修改，可使用缓存版本。",
    description: "304 Not Modified 告诉客户端缓存的资源仍然有效，无需重新传输。与 If-Modified-Since 或 If-None-Match 头配合使用。可以大幅节省带宽。",
    useCases: ["浏览器缓存验证", "CDN 缓存命中", "带 ETag 的 API 响应缓存"],
    example: "GET with If-None-Match: \"abc\" → 304 Not Modified"
  },
  305: {
    code: 305,
    name: "Use Proxy",
    category: "3xx",
    summary: "请求必须通过指定的代理访问。",
    description: "305 Use Proxy 表示请求必须通过 Location 头中指定的代理访问。由于安全原因，此状态码已被弃用，现代浏览器不再支持。",
    useCases: ["（已废弃）代理访问指示", "历史兼容性"],
  },
  307: {
    code: 307,
    name: "Temporary Redirect",
    category: "3xx",
    summary: "资源临时位于不同 URI，方法和请求体不变。",
    description: "307 Temporary Redirect 与 302 类似，但保证重定向时 HTTP 方法和请求体不会改变。如果原请求是 POST，重定向后的请求也是 POST。",
    useCases: ["临时 API 端点迁移", "保持 POST 数据的重定向", "负载均衡器临时路由"],
    example: "POST /api/old → 307 → POST /api/new"
  },
  308: {
    code: 308,
    name: "Permanent Redirect",
    category: "3xx",
    summary: "资源已永久移动到新 URI，方法和请求体不变。",
    description: "308 Permanent Redirect 是 301 的严格版本，保证重定向时 HTTP 方法和请求体不变。适合永久移动 API 端点而不破坏 POST 请求。",
    useCases: ["永久 API 迁移", "保持 POST 方法的永久重定向", "强制 HTTPS 且保持请求方法"],
    example: "POST http://api.example.com → 308 → POST https://api.example.com"
  },

  // ════════════════════ 4xx Client Error ════════════════════
  400: {
    code: 400,
    name: "Bad Request",
    category: "4xx",
    summary: "服务器无法理解请求，因为语法无效。",
    description: "400 Bad Request 表示服务器无法理解请求，因为语法错误。客户端不应在没有修改的情况下重复请求。常见原因包括无效的 JSON、缺少必需参数等。",
    useCases: ["无效的 JSON 请求体", "缺少必需参数", "查询字符串格式错误"],
    example: "POST /api/users with malformed JSON → 400 Bad Request"
  },
  401: {
    code: 401,
    name: "Unauthorized",
    category: "4xx",
    summary: "请求需要用户认证。",
    description: "401 Unauthorized（实际上应该是 Unauthenticated）表示请求需要身份认证。响应必须包含 WWW-Authenticate 头指示如何认证。常见于缺少或无效的 Bearer Token。",
    useCases: ["缺少 Bearer Token", "JWT Token 已过期", "API Key 无效"],
    example: "GET /api/me without token → 401 Unauthorized"
  },
  402: {
    code: 402,
    name: "Payment Required",
    category: "4xx",
    summary: "保留用于未来使用，当前表示需要付费。",
    description: "402 Payment Required 最初是保留状态码，现在被一些 API 用来表示需要付费才能访问。不是 HTTP 标准强制要求，但是一些 SaaS API 的实际约定。",
    useCases: ["API 配额已用尽", "订阅已过期", "需要付费才能访问资源"],
    example: "Stripe API: 402 Payment Required for failed payment"
  },
  403: {
    code: 403,
    name: "Forbidden",
    category: "4xx",
    summary: "服务器理解请求，但拒绝执行。",
    description: "403 Forbidden 表示服务器理解请求但拒绝授权。与 401 不同，身份认证不会改变结果。客户端已知但无权限访问该资源。",
    useCases: ["访问仅管理员资源", "IP 被封禁", "文件权限被拒绝"],
    example: "GET /admin with regular user token → 403 Forbidden"
  },
  404: {
    code: 404,
    name: "Not Found",
    category: "4xx",
    summary: "服务器找不到请求的资源。",
    description: "404 Not Found 是最著名的 HTTP 错误。表示服务器找不到请求的资源。可能是 URL 错误、资源已被删除或移动。注意：404 也可能表示服务器不想透露拒绝原因。",
    useCases: ["页面已被删除", "链接失效（死链）", "错误的 URL 路径", "API 端点不存在"],
    example: "GET /page-that-doesnt-exist → 404 Not Found"
  },
  405: {
    code: 405,
    name: "Method Not Allowed",
    category: "4xx",
    summary: "请求方法对目标资源不适用。",
    description: "405 Method Not Allowed 表示请求使用的 HTTP 方法不被该资源支持。服务器必须在响应中包含 Allow 头，列出支持的方法。",
    useCases: ["对只读端点使用 POST", "DELETE 不被支持", "在集合 URL 上使用 PUT"],
    example: "POST /api/users/42 (read-only) → 405 Method Not Allowed"
  },
  406: {
    code: 406,
    name: "Not Acceptable",
    category: "4xx",
    summary: "服务器无法根据 Accept 头生成可接受的响应。",
    description: "406 Not Acceptable 表示服务器无法根据客户端 Accept 头中的内容协商参数生成可接受的响应。客户端请求的内容类型服务器无法提供。",
    useCases: ["API 不支持请求的格式", "内容协商失败", "Accept 头指定了不支持的 MIME 类型"],
    example: "GET with Accept: application/xml, server only serves JSON → 406"
  },
  407: {
    code: 407,
    name: "Proxy Authentication Required",
    category: "4xx",
    summary: "请求需要先通过代理认证。",
    description: "407 Proxy Authentication Required 表示客户端必须先通过代理服务器的认证。类似于 401，但是针对代理服务器。",
    useCases: ["企业代理需要认证", "代理服务器访问控制", "中转代理身份验证"],
  },
  408: {
    code: 408,
    name: "Request Timeout",
    category: "4xx",
    summary: "服务器等待请求超时。",
    description: "408 Request Timeout 表示服务器在准备等待的时间内没有收到完整的请求消息。客户端可以在之后重复请求。常用于清理空闲连接。",
    useCases: ["慢速网络连接", "客户端上传中途停止", "空闲连接清理"],
  },
  409: {
    code: 409,
    name: "Conflict",
    category: "4xx",
    summary: "请求与服务器当前状态冲突。",
    description: "409 Conflict 表示请求与服务器当前状态冲突。常见于尝试创建重复资源或并发编辑冲突（乐观锁）。",
    useCases: ["重复用户名注册", "编辑冲突（乐观锁）", "版本不匹配的 API 调用"],
    example: "POST /api/users with existing email → 409 Conflict"
  },
  410: {
    code: 410,
    name: "Gone",
    category: "4xx",
    summary: "资源已被永久删除，且不会再回来。",
    description: "410 Gone 类似于 404，但明确表示资源曾被删除且不会回来。搜索引擎应该比 404 更快地从其索引中移除 410 页面。",
    useCases: ["永久删除的内容", "已过期的促销活动", "已废弃的 API 端点"],
  },
  411: {
    code: 411,
    name: "Length Required",
    category: "4xx",
    summary: "请求必须包含 Content-Length 头。",
    description: "411 Length Required 表示服务器拒绝接受没有 Content-Length 头的请求。客户端需要在请求头中明确指定内容长度。",
    useCases: ["POST/PUT 请求缺少 Content-Length", "服务器要求明确的内容长度", "防止 chunked 传输编码的问题"],
  },
  412: {
    code: 412,
    name: "Precondition Failed",
    category: "4xx",
    summary: "请求头中的前置条件评估为 false。",
    description: "412 Precondition Failed 表示服务器在请求头中评估前置条件时结果为 false。常与 If-Match、If-Unmodified-Since 等头配合使用，用于并发控制。",
    useCases: ["ETag 不匹配（乐观并发）", "条件更新失败", "分布式锁冲突"],
    example: "PUT with If-Match: \"old-etag\" but server has \"new-etag\" → 412"
  },
  413: {
    code: 413,
    name: "Payload Too Large",
    category: "4xx",
    summary: "请求实体大于服务器愿意或能够处理的大小。",
    description: "413 Payload Too Large（旧称 Request Entity Too Large）表示请求体超过了服务器愿意处理的大小限制。服务器可以关闭连接或返回 Retry-After 头。",
    useCases: ["上传文件超过大小限制", "POST 请求体过大", "API 请求 payload 超限"],
    example: "POST /upload with 100MB file, limit 10MB → 413"
  },
  414: {
    code: 414,
    name: "URI Too Long",
    category: "4xx",
    summary: "请求的 URI 超过服务器愿意解析的长度。",
    description: "414 URI Too Long（旧称 Request-URI Too Long）表示请求的 URI 太长，服务器拒绝处理。常见于误导性递归重定向或恶意构造的超长查询字符串。",
    useCases: ["重定向循环导致 URI 累积", "恶意超长查询字符串", "API 参数过多"],
  },
  415: {
    code: 415,
    name: "Unsupported Media Type",
    category: "4xx",
    summary: "请求实体的媒体类型不被服务器支持。",
    description: "415 Unsupported Media Type 表示请求实体的媒体格式不被服务器支持。例如客户端发送 XML 但服务器只接受 JSON。检查 Content-Type 头。",
    useCases: ["发送错误的内容类型", "API 期望 JSON 但收到 XML", "不支持的编码格式"],
    example: "POST with Content-Type: text/xml to JSON-only API → 415"
  },
  416: {
    code: 416,
    name: "Range Not Satisfiable",
    category: "4xx",
    summary: "Range 头指定的范围无法满足。",
    description: "416 Range Not Satisfiable 表示客户端请求的资源范围超出资源实际大小。例如请求文件的 bytes=1000-2000，但文件只有 500 字节。",
    useCases: ["断点续传范围超出文件大小", "视频 seek 超出视频长度", "无效的 Range 头"],
    example: "GET with Range: bytes=1000-2000, file is 500 bytes → 416"
  },
  417: {
    code: 417,
    name: "Expectation Failed",
    category: "4xx",
    summary: "服务器无法满足 Expect 请求头的要求。",
    description: "417 Expectation Failed 表示服务器无法满足 Expect 请求头字段中的期望。最常见的是 Expect: 100-continue 被服务器拒绝。",
    useCases: ["服务器不支持 100-continue", "Expect 头值不被识别", "代理拒绝客户端的期望"],
  },
  418: {
    code: 418,
    name: "I'm a Teapot",
    category: "4xx",
    summary: "服务器拒绝用茶壶煮咖啡。",
    description: "418 I'm a Teapot 是 1998 年愚人节笑话（RFC 2324）。任何试图用茶壶煮咖啡的尝试都应该导致此错误。它已成为 HTTP 文化的一部分，用于幽默场景。",
    useCases: ["API 中的彩蛋", "幽默和文化", "表示非标准行为"],
  },
  421: {
    code: 421,
    name: "Misdirected Request",
    category: "4xx",
    summary: "请求被定向到无法生成响应的服务器。",
    description: "421 Misdirected Request 表示请求被定向到一个无法为该请求生成响应的服务器。在 HTTP/2 中，当连接复用导致请求被发送到错误的服务器时出现。",
    useCases: ["HTTP/2 连接复用错误", "请求发送到错误的虚拟主机", "TLS SNI 不匹配"],
  },
  422: {
    code: 422,
    name: "Unprocessable Entity",
    category: "4xx",
    summary: "服务器理解内容类型，但无法处理请求内容。",
    description: "422 Unprocessable Entity 表示服务器理解请求实体的内容类型和语法，但无法处理其中的指令。常用于 REST API 的输入验证错误。",
    useCases: ["表单验证失败", "无效的数据格式", "业务逻辑验证错误"],
    example: "POST /api/users with {age: -5} → 422 Unprocessable Entity"
  },
  423: {
    code: 423,
    name: "Locked",
    category: "4xx",
    summary: "资源当前被锁定。",
    description: "423 Locked 是 WebDAV 扩展状态码，表示请求的资源当前被锁定，无法访问。常用于文档协作编辑的锁机制。",
    useCases: ["WebDAV 资源被锁定", "文档协作编辑锁", "防止并发修改"],
  },
  424: {
    code: 424,
    name: "Failed Dependency",
    category: "4xx",
    summary: "请求失败，因为它依赖于另一个失败的请求。",
    description: "424 Failed Dependency 是 WebDAV 扩展状态码，表示请求的操作未能执行，因为它依赖于另一个失败的操作。类似于事务中的级联失败。",
    useCases: ["WebDAV 批量操作依赖失败", "事务中前置操作失败", "级联操作失败"],
  },
  425: {
    code: 425,
    name: "Too Early",
    category: "4xx",
    summary: "服务器不愿意处理可能被重放的请求。",
    description: "425 Too Early 表示服务器不愿意冒风险处理可能被重放的请求。与 TLS 1.3 的 0-RTT 早期数据相关，用于防止重放攻击。",
    useCases: ["TLS 1.3 0-RTT 重放保护", "防止幂等性破坏", "早期数据风险评估"],
  },
  426: {
    code: 426,
    name: "Upgrade Required",
    category: "4xx",
    summary: "服务器拒绝用当前协议处理请求，但在客户端升级后可能愿意处理。",
    description: "426 Upgrade Required 表示服务器拒绝用当前协议处理请求，但可能在客户端升级到不同协议后处理。服务器必须在响应中包含 Upgrade 头。",
    useCases: ["要求升级到 TLS", "要求切换到 HTTP/2", "协议版本过低"],
  },
  428: {
    code: 428,
    name: "Precondition Required",
    category: "4xx",
    summary: "原服务器要求请求是有条件的。",
    description: "428 Precondition Required 表示服务器要求请求必须是有条件的（即包含 If-Match 等头）。这是为了防止丢失更新问题，即某人修改了资源状态，而另一个人同时也在修改。",
    useCases: ["防止丢失更新", "强制乐观并发控制", "API 要求 ETag"],
  },
  429: {
    code: 429,
    name: "Too Many Requests",
    category: "4xx",
    summary: "用户在给定时间内发送了太多请求。",
    description: "429 Too Many Requests 表示用户在给定的时间段内发送了太多请求（速率限制）。响应应包含 Retry-After 头指示何时可以重试。",
    useCases: ["API 速率限制", "登录尝试节流", "DDoS 防护"],
    example: "Exceeding 100 API calls/minute → 429 Too Many Requests"
  },
  431: {
    code: 431,
    name: "Request Header Fields Too Large",
    category: "4xx",
    summary: "请求头字段太大，服务器拒绝处理请求。",
    description: "431 Request Header Fields Too Large 表示请求头字段（或某个字段）太大，服务器拒绝处理。可以在减小请求头字段大小后重试。",
    useCases: ["Cookie 过大", "Authorization 头太长", "请求头超出服务器限制"],
  },
  451: {
    code: 451,
    name: "Unavailable For Legal Reasons",
    category: "4xx",
    summary: "资源由于法律原因不可用。",
    description: "451 Unavailable For Legal Reasons（致敬《华氏451度》）表示资源由于法律原因不可访问。例如法院命令删除的页面、版权争议内容等。",
    useCases: ["政府审查屏蔽", "版权争议内容", "法院命令删除的页面"],
    example: "GDPR removal request → 451 Unavailable For Legal Reasons"
  },

  // ════════════════════ 5xx Server Error ════════════════════
  500: {
    code: 500,
    name: "Internal Server Error",
    category: "5xx",
    summary: "服务器遇到意外情况，无法完成请求。",
    description: "500 Internal Server Error 是通用的服务器端错误。表示服务器遇到意外情况，无法完成请求。具体原因需要查看服务器日志。这是最常见的服务器错误。",
    useCases: ["未捕获的异常", "数据库连接失败", "应用程序 Bug"],
    example: "Uncaught exception in server code → 500 Internal Server Error"
  },
  501: {
    code: 501,
    name: "Not Implemented",
    category: "5xx",
    summary: "服务器不支持完成请求所需的功能。",
    description: "501 Not Implemented 表示服务器不支持完成请求所需的功能。与 405 不同，501 表示服务器完全不认识该方法，而不仅仅是该方法对目标资源不可用。",
    useCases: ["不支持的 HTTP 方法", "功能尚未实现", "WebDAV 方法在非 WebDAV 服务器上"],
  },
  502: {
    code: 502,
    name: "Bad Gateway",
    category: "5xx",
    summary: "服务器作为网关或代理，从上游服务器收到无效响应。",
    description: "502 Bad Gateway 表示作为网关或代理的服务器从上游服务器收到了无效响应。常见于后端服务器崩溃或返回格式错误的数据时。",
    useCases: ["后端服务器崩溃", "上游服务返回错误", "反向代理配置错误"],
    example: "Nginx proxy to crashed Node.js app → 502 Bad Gateway"
  },
  503: {
    code: 503,
    name: "Service Unavailable",
    category: "5xx",
    summary: "服务器当前无法处理请求，通常由于维护或过载。",
    description: "503 Service Unavailable 表示服务器暂时无法处理请求。可能是由于服务器过载或计划维护。Retry-After 头可以指示何时重试。",
    useCases: ["计划维护", "服务器过载", "部署停机", "自动扩缩容延迟"],
    example: "Server under heavy load → 503 Service Unavailable"
  },
  504: {
    code: 504,
    name: "Gateway Timeout",
    category: "5xx",
    summary: "服务器作为网关，未及时从上游服务器收到响应。",
    description: "504 Gateway Timeout 表示作为网关的服务器未及时从上游服务器收到响应。与 502 不同，504 特指超时而非无效响应。常见于慢数据库查询或上游 API 超时。",
    useCases: ["慢数据库查询", "上游 API 超时", "长时间计算超过代理超时"],
    example: "Nginx waiting for slow backend → 504 Gateway Timeout"
  },
  505: {
    code: 505,
    name: "HTTP Version Not Supported",
    category: "5xx",
    summary: "服务器不支持请求中使用的 HTTP 版本。",
    description: "505 HTTP Version Not Supported 表示服务器不支持请求中使用的 HTTP 协议版本。例如客户端使用 HTTP/2 但服务器只支持 HTTP/1.1。",
    useCases: ["HTTP 版本不匹配", "客户端使用过新的 HTTP 版本", "服务器不支持 HTTP/2"],
  },
  506: {
    code: 506,
    name: "Variant Also Negotiates",
    category: "5xx",
    summary: "服务器存在内部配置错误：协商变量导致循环引用。",
    description: "506 Variant Also Negotiates 表示服务器存在内部配置错误。被选定的变体资源配置了自己的透明内容协商，因此不能作为协商的合适终点。",
    useCases: ["透明内容协商配置错误", "变体配置循环", "服务器配置问题"],
  },
  507: {
    code: 507,
    name: "Insufficient Storage",
    category: "5xx",
    summary: "服务器无法存储完成请求所必须的内容。",
    description: "507 Insufficient Storage 是 WebDAV 扩展状态码，表示服务器无法存储完成请求所必须的内容。例如服务器磁盘空间不足。",
    useCases: ["服务器磁盘空间不足", "WebDAV 存储配额超限", "临时文件空间不足"],
  },
  508: {
    code: 508,
    name: "Loop Detected",
    category: "5xx",
    summary: "服务器在处理请求时检测到无限循环。",
    description: "508 Loop Detected 是 WebDAV 扩展状态码，表示服务器在处理请求时检测到无限循环。例如 PROPFIND 请求中的深度无限递归。",
    useCases: ["WebDAV PROPFIND 深度无限循环", "递归引用检测", "防止无限递归"],
  },
  510: {
    code: 510,
    name: "Not Extended",
    category: "5xx",
    summary: "服务器需要对请求进行进一步扩展才能完成。",
    description: "510 Not Extended 表示服务器需要对请求进行进一步扩展才能完成。客户端需要在请求中包含额外的扩展声明，服务器才能处理。",
    useCases: ["HTTP 扩展策略要求", "策略框架拒绝未声明扩展", "需要额外的协议扩展"],
  },
  511: {
    code: 511,
    name: "Network Authentication Required",
    category: "5xx",
    summary: "客户端需要进行网络认证才能获得网络访问权限。",
    description: "511 Network Authentication Required 表示客户端需要进行网络认证才能获得网络访问权限。常见于公共 WiFi 热点的强制门户（Captive Portal）。",
    useCases: ["公共 WiFi 强制门户", "酒店/机场网络认证", "企业网络准入控制"],
    example: "Connecting to Starbucks WiFi → 511 → Login Page"
  },

  // ════════════════════ Cloudflare 专用状态码 ════════════════════
  520: {
    code: 520,
    name: "Web Server Returns Unknown Error",
    category: "5xx",
    summary: "Cloudflare：源站返回未知错误。",
    description: "520 Unknown Error 是 Cloudflare 的自定义状态码，表示源站返回了 Cloudflare 无法理解或预期的响应。可能是源站返回空响应、无效 HTTP 响应或连接重置。",
    useCases: ["源站返回空响应", "无效的 HTTP 响应头", "源站连接重置"],
    example: "Origin returns malformed response → Cloudflare 520"
  },
  521: {
    code: 521,
    name: "Web Server Is Down",
    category: "5xx",
    summary: "Cloudflare：无法连接到源站。",
    description: "521 Web Server Is Down 表示 Cloudflare 无法连接到源站。可能是源站离线、端口关闭或防火墙阻止了 Cloudflare IP。",
    useCases: ["源站服务器离线", "防火墙阻止 Cloudflare", "源站端口未开放"],
    example: "Origin server offline → Cloudflare 521"
  },
  522: {
    code: 522,
    name: "Connection Timed Out",
    category: "5xx",
    summary: "Cloudflare：与源站连接超时。",
    description: "522 Connection Timed Out 表示 Cloudflare 与源站建立 TCP 连接超时。可能是源站过载、网络拥堵或源站防火墙丢弃了 SYN 包。",
    useCases: ["源站过载无法接受连接", "网络拥堵导致超时", "源站防火墙丢弃连接"],
    example: "TCP handshake timeout to origin → Cloudflare 522"
  },
  523: {
    code: 523,
    name: "Origin Is Unreachable",
    category: "5xx",
    summary: "Cloudflare：无法到达源站。",
    description: "523 Origin Is Unreachable 表示 Cloudflare 无法到达源站。与 522 不同，523 通常是网络层问题（例如源站 IP 不可路由）。",
    useCases: ["源站 IP 不可路由", "DNS 解析到不存在的 IP", "网络路由问题"],
  },
  524: {
    code: 524,
    name: "A Timeout Occurred",
    category: "5xx",
    summary: "Cloudflare：与源站完成 TCP 连接，但等待响应超时。",
    description: "524 A Timeout Occurred 表示 Cloudflare 与源站完成了 TCP 连接，但在规定时间内没有收到完整的 HTTP 响应。常见于源站处理请求过慢。",
    useCases: ["源站处理请求过慢", "数据库查询超时", "源站应用卡死"],
    example: "Origin takes >100s to respond → Cloudflare 524"
  },
  525: {
    code: 525,
    name: "SSL Handshake Failed",
    category: "5xx",
    summary: "Cloudflare：与源站的 SSL/TLS 握手失败。",
    description: "525 SSL Handshake Failed 表示 Cloudflare 无法与源站建立 SSL/TLS 连接。可能是源站 SSL 证书过期、配置错误或不支持 CLoudflare 的 SSL 版本。",
    useCases: ["源站 SSL 证书过期", "SSL 配置不兼容", "源站不支持 TLS 1.2+"],
    example: "Origin has expired SSL cert → Cloudflare 525"
  },
  526: {
    code: 526,
    name: "Invalid SSL Certificate",
    category: "5xx",
    summary: "Cloudflare：源站 SSL 证书无效。",
    description: "526 Invalid SSL Certificate 表示 Cloudflare 检测到源站的 SSL 证书无效。可能是自签名证书、证书与主机名不匹配或证书链不完整。",
    useCases: ["自签名证书", "证书与域名不匹配", "不完整的证书链"],
  },
  527: {
    code: 527,
    name: "Railgun Error",
    category: "5xx",
    summary: "Cloudflare：Railgun 服务错误。",
    description: "527 Railgun Error 表示 Cloudflare 的 Railgun 优化服务遇到错误。Railgun 是 Cloudflare 的 WAN 优化技术，用于减少源站和 Cloudflare 之间的数据传输量。（已废弃）",
    useCases: ["Railgun 服务不可用", "Railgun 配置错误", "源站 Railgun 监听器离线"],
  },

  // ════════════════════ Nginx 专用状态码 ════════════════════
  444: {
    code: 444,
    name: "No Response (Nginx)",
    category: "4xx",
    summary: "Nginx：服务器不返回任何响应，直接关闭连接。",
    description: "444 No Response 是 Nginx 的自定义状态码，表示服务器不返回任何响应内容，直接关闭连接。常用于阻止恶意或无效的请求，不浪费带宽发送错误页面。",
    useCases: ["阻止恶意 User-Agent", "屏蔽扫描器", "减少无效请求的带宽消耗"],
  },
  495: {
    code: 495,
    name: "HTTPS Certificate Error (Nginx)",
    category: "4xx",
    summary: "Nginx：客户端 SSL 证书验证失败。",
    description: "495 HTTPS Certificate Error 是 Nginx 的自定义状态码，表示客户端在 SSL 握手时提供的证书验证失败。",
    useCases: ["客户端证书无效", "客户端证书过期", "客户端证书不被信任"],
  },
  496: {
    code: 496,
    name: "HTTPS No Certificate (Nginx)",
    category: "4xx",
    summary: "Nginx：客户端未提供 SSL 证书。",
    description: "496 HTTPS No Certificate 是 Nginx 的自定义状态码，表示客户端在未提供所需 SSL 证书的情况下尝试访问需要客户端证书的资源。",
    useCases: ["客户端证书缺失", "双向 SSL 认证失败", "证书要求的端点访问"],
  },
  497: {
    code: 497,
    name: "HTTP Request Sent to HTTPS Port (Nginx)",
    category: "4xx",
    summary: "Nginx：将 HTTP 请求发送到 HTTPS 端口。",
    description: "497 HTTP Request Sent to HTTPS Port 是 Nginx 的自定义状态码，表示客户端在 HTTPS 端口（通常是 443）上发送了 HTTP 请求而非 HTTPS 请求。",
    useCases: ["错误的协议访问端口", "HTTP 到 HTTPS 端口的错误请求", "配置错误排查"],
  },
  499: {
    code: 499,
    name: "Client Closed Request (Nginx)",
    category: "4xx",
    summary: "Nginx：客户端在服务器处理请求之前关闭了连接。",
    description: "499 Client Closed Request 是 Nginx 的自定义状态码，表示客户端在服务器完成处理请求之前关闭了连接。常见于用户刷新页面或取消请求。",
    useCases: ["用户取消请求", "页面刷新导致中断", "客户端超时提前关闭"],
    example: "User refreshes page before response → Nginx logs 499"
  },
};
