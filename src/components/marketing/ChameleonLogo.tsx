import Image from 'next/image';

type ChameleonLogoProps = {
  size?: number;
  variant?: 'full' | 'icon';
  className?: string;
};

export function ChameleonLogo({
  size = 32,
  variant = 'full',
  className,
}: ChameleonLogoProps) {
  // logo-full.webp (chamelon_logo_with_text2.webp) — approx 3.5:1 wide lockup
  // logo-icon.webp — icon only, approx 1:1

  if (variant === 'icon') {
    return (
      <Image
        src="/logo-icon.webp"
        alt="Chameleon"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain' }}
        priority
      />
    );
  }

  const fullWidth = Math.round(size * 3.5);
  return (
    <Image
      src="/logo-full.webp"
      alt="Chameleon"
      width={fullWidth}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
      priority
    />
  );
}
