interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export function Logo({ className, width = 120, height, alt = "CommerceOS" }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

export default Logo;
