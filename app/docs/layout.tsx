import { DocsHeader } from '@/components/docs-sidebar';

export const metadata = {
  title: 'Docs — hypeshelf',
  description: 'Technical documentation for hypeshelf',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <DocsHeader />
      <main className="lg:pl-[240px] pt-14">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
