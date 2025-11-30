import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const API_URL = 'https://cloud-api.near.ai/v1/model/list';

function formatPrice(costPerToken) {
  if (!costPerToken) return 'N/A';
  // costPerToken has { amount, scale, currency }
  // scale=9 means nano-dollars, so divide by 10^scale to get dollars
  // Then multiply by 1,000,000 to get per-million tokens
  const dollarsPerToken = costPerToken.amount / Math.pow(10, costPerToken.scale);
  const dollarsPerMillion = dollarsPerToken * 1_000_000;
  return `$${dollarsPerMillion.toFixed(2)}/M`;
}

function formatContext(contextLength) {
  if (!contextLength) return 'N/A';
  if (contextLength >= 1000) {
    return `${Math.round(contextLength / 1000)}K`;
  }
  return contextLength.toString();
}

function ModelCard({ model }) {
  const { modelId, inputCostPerToken, outputCostPerToken, metadata } = model;
  const displayName = metadata?.modelDisplayName || modelId.split('/').pop();
  const description = metadata?.modelDescription || '';
  const contextLength = metadata?.contextLength;
  const iconUrl = metadata?.modelIcon;

  return (
    <div className="doc-model-card">
      <div className="doc-model-header">
        <div className={styles.modelIcon}>
          {iconUrl ? (
            <img src={iconUrl} alt={displayName} />
          ) : (
            <div className={styles.placeholderIcon}>🤖</div>
          )}
        </div>
        <div>
          <h3>{displayName}</h3>
        </div>
      </div>
      {description && (
        <p className={styles.description}>
          {description.split('\n')[0]}
        </p>
      )}
      <div className="doc-model-meta">
        <span>{formatContext(contextLength)} context</span>
        <span>{formatPrice(inputCostPerToken)} input</span>
        <span>{formatPrice(outputCostPerToken)} output</span>
      </div>
      <p><strong>Model ID:</strong></p>
      <CodeBlock language="text">{modelId}</CodeBlock>
    </div>
  );
}

function ModelTable({ models }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Model</th>
          <th>Model ID</th>
          <th>Context</th>
          <th>Input Price</th>
          <th>Output Price</th>
        </tr>
      </thead>
      <tbody>
        {models.map((model) => {
          const displayName = model.metadata?.modelDisplayName || model.modelId.split('/').pop();
          return (
            <tr key={model.modelId}>
              <td>{displayName}</td>
              <td><CodeBlock language="text">{model.modelId}</CodeBlock></td>
              <td>{formatContext(model.metadata?.contextLength)}</td>
              <td>{formatPrice(model.inputCostPerToken)}</td>
              <td>{formatPrice(model.outputCostPerToken)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function ModelList({ showTable = false }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.status}`);
        }
        const data = await response.json();
        setModels(data.models || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>Loading models...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <span>⚠️ Failed to load models: {error}</span>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className={styles.empty}>
        <span>No models available</span>
      </div>
    );
  }

  if (showTable) {
    return <ModelTable models={models} />;
  }

  return (
    <div className="doc-model-grid">
      {models.map((model) => (
        <ModelCard key={model.modelId} model={model} />
      ))}
    </div>
  );
}

export default ModelList;

