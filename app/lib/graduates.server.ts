import {transliterateKaToLatin} from '~/lib/transliterate';

export type Graduate = {
  fullNameKa: string;
  fullNameLatin: string;
  img: string;
  certificationDateRaw: string;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"' && inQuotes && next === '"') {
      field += '"';
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && (c === ',')) {
      row.push(field);
      field = '';
      continue;
    }

    if (!inQuotes && (c === '\n')) {
      row.push(field);
      rows.push(row.map((x) => x.trim()));
      row = [];
      field = '';
      continue;
    }

    if (c !== '\r') field += c;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row.map((x) => x.trim()));
  }

  return rows.filter((r) => r.some((x) => x.length > 0));
}

function normalizeHeader(h: string) {
  return h.trim().toLowerCase();
}

export async function fetchGraduates(context: any): Promise<Graduate[]> {
  const url: string | undefined = context?.env?.PUBLIC_GRADUATES_CSV_URL;

  if (!url) {
    throw new Error(
      'PUBLIC_GRADUATES_CSV_URL is not set. Add it to your .env file.',
    );
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch graduates CSV (${res.status})`);
  }

  const csvText = await res.text();
  const table = parseCsv(csvText);

  if (table.length < 2) return [];

  const headers = table[0].map(normalizeHeader);
  const fullNameIdx = headers.indexOf(normalizeHeader('Full Name'));
  const imgIdx = headers.indexOf(normalizeHeader('Img'));
  const dateIdx = headers.indexOf(normalizeHeader('Certification Date'));

  if (fullNameIdx === -1 || imgIdx === -1 || dateIdx === -1) {
    throw new Error(
      `CSV headers mismatch. Expected: "Full Name, Img, Certification Date". Got: ${table[0].join(', ')}`,
    );
  }

  const dataRows = table.slice(1);

  const graduates: Graduate[] = dataRows
    .map((r) => ({
      fullNameKa: r[fullNameIdx] ?? '',
      fullNameLatin: transliterateKaToLatin(r[fullNameIdx] ?? ''),
      img: r[imgIdx] ?? '',
      certificationDateRaw: r[dateIdx] ?? '',
    }))
    .filter((g) => g.fullNameKa.length > 0);

  return graduates;
}