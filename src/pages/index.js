import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          NEAR AI Cloud
        </Heading>
        <p className="hero__subtitle">
          AI that runs on your terms — fully private, verifiable, and user-owned
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="docs/Confidential%20Cloud/quickstart">
            Get Started 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="NEAR AI Cloud - Private, Verifiable AI Platform"
      description="Deploy and scale powerful language models on TEE-enabled GPUs with on-chain guarantees. Fully private, verifiable, and user-owned AI platform.">
      <HomepageHeader />
      <main>
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <div className="markdown">
                <p>
                  Deploy and scale powerful language models on TEE-enabled GPUs with on-chain guarantees. 
                  Built for the age of agentic AI, NEAR AI Cloud gives your models the power to act, reason, 
                  and transact — while you retain complete control over the stack.
                </p>

                <h2>Getting Started</h2>
                <p>Ready to build the future of AI? Get started with NEAR AI Cloud in minutes:</p>

                <div className="row margin-vert--lg">
                  <div className="col col--4">
                      <Link to="docs/Confidential%20Cloud/quickstart" className="card">
                        <div className={`card__body ${styles.featureCard}`}>
                          <h3>🚀 Quick Start</h3>
                          <p>Get up and running in minutes with our comprehensive quickstart guide</p>
                        </div>
                      </Link>
                    </div>
                    <div className="col col--4">
                      <Link to="docs/Confidential%20Cloud/private-inference" className="card">
                        <div className={`card__body ${styles.featureCard}`}>
                          <h3>⚙️ Private Inference</h3>
                          <p>Learn about our secure architecture and how we protect your data</p>
                        </div>
                      </Link>
                    </div>
                    <div className="col col--4">
                      <Link to="docs/Confidential%20Cloud/verification" className="card">
                        <div className={`card__body ${styles.featureCard}`}>
                          <h3>✅ Verification</h3>
                          <p>Understand how to verify and validate AI responses for authenticity</p>
                        </div>
                      </Link>
                  </div>
                </div>

                <div className="alert alert--warning margin-vert--lg" role="alert">
                  <strong>Beta Release</strong>
                  <p>
                    NEAR AI Cloud is currently in beta - we're rapidly building and shipping new features! 
                    Join our community to help shape the future of private, verifiable AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
