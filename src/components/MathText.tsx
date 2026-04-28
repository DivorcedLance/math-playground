import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  expression: string;
  displayMode?: boolean;
  className?: string;
}

export function MathText({ expression, displayMode = false, className = '' }: MathTextProps) {
  try {
    const html = katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      output: 'html',
    });

    return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <span className={className}>{expression}</span>;
  }
}
