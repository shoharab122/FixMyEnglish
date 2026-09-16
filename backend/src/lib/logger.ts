const ts = () => new Date().toISOString();
export const log = {
  info:  (...a: any[]) => console.log(`[${ts()}] [info]`,  ...a),
  warn:  (...a: any[]) => console.warn(`[${ts()}] [warn]`,  ...a),
  error: (...a: any[]) => console.error(`[${ts()}] [error]`, ...a),
};
