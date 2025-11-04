import UserManager from '@/components/UserManager';
import PostManager from '@/components/PostManager';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Wizz Next Node
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Next.js + SQLite Boilerplate
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserManager />
          <PostManager />
        </div>
      </div>
    </div>
  );
}
