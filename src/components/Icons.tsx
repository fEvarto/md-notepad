import type { ImgHTMLAttributes, SVGProps } from 'react'

function AssetIcon({ src, alt = '', ...props }: ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      {...props}
      style={{ display: 'block', width: '100%', height: '100%', ...props.style }}
    />
  )
}

function iconProps(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke',
    shapeRendering: 'geometricPrecision',
    focusable: false,
    'aria-hidden': true,
    ...props,
  }
}

export function BoldIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/Bold.svg" {...props} />
}

export function ItalicIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/Italic.svg" {...props} />
}

export function CodeIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/Code.svg" {...props} />
}

export function HeadingIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/H1.svg" {...props} />
}

export function Heading2Icon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/H2.svg" {...props} />
}

export function ListIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/List.svg" {...props} />
}

export function ExportIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/Export.svg" {...props} />
}

export function InfoIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/Info.svg" {...props} />
}

export function InfoInIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/InfoIn.svg" {...props} />
}

export function SettingsIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/Settings.svg" {...props} />
}

export function LightbulbIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/Tips.svg" {...props} />
}

export function SparklesIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <AssetIcon src="/PatchNotes.svg" {...props} />
}

export function PaletteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3a9 9 0 0 0-9 9"></path>
      <path d="M3 12a9 9 0 0 0 9 9"></path>
      <path d="M12 12a3 3 0 0 1 3 3"></path>
      <circle cx="7" cy="8" r="1"></circle>
      <circle cx="7" cy="15" r="1"></circle>
      <circle cx="16" cy="8" r="1"></circle>
      <circle cx="16" cy="15" r="1"></circle>
    </svg>
  )
}

export function PreviewIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4" y="5" width="16" height="14" rx="2"></rect>
      <path d="M8 10h8"></path>
      <path d="M8 14h5"></path>
    </svg>
  )
}

export function EditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  )
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}

export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M21 12a9 9 0 1 1-3-6.7"></path>
      <path d="M21 3v6h-6"></path>
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}
