import { api } from "@/data/api";
import { Products } from "@/data/types/products";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface SearchProps {
	searchParams: {
		q: string;
	};
}

async function searchProducts(query: string): Promise<Products[]> {
	const response = await api(`/products/search?q=${query}`, {
		cache: "no-store",
	});
	const products = await response.json();
	return products;
}

export default async function Search({ searchParams }: SearchProps) {
	const { q: query } = searchParams;

	if (!query) {
		redirect("/");
	}

	const products = await searchProducts(query);
	return (
		<div className="flex flex-col gap-4">
			<p className="text-sm">
				Resultado para: <span className="font-semibold">{query}</span>
			</p>
			<div className="grid grid-cols-3 gap-6">
				{products.map((product) => {
					return (
						<Link
							key={product.id}
							href={product.slug}
							className="group relative rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-start max-h-[390px]"
						>
							<Image
								src={product.image}
								className="group-hover:scale-105 transition-transform duration-500 relative"
								width={480}
								height={480}
								quality={100}
								alt=""
							/>

							<div className="absolute bottom-10 right-10 h-11 flex items-center gap-2 max-w-[240px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
								<span className="text-sm truncate">{product.title}</span>
								<span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
									{product.price.toLocaleString("pt-br", {
										style: "currency",
										currency: "BRL",
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									})}
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
