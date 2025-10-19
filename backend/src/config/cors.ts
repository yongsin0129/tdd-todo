import { CorsOptions } from 'cors';

/**
 * CORS 設定
 * 支援從 CORS_ORIGIN 環境變數設定多個來源
 * 格式: CORS_ORIGIN=url1,url2,url3
 */
export const corsOptions: CorsOptions = {
  /**
   * origin: 設定允許的來源域名
   * 允許沒有來源的請求（如行動應用程式、Postman 或 curl 請求）
   * 從 CORS_ORIGIN 環境變數獲取允許的來源列表，用逗號分隔並去除空白
   * 如果來源在允許列表中則允許，否則拒絕
   * 會在控制台記錄詳細的 CORS 檢查資訊
   */
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // 允許沒有來源的請求（如行動應用程式、Postman 或 curl 請求）
    if (!origin) {
      return callback(null, true);
    }

    // 從環境變數獲取允許的來源
    const corsOrigin = process.env.CORS_ORIGIN;
    if (!corsOrigin) {
      // 如果沒有設定 CORS_ORIGIN，拒絕所有跨域請求
      return callback(new Error('CORS 未設定'));
    }

    // 以逗號分割並去除空白
    const allowedOrigins = corsOrigin.split(',').map(url => url.trim());
    console.log('CORS: 允許的來源列表:', allowedOrigins);
    console.log('CORS: 當前請求來源:', origin);

    // 檢查來源是否在允許列表中（支援萬用字元 * 匹配）
    const isAllowed = allowedOrigins.some(pattern => {
      // 如果包含萬用字元，轉換為正則表達式
      if (pattern.includes('*')) {
        const regexPattern = pattern.replace(/\*/g, '.*').replace(/\./g, '\\.');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(origin);
      }
      // 否則進行精確匹配
      return pattern === origin;
    });

    if (isAllowed) {
      console.log('CORS: 來源已允許，允許請求');
      callback(null, true);
    } else {
      console.log('CORS: 來源未在允許列表中，拒絕請求');
      callback(new Error('CORS 不允許'));
    }
  },
  /**
   * credentials: 是否允許發送憑證
   * 設為 true 允許跨域請求攜帶 cookies 和授權標頭
   */
  credentials: true,
  /**
   * methods: 允許的 HTTP 方法
   * 包括 GET、POST、PUT、DELETE、OPTIONS、PATCH
   */
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  /**
   * allowedHeaders: 允許的請求標頭
   * 包括 Content-Type、Authorization、X-Requested-With、Accept、Origin
   */
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  /**
   * optionsSuccessStatus: OPTIONS 請求的成功狀態碼
   * 設為 200 以避免某些舊瀏覽器對 204 的問題
   */
  optionsSuccessStatus: 200
};