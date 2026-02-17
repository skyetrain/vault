// ============================================================================
// SKYETRAIN ARTICLE TEMPLATE — MOBILE (6x9 inch)
// ============================================================================
// Mobile-optimised version for articles viewed as PDF on phones/tablets.
// Uses 6x9 inch book format so text fills more of the screen width.
// All design tokens identical to the A4 template.
//
// Use this when: Articles distributed via Everfit app or other mobile-first channels.
// Use A4 when:   Articles for print, desktop, or formal documents.
//
// Requirements: npm install -g docx
// Logo file:    Place SKYETRAIN_MERCH_-_SKYETRAIN_LOGO.png in same directory
//               or update LOGO_PATH below.
//
// Design system (shared with A4):
//   - Body font: Georgia (serif, editorial warmth)
//   - Heading font: Arial (sans-serif, clean contrast)
//   - Blue accent: section heading left-border, header line, footer line
//   - Red accent: single line closing the title block
//   - Logo: centred above title
//   - Section headings: blue left-border accent, keepNext enabled
//   - Widow/orphan control on body text
//
// Mobile differences:
//   - Page: 6x9 inch (8640 x 12960 DXA) vs A4 (11906 x 16838 DXA)
//   - Margins: 0.75" sides vs ~1.1" sides on A4
//   - Logo: 150px wide vs 180px on A4
//   - Slightly tighter spacing in title block
//
// Writing style reminders:
//   - Direct, no fluff, short sentences
//   - No em dashes (use full stops or commas instead)
//   - No AI-sounding phrasing or motivational language
//   - Match Skye's voice: confident, precise, systems-driven
// ============================================================================

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType,
  LevelFormat, BorderStyle, Header, Footer
} = require("docx");

// ── CONFIG ──
const LOGO_PATH = "./SKYETRAIN_MERCH_-_SKYETRAIN_LOGO.png";
const OUTPUT_PATH = "./output_mobile.docx"; // Change per article

// ── DESIGN TOKENS (shared with A4) ──
const PALETTE = {
  text: "3A3A3A",
  subtitle: "777777",
  heading: "2A2A2A",
  accentBlue: "3D4DB7",
  accentRed: "C65D4A",
};

const FONTS = {
  body: "Georgia",
  heading: "Arial",
};

const SIZES = {
  body: 22,       // 11pt
  heading: 26,    // 13pt
  title: 38,      // 19pt
  subtitle: 20,   // 10pt
  meta: 16,       // 8pt
};

// ── PAGE: 6x9 inch (mobile-optimised book format) ──
const PAGE = {
  width: 8640,     // 6 inches
  height: 12960,   // 9 inches
  marginSide: 1080, // 0.75 inches
  marginTB: 1080,   // 0.75 inches
};

const SPACING = {
  bodyAfter: 180,
  bodyLine: 336,
  bulletAfter: 80,
  sectionBefore: 600,
  sectionAfter: 180,
  titleBlockEnd: 400,
};

// ============================================================================
// CONTENT — UPDATE THIS SECTION FOR EACH NEW ARTICLE
// ============================================================================

const content = {
  title: "ARTICLE TITLE HERE",
  subtitle: "One-line description of the article",
  author: "Skye Boyland",
  sections: [
    {
      heading: "First section heading",
      paragraphs: [
        [{ text: "First paragraph content." }],
      ],
    },
    // Add more sections as needed...
  ],
};

// ============================================================================
// TEMPLATE ENGINE — DO NOT EDIT BELOW THIS LINE
// ============================================================================

const logoData = fs.readFileSync(LOGO_PATH);
const LOGO_ASPECT = 466 / 2000;
const LOGO_DISPLAY_W = 150; // Slightly smaller for narrower page
const LOGO_DISPLAY_H = Math.round(LOGO_DISPLAY_W * LOGO_ASPECT);

