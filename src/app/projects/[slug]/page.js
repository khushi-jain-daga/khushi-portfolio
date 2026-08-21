import { notFound } from "next/navigation";
import { products } from "../../../data/portfolio";
import ProjectStoryPage from "../../../components/portfolio/projects/ProjectStoryPage";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const index = products.findIndex((product) => product.id === slug);

  if (index < 0) {
    notFound();
  }

  const product = products[index];
  const nextProduct = products[(index + 1) % products.length];

  return <ProjectStoryPage product={product} nextProduct={nextProduct} />;
}
