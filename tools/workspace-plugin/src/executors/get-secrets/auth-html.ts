const page = (accent: string, icon: string, title: string, subtitle: string) =>
  [
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${title}</title><style>`,
    '*{margin:0;padding:0;box-sizing:border-box}',
    'body{min-height:100vh;display:flex;align-items:center;justify-content:center;',
    "background:#0a0a0f;color:#e2e2e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
    '.card{text-align:center;padding:3.5rem 3rem;border-radius:20px;',
    'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);max-width:420px;width:90%;',
    `box-shadow:0 0 80px rgba(${accent},.06),0 40px 60px rgba(0,0,0,.4)}`,
    '.icon{font-size:3.2rem;margin-bottom:1.2rem;display:block}',
    'h1{font-size:1.5rem;font-weight:600;letter-spacing:-.02em;margin-bottom:.6rem}',
    `.bar{width:60px;height:3px;border-radius:2px;margin:1.2rem auto;background:rgb(${accent});opacity:.5}`,
    "p{font-family:'SF Mono',Consolas,monospace;font-size:.82rem;color:rgba(226,226,232,.45)}",
    '</style></head><body><div class="card">',
    `<span class="icon">${icon}</span><h1>${title}</h1>`,
    `<div class="bar"></div><p>${subtitle}</p>`,
    '</div></body></html>',
  ].join('\n');

export const authSuccessHtml = page('99,222,158', '&#128275;', 'Authentication Successful', 'You may close this tab');

export const authFailureHtml = (detail: string) => page('235,87,87', '&#128274;', 'Authentication Failed', detail || 'Something went wrong');
