import React from 'react';

export function FeatureCard({ icon: Icon, title, description, href }) {
  return (
    <a className="doc-feature-card" href={href}>
      <div className="doc-feature-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </a>
  );
}

export function FeatureCardGrid({ children }) {
  return <div className="doc-feature-grid">{children}</div>;
}
