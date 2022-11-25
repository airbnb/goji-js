import { GojiTarget } from '@goji/core';
import camelCase from 'lodash/camelCase';
import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';

export const getConditionFromSidOrName = ({
  simplifiedId,
  name,
}: {
  simplifiedId?: number;
  name: string;
}) => {
  const ids = getIds();

  return simplifiedId === undefined
    ? t`${ids.meta}.${ids.type} === '${name}'`
    : t`${ids.meta}.${ids.simplifiedId} === ${simplifiedId}`;
};

export const getComponentTagName = ({ isWrapped, name }: { isWrapped?: boolean; name: string }) =>
  t`${isWrapped && 'goji-'}${name}`;

export const getEventName = ({ target, event }: { target: GojiTarget; event: string }) =>
  target === 'alipay' ? camelCase(`on-${event}`) : `bind${event.replace(/-/g, '')}`;

export const element = ({
  tagName,
  attributes,
  children,
}: {
  tagName: string;
  attributes: Array<string>;
  children: string;
}) => {
  if (!children) {
    return t`
      <${tagName}
        ${attributes}
      />
    `;
  }

  return t`
    <${tagName}
      ${attributes}
    >
      ${children}
    </${tagName}>
  `;
};
