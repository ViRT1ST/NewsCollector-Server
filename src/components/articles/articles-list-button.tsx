import { twMerge } from 'tailwind-merge';

type Props = React.ComponentProps<'button'> & {
  danger?: boolean;
  white?: boolean;
};

export default function ArticlesListButton({
  danger = false, 
  white = false,
  className,
  children,
  ...rest
}: Props) {

  const commonStyles = `
    flex items-center border rounded font-roboto font-medium text-[0.8rem] leading-4
    ml-1.5 md:ml-2
    py-1 md:py-1
    px-2 md:px-3
  `;

  const defaultColorsStyles = `
    text-lt-btn-default-fg dark:text-dt-btn-default-fg
    bg-lt-btn-default-bg/10 dark:bg-dt-btn-default-bg/[0.01]
    border-lt-btn-default-fg/30 dark:border-dt-btn-default-bg/10
  `;

  const whiteColorsStyles = `
    text-lt-btn-default-fg dark:text-white/50
    bg-transparent dark:bg-transparent
    border-lt-btn-default-fg/30 dark:border-white/5
  `;

  const defaultHoverStyles = `
    hover:text-lt-btn-safe-fg hover:dark:text-dt-btn-safe-fg
    hover:bg-lt-btn-safe-bg hover:dark:bg-dt-btn-safe-bg
    hover:border-lt-btn-safe-bg hover:dark:border-dt-btn-safe-bg
  `;

  const dangerHoverStyles = `
    hover:text-lt-btn-danger-fg hover:dark:text-dt-btn-danger-fg
    hover:bg-dt-btn-danger-bg hover:dark:bg-dt-btn-danger-bg
    hover:border-dt-btn-danger-bg hover:dark:border-dt-btn-danger-bg
  `;

  const finalStyles = twMerge(
    commonStyles,
    white ? whiteColorsStyles : defaultColorsStyles,
    danger ? dangerHoverStyles : defaultHoverStyles,
    className
  );

  return (
    <button className={finalStyles} { ...rest }>      
      {children}
    </button>
  );
}

