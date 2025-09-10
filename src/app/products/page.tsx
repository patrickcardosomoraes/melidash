'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { ProductsOverview } from '@/components/products/products-overview';
import { useAuthStore } from '@/lib/stores/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <div className="flex items-center space-x-2">
            {/* Aqui podem ser adicionados filtros ou ações */}
          </div>
        </div>
        <ProductsOverview />
      </div>
    </MainLayout>
  );
}