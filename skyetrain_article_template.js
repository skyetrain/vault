// ============================================================================
// SKYETRAIN ARTICLE TEMPLATE
// ============================================================================
// Reusable document template for all Skyetrain client-facing articles.
// To use: update the CONTENT section below, then run with `node skyetrain_template.js`
//
// Requirements: npm install -g docx
// Logo file:    Place SKYETRAIN_MERCH_-_SKYETRAIN_LOGO.png in same directory
//               or update LOGO_PATH below.
//
// Design system:
//   - Body font: Georgia (serif, editorial warmth)
//   - Heading font: Arial (sans-serif, clean contrast)
//   - Blue accent: section heading left-border, header line, footer line
//   - Red accent: single line closing the title block
//   - Logo: centred above title
//   - Title: centred, letter-spaced
//   - Subtitle: centred, italic, below title
//   - Author: right-aligned, below red line
//   - Section headings: blue left-border accent, keepNext enabled
//   - Widow/orphan control on body text
//   - A4 page size, 1" side margins
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
const OUTPUT_PATH = "./output.docx"; // Change per article

// ── DESIGN TOKENS ──
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

const SPACING = {
  bodyAfter: 180,
  bodyLine: 336,
  bulletAfter: 80,
  sectionBefore: 600,
  sectionAfter: 180,
  titleBlockEnd: 480,
};

// ============================================================================
// CONTENT — UPDATE THIS SECTION FOR EACH NEW ARTICLE
// ============================================================================
//
// Structure:
//   title:    All-caps article title
//   subtitle: One-line description (italic)
//   author:   Author name (appears as "by [author]")
//   sections: Array of section objects with:
//     heading:    Section heading text
//     paragraphs: Array of paragraph arrays. Each paragraph is an array of
//                 text spans: { text: "...", bold: true/false, italics: true/false }
//                 Plain string shorthand: [{ text: "Your text here" }]
//     bullets:    (optional) Array of bullet point strings
//     after:      (optional) Paragraphs after bullets
//     bullets2:   (optional) Second set of bullets
//     after2:     (optional) Paragraphs after second bullets
//
// Example section:
//   {
//     heading: "Section title",
//     paragraphs: [
//       [{ text: "First paragraph text." }],
//       [{ text: "Second paragraph with " }, { text: "bold word", bold: true }, { text: " in it." }],
//     ],
//     bullets: ["Bullet one", "Bullet two"],
//     after: [
//       [{ text: "Paragraph after the bullets." }],
//     ],
//   }
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
const LOGO_ASPECT = 466 / 2000; // height / width from original file
const LOGO_DISPLAY_W = 180;
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
  // Centred logo
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 360 },
    children: [new ImageRun({ data: logoData, transformation: { width: LOGO_DISPLAY_W, height: LOGO_DISPLAY_H }, type: "png" })],
  }),

  // Title
  new Paragraph({
    spacing: { before: 60, after: 240 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: content.title, font: FONTS.heading, size: SIZES.title, bold: true, color: PALETTE.heading, characterSpacing: 80 })],
  }),

  // Subtitle
  new Paragraph({
    spacing: { after: 160 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: content.subtitle, font: FONTS.body, size: SIZES.subtitle, italics: true, color: PALETTE.subtitle })],
  }),

  // Red accent line (closes title block)
  new Paragraph({
    spacing: { after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PALETTE.accentRed, space: 1 } },
    children: [],
  }),

  // Author (below red line)
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
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1600, bottom: 1440, left: 1600 },
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
