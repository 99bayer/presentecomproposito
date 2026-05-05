// ─────────────────────────────────────────────
//  CONFIGURAÇÃO DO SUPABASE
//  Substitua os valores abaixo pelos seus.
//  Você encontra em: Supabase → Settings → API
// ─────────────────────────────────────────────

const SUPABASE_URL  = 'https://xcyxfwhwlqwxiawmkjjw.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_Jc785UT3yIq7gloNDLlcIg_etTNeHyJ';
const ADMIN_PASSWORD = 'presentecomproposito'; // troque por uma senha forte

// ─── Cliente HTTP para a API REST do Supabase ───
const db = {
  async fetch(path, options = {}) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
      ...options,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': options.prefer || '',
        ...options.headers,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Erro ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  // Storage: gera URL pública de uma imagem
  storageUrl(bucket, path) {
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  },

  // Storage: faz upload de um arquivo
  async uploadFile(bucket, filePath, file) {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: file,
      }
    );
    if (!res.ok) throw new Error('Falha no upload da imagem');
    return db.storageUrl(bucket, filePath);
  },
};
