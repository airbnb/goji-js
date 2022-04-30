import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({ message: 'Fully supporting React', id: "home.info.react.title"}),
    Svg: require('@site/static/img/undraw_react.svg').default,
    description: (
      <>
        {translate({ message: 'Including React hooks / render props / HOC', id: "home.info.react.title.subtitle"})}
      </>
    ),
  },
  {
    title: translate({ message: 'Crossing platforms', id: "home.info.cross-platform.title"}),
    Svg: require('@site/static/img/undraw_operating_system.svg').default,
    description: (
      <>
        {translate({ message: 'WeChat / Alipay / Baidu / QQ / Toutiao', id: "home.info.cross-platform.subtitle"})}
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