function makeRuns(spans) {
  return spans.map(s => new TextRun({
    text: s.text,
    font: s.bold ? FONTS.heading : FONTS.body,
    size: SIZES.body,
    color: PALETTE.text,
    bold: s.bold || false,
    italics: s.italics || false,
  }));
}

function bodyP(spans) {
  return new Paragraph({
    spacing: { after: SPACING.bodyAfter, line: SPACING.bodyLine },
    widowControl: true,
    children: makeRuns(spans),
  });
}

function bulletP(text) {
  return new Paragraph({
    numbering: { reference: "mainBullets", level: 0 },
    spacing: { after: SPACING.bulletAfter, line: SPACING.bodyLine },
    children: [new TextRun({ text, font: FONTS.body, size: SIZES.body, color: PALETTE.text })],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: SPACING.sectionBefore, after: SPACING.sectionAfter },
    keepNext: true,
    keepLines: true,
    border: {
      left: { style: BorderStyle.SINGLE, size: 14, color: PALETTE.accentBlue, space: 10 },
    },
    indent: { left: 240 },
    children: [new TextRun({ text, font: FONTS.heading, size: SIZES.heading, bold: true, color: PALETTE.heading })],
  });
}

function spacer(after = 100) {
  return new Paragraph({ spacing: { after }, children: [] });
}

function buildSection(sec) {
  const parts = [];
  parts.push(sectionHeading(sec.heading));
  if (sec.paragraphs) sec.paragraphs.forEach(p => parts.push(bodyP(p)));
  if (sec.bullets) sec.bullets.forEach(b => parts.push(bulletP(b)));
  if (sec.after) {
    parts.push(spacer(60));
    sec.after.forEach(p => parts.push(bodyP(p)));
  }
  if (sec.bullets2) sec.bullets2.forEach(b => parts.push(bulletP(b)));
  if (sec.after2) {
    parts.push(spacer(60));
    sec.after2.forEach(p => parts.push(bodyP(p)));
  }
  return parts;
}

// ── TITLE BLOCK ──
const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 300 },
    children: [new ImageRun({ data: logoData, transformation: { width: LOGO_DISPLAY_W, height: LOGO_DISPLAY_H }, type: "png" })],
  }),

  new Paragraph({
    spacing: { before: 60, after: 200 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: content.title, font: FONTS.heading, size: SIZES.title, bold: true, color: PALETTE.heading, characterSpacing: 80 })],
  }),

  new Paragraph({
    spacing: { after: 140 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: content.subtitle, font: FONTS.body, size: SIZES.subtitle, italics: true, color: PALETTE.subtitle })],
  }),

  new Paragraph({
    spacing: { after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PALETTE.accentRed, space: 1 } },
    children: [],
  }),

  new Paragraph({
    spacing: { after: SPACING.titleBlockEnd },
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text: `by ${content.author}`, font: FONTS.body, size: SIZES.subtitle, color: PALETTE.subtitle })],
  }),
];

// ── BUILD SECTIONS ──
content.sections.forEach(sec => children.push(...buildSection(sec)));

// ── DOCUMENT ──
const doc = new Document({
  numbering: {
    config: [{
      reference: "mainBullets",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: { indent: { left: 720, hanging: 360 } },
        },
      }],
    }],
  },
  styles: {
    default: {
      document: { run: { font: FONTS.body, size: SIZES.body } },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE.width, height: PAGE.height },
        margin: { top: PAGE.marginTB, right: PAGE.marginSide, bottom: PAGE.marginTB, left: PAGE.marginSide },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 80 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PALETTE.accentBlue, space: 6 } },
          children: [new TextRun({ text: "SKYETRAIN", font: FONTS.heading, size: SIZES.meta, color: "CCCCCC", characterSpacing: 60 })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: PALETTE.accentBlue, space: 6 } },
          children: [new TextRun({ text: "skyetrain.com", font: FONTS.body, size: SIZES.meta, italics: true, color: "CCCCCC" })],
        })],
      }),
    },
    children,
  }],
});

// ── OUTPUT ──
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Created: ${OUTPUT_PATH}`);
});
