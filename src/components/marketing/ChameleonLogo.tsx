import Image from 'next/image';

type ChameleonLogoProps = {
  size?: number;
  variant?: 'full' | 'icon' | 'wordmark';
  color?: 'default' | 'dark';
  className?: string;
};

export function ChameleonLogo({
  size = 32,
  variant = 'full',
  className,
}: ChameleonLogoProps) {
  // logo-full.webp is 400x100 (aspect ratio 4:1)
  // logo-icon.webp is 300x280 (aspect ratio 1.07:1)

  if (variant === 'icon') {
    const iconWidth = Math.round(size * (300 / 280));
    return (
      <Image
        src="/logo-icon.webp"
        alt="Chameleon"
        width={iconWidth}
        height={size}
        className={className}
        style={{ objectFit: 'contain' }}
        priority
      />
    );
  }

  // Wordmark only is no longer directly supported with an image, 
  // but if requested, we fall back to full.
  const fullWidth = size * 4;
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
