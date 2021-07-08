import { AriaProps, BaseProps, StyleProps } from './common';

export interface ViewProps extends BaseProps, StyleProps, AriaProps {
  as?: string;
  role?: string;
  isDisabled?: boolean;
}
