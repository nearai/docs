import React, {useState} from 'react';
import useGlobalData from '@docusaurus/useGlobalData';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import OriginalDocItemContent from '@theme-original/DocItem/Content';

import styles from './styles.module.css';

const RESET_DELAY_MS = 1600;

function getMarkdownForSource(globalData, source) {
  return globalData['nearai-llms-markdown']?.default?.pages?.[source]
    ?.markdown;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.inset = '0 auto auto 0';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error('Copy command failed');
  }
}

function CopyMarkdownButton() {
  const {metadata} = useDoc();
  const globalData = useGlobalData();
  const markdown = getMarkdownForSource(globalData, metadata.source);
  const [status, setStatus] = useState('idle');
  const canCopy = typeof markdown === 'string' && markdown.length > 0;

  async function handleCopy() {
    if (!canCopy) {
      return;
    }

    try {
      await copyText(markdown);
      setStatus('copied');
    } catch {
      setStatus('error');
    } finally {
      window.setTimeout(() => setStatus('idle'), RESET_DELAY_MS);
    }
  }

  const statusMessage =
    status === 'copied'
      ? `Copied ${metadata.title} as Markdown`
      : status === 'error'
        ? 'Markdown copy failed'
        : '';

  return (
    <div className={styles.copyMarkdownBar}>
      <button
        type="button"
        className={styles.copyMarkdownButton}
        disabled={!canCopy}
        onClick={handleCopy}
        aria-label="Copy page content as Markdown for LLMs">
        {status === 'copied' ? 'Copied' : 'Copy Markdown'}
      </button>
      <span className={styles.copyMarkdownStatus} role="status" aria-live="polite">
        {statusMessage}
      </span>
    </div>
  );
}

export default function DocItemContentWrapper(props) {
  return (
    <>
      <CopyMarkdownButton />
      <OriginalDocItemContent {...props} />
    </>
  );
}
