import { generateMetadata } from './metadata';

// Re-export generateMetadata for this route
export { generateMetadata };

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

