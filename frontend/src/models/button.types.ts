export type ButtonOptions = {
  content: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;

  ariaLabel: string;
  title: string;
  tabIndex?: number;

  onClick?: (event: PointerEvent) => void;

  dataset?: Record<string, string>;
};
