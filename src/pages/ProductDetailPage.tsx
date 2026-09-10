import { useParams, Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";
import ProductPage from "../components/ProductPage";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useStore();
  const product = slug ? products.find((p) => p.slug === slug) : undefined;

  if (!product) {
    return (
      <section className="relative overflow-hidden bg-navy-950 pt-40 pb-24">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_20%,black,transparent)]" />
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-600/25 blur-[140px]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-xl">
            <AlertCircle className="h-8 w-8" />
          </span>
          <h1 className="font-display mt-6 text-4xl font-bold text-white sm:text-5xl">
            Product not found
          </h1>
          <p className="mt-4 text-slate-400">
            We couldn&apos;t find that product. Try one of these instead.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {products.map((p) => (
              <Link
                key={p.slug}
                to={`/products/${p.slug}`}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-sky-300 transition-colors hover:bg-white/10"
              >
                {p.name}
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/products"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl"
            >
              Browse all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <ProductPage product={product} />;
}
