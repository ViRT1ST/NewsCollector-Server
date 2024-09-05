import { twMerge } from 'tailwind-merge';

type Props = React.ComponentProps<'button'> & {
  danger?: boolean;
  white?: boolean;
};

export default function ArticlesListButton({
  danger = false, white = false, className, children, ...rest
}: Props) {

  // border-lt-btn-default-bg/30 dark:border-dt-btn-default-bg/30
  const commonStyles = `
    flex items-center
    border rounded font-roboto font-medium text-[0.8rem] leading-4
    text-lt-btn-default-fg dark:text-dt-btn-default-fg
    bg-lt-btn-default-bg/10 dark:bg-dt-btn-default-bg/[0.03]
    border-lt-btn-default-bg/10 dark:border-dt-btn-default-bg/10
    ml-1.5 md:ml-2
    py-1 md:py-1
    px-2 md:px-3
  `;

  const defaultColorsStyles = `
    hover:text-lt-btn-safe-fg hover:dark:text-dt-btn-safe-fg
    hover:bg-lt-btn-safe-bg hover:dark:bg-dt-btn-safe-bg
    hover:border-lt-btn-safe-bg hover:dark:border-dt-btn-safe-bg
  `;

  const dangerColorsStyles = `
    hover:text-lt-btn-danger-fg hover:dark:text-dt-btn-danger-fg
    hover:bg-dt-btn-danger-bg hover:dark:bg-dt-btn-danger-bg
    hover:border-dt-btn-danger-bg hover:dark:border-dt-btn-danger-bg
  `;

  // hover:dark:text-white/70
  // hover:dark:bg-transparent
  // hover:dark:border-white/60
  const whiteColorsStyles = `
    dark:text-white/50
    dark:bg-transparent
    dark:border-white/5

  `;

  const finalStyles = twMerge(
    commonStyles,
    danger ? dangerColorsStyles : defaultColorsStyles,
    white && whiteColorsStyles,
    className
  );

  return (
    <button className={finalStyles} { ...rest }>      
      {children}
    </button>
  );
}

