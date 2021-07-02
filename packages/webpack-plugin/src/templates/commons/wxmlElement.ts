import { t } from '../helpers/t';

export const getConditionFromSidOrName = ({ sid, name }: { sid?: number; name: string }) =>
  sid === undefined ? t`type === '${name}'` : t`sid === ${sid}`;

export const getComponentTagName = ({ isWrapped, name }: { isWrapped?: boolean; name: string }) =>
  t`${isWrapped && 'goji-'}${name}`;

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
