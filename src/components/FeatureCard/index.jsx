import React from 'react';
import Link from '@docusaurus/Link';

export function FeatureCard({ icon: Icon, title, description, href }) {
  return (
    <Link className="doc-feature-card" to={href}>
      <div className="doc-feature-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}

export function FeatureCardGrid({ children }) {
  return <div className="doc-feature-grid">{children}</div>;
}
