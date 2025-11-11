import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import Heading from "@theme/Heading";
import styles from "./index.module.css";
import VerifiedGif from "@site/static/img/verified.gif";
import PrivateInferenceIcon from "@site/static/img/icons/private-inference.svg";
import VerificationIcon from "@site/static/img/icons/verification.svg";
import QuickstartIcon from "@site/static/img/icons/quickstart.svg";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Private. Intelligent. Yours.
        </Heading>
        <p
          className="hero__subtitle"
          style={{
            color: "var(--ifm-font-color-base)",
          }}
        >
          Build private, user-owned AI with NEAR AI Cloud
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="docs/NEAR%20AI%20Cloud/quickstart"
          >
            Start Building
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="NEAR AI Cloud - Private, Verifiable AI Platform"
      description="Deploy and scale powerful language models on TEE-enabled GPUs with on-chain guarantees. Fully private, verifiable, and user-owned AI platform."
    >
      <HomepageHeader />
      <main>
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <div className="markdown">
                <div className={styles.lead}>
                  <p className={styles.leadCopy}>
                    NEAR AI runs the models you trust in secure Trusted
                    Execution Environments (TEEs), ensuring your data stays
                    completely private. Model providers, cloud providers, and
                    NEAR cannot access, view, or use your data for training —
                    your information remains yours alone.
                  </p>
                </div>
                <div className={clsx("row", styles.featureRow)}>
                  <div className="col col--4">
                    <Link
                      to="docs/NEAR%20AI%20Cloud/quickstart"
                      className="card"
                    >
                      <div className={`card__body ${styles.featureCard}`}>
                        <div className={styles.featureIcon}>
                          <QuickstartIcon />
                        </div>
                        <h3>Quick Start</h3>
                        <p>
                          Start building private, verifiable AI in minutes
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col col--4">
                    <Link
                      to="docs/NEAR%20AI%20Cloud/private-inference"
                      className="card"
                    >
                      <div className={`card__body ${styles.featureCard}`}>
                        <div className={styles.featureIcon}>
                          <PrivateInferenceIcon />
                        </div>
                        <h3>Private Inference</h3>
                        <p>
                          Learn about the secure architecture and how your data is
                          protected
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col col--4">
                    <Link
                      to="docs/NEAR%20AI%20Cloud/verification"
                      className="card"
                    >
                      <div className={`card__body ${styles.featureCard}`}>
                        <div className={styles.featureIcon}>
                          <VerificationIcon />
                        </div>
                        <h3>Verification</h3>
                        <p>
                          Understand how to verify and validate secure interactions
                          with AI models
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div
                  className={styles.betaBanner}
                  role="note"
                  aria-label="Beta release"
                >
                  <div className={styles.betaBadge}>Beta</div>
                  <div className={styles.betaContent}>
                    <h4 className={styles.betaTitle}>Beta Release</h4>
                    <p className={styles.betaText}>
                      NEAR AI Cloud is currently in beta. We're rapidly building
                      and shipping new features. Join our community to help
                      shape the future of private, verifiable AI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
