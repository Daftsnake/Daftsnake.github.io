/* global hexo */
/**
 * 敏感信息守卫：在 hexo generate / server 前扫描 source 下的 Markdown，
 * 发现疑似密钥、令牌、手机号等内容时在终端给出黄色警告（不会中断构建）。
 * 如确认某处是安全的示例，可在该行末尾加上注释  <!-- secret-ok -->  跳过检查。
 */
'use strict';

const RULES = [
  { name: 'GitHub Token', re: /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/ },
  { name: 'OpenAI / 类 OpenAI Key', re: /\bsk-(?!x{8,})[A-Za-z0-9_-]{24,}\b/ },
  { name: 'AWS Access Key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Google API Key', re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: '私钥', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: '手机号', re: /(?<![\d+])1[3-9]\d{9}(?!\d)/, skip: /13800138000/ },
  { name: '本机用户路径', re: /[A-Z]:\\Users\\(?!xxx|YourName|用户名)[^\\\s]+\\/i }
];

hexo.extend.filter.register('before_generate', function () {
  const files = hexo.model('Post').toArray().concat(hexo.model('Page').toArray());
  let hits = 0;

  files.forEach(doc => {
    const lines = String(doc.raw || '').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.includes('secret-ok')) return;
      RULES.forEach(rule => {
        if (rule.re.test(line) && !(rule.skip && rule.skip.test(line))) {
          hits++;
          hexo.log.warn(`[secret-guard] ${rule.name} -> ${doc.source}:${i + 1}`);
        }
      });
    });
  });

  if (hits) {
    hexo.log.warn(`[secret-guard] 共发现 ${hits} 处疑似敏感信息，发布前请确认（安全示例可在行尾加 <!-- secret-ok -->）。`);
  }
});
