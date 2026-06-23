import {readFile} from 'node:fs/promises';
import path from 'node:path';

const FRONT_MATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

function stripFrontMatter(markdown) {
  return markdown.replace(FRONT_MATTER_PATTERN, '');
}

function stripTopLevelImports(markdown) {
  const lines = markdown.split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (trimmedLine === '') {
      index += 1;
      continue;
    }

    if (!trimmedLine.startsWith('import ')) {
      break;
    }

    index += 1;
    while (index < lines.length && !lines[index - 1].trim().endsWith(';')) {
      index += 1;
    }
  }

  return lines.slice(index).join('\n');
}

function hasOpeningHeading(markdown) {
  return markdown.trimStart().startsWith('# ');
}

function normalizeMarkdownForLlms({markdown, title}) {
  const body = stripTopLevelImports(stripFrontMatter(markdown)).trim();

  if (hasOpeningHeading(body)) {
    return `${body}\n`;
  }

  return `# ${title}\n\n${body}\n`;
}

function toSiteRelativePath(source) {
  return source.replace(/^@site\//, '');
}

function getDocsFromPluginData(docsPluginData) {
  return Object.values(docsPluginData ?? {}).flatMap((pluginData) =>
    (pluginData.loadedVersions ?? []).flatMap((version) => version.docs ?? []),
  );
}

export default function llmsMarkdownPlugin(context) {
  return {
    name: 'nearai-llms-markdown',
    async allContentLoaded({allContent, actions}) {
      const docsPluginData = allContent['docusaurus-plugin-content-docs'];
      const docs = getDocsFromPluginData(docsPluginData);
      const pages = {};

      await Promise.all(
        docs.map(async (doc) => {
          const sourcePath = path.join(
            context.siteDir,
            toSiteRelativePath(doc.source),
          );
          const markdown = await readFile(sourcePath, 'utf8');

          pages[doc.source] = {
            title: doc.title,
            permalink: doc.permalink,
            markdown: normalizeMarkdownForLlms({
              markdown,
              title: doc.title,
            }),
          };
        }),
      );

      actions.setGlobalData({pages});
    },
  };
}
