import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetails } from '@/components/product/product-details'
import { products } from '@/data/products'
import { getProductBySlug } from '@/lib/catalog'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) {
    return {
      title: 'Product Not Found | Dastaan',
      description: 'The requested Dastaan fragrance could not be found.',
    }
  }
  return {
    title: `${product.name} | Dastaan`,
    description: product.description[0] ?? `Discover ${product.name}, a signature Dastaan fragrance.`,
    openGraph: {
      title: `${product.name} | Dastaan`,
      description: product.description[0] ?? `Discover ${product.name}, a signature Dastaan fragrance.`,
      images: [{ url: product.images[0], alt: product.name }],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()
  return <ProductDetails product={product} />
}
